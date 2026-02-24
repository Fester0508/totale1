import { NextRequest, NextResponse } from "next/server";
import { MOCK_DATA_MAP, type DocumentType } from "@/lib/mock-data";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { id, documentType = "busta-paga" } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID analisi mancante" },
      { status: 400 }
    );
  }

  // Demo mode: simulate delay then return mock data
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const mockData = MOCK_DATA_MAP[(documentType as DocumentType)] || MOCK_DATA_MAP["busta-paga"];
    return NextResponse.json({ risultato: mockData });
  }

  // --- Production mode: full AI pipeline ---
  // Verifica autenticazione utente o free tier
  const { createClient: createAuthClient } = await import("@/lib/supabase/server");
  const supabaseAuth = await createAuthClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { estraiDatiDocumento } = await import("@/lib/ai/ocr");
  const { analizzaBustaPaga } = await import("@/lib/ai/analisi");

  const supabase = createAdminClient();

  let analisi;

  if (user) {
    // Utente autenticato: ownership check con user_id
    const { data, error: fetchError } = await supabase
      .from("analisi")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !data) {
      return NextResponse.json(
        { error: "Analisi non trovata" },
        { status: 404 }
      );
    }
    analisi = data;
  } else {
    // Utente anonimo: ownership check via cookie free-tier
    const { getFreeTierStatus } = await import("@/lib/free-tier");
    const freeTier = await getFreeTierStatus(request);

    if (!freeTier.ids.includes(id)) {
      return NextResponse.json(
        { error: "Analisi non trovata" },
        { status: 404 }
      );
    }

    const { data, error: fetchError } = await supabase
      .from("analisi")
      .select("*")
      .eq("id", id)
      .is("user_id", null)
      .single();

    if (fetchError || !data) {
      return NextResponse.json(
        { error: "Analisi non trovata" },
        { status: 404 }
      );
    }
    analisi = data;
  }

  if (analisi.stato === "completed") {
    return NextResponse.json({ risultato: analisi.risultato });
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("documenti")
    .download(analisi.file_url);

  if (downloadError || !fileData) {
    await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
    return NextResponse.json(
      { error: "Errore nel download del documento" },
      { status: 500 }
    );
  }

  const fileBuffer: Buffer<ArrayBuffer> = Buffer.from(await fileData.arrayBuffer());
  const mimeType = analisi.file_type === "pdf" ? "application/pdf" : "image/jpeg";

  const { calcCosto } = await import("@/lib/ai/pricing");

  // Segna inizio elaborazione
  await supabase
    .from("analisi")
    .update({ processing_started_at: new Date().toISOString() })
    .eq("id", id);

  try {
    // Step 1: OCR (file già ottimizzato all'upload)
    const ocrResult = await estraiDatiDocumento(fileBuffer, mimeType, documentType);
    const datiEstratti = ocrResult.data;

    // Log OCR usage
    try {
      await supabase.from("ai_usage").insert({
        analisi_id: id,
        modello: "gpt-4o",
        fase: "ocr",
        tokens_input: ocrResult.tokensInput,
        tokens_output: ocrResult.tokensOutput,
        costo_usd: calcCosto("gpt-4o", ocrResult.tokensInput, ocrResult.tokensOutput),
        durata_ms: ocrResult.durata_ms,
      });
    } catch (e) {
      console.error("Errore logging OCR usage:", e);
    }

    await supabase
      .from("analisi")
      .update({ dati_estratti: datiEstratti })
      .eq("id", id);

    // Step 2: Analisi
    const analisiResult = await analizzaBustaPaga(datiEstratti);
    const risultato = analisiResult.data;

    // Log analisi usage
    try {
      await supabase.from("ai_usage").insert({
        analisi_id: id,
        modello: "gpt-4o",
        fase: "analisi",
        tokens_input: analisiResult.tokensInput,
        tokens_output: analisiResult.tokensOutput,
        costo_usd: calcCosto("gpt-4o", analisiResult.tokensInput, analisiResult.tokensOutput),
        durata_ms: analisiResult.durata_ms,
      });
    } catch (e) {
      console.error("Errore logging analisi usage:", e);
    }

    await supabase
      .from("analisi")
      .update({
        risultato,
        stato: "completed",
        semaforo: risultato.semaforo_globale,
        numero_anomalie: risultato.anomalie?.length || 0,
      })
      .eq("id", id);

    return NextResponse.json({ risultato });
  } catch (error) {
    console.error("Analizza pipeline error:", error);

    // Aggiorna stato DB a "error" per evitare record zombie
    try {
      await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
    } catch (dbError) {
      console.error("Errore aggiornamento stato error:", dbError);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore durante l'analisi del documento",
      },
      { status: 500 }
    );
  }
}
