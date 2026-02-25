import { NextRequest, NextResponse } from "next/server";
import { MOCK_DATA_MAP, type DocumentType } from "@/lib/mock-data";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const maxDuration = 60;

// GET: check access level for a given analysis
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    const { getAccessConfig } = await import("@/rules/paywall-rules");
    const { UserPlan } = await import("@/domain/user-plan");
    return NextResponse.json({ accessLevel: "preview", accessConfig: getAccessConfig(UserPlan.FREE_FIRST) });
  }

  // Check authenticated user tier
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient: createAuthClient } = await import("@/lib/supabase/server");
      const supabaseAuth = await createAuthClient();
      const { data: { user } } = await supabaseAuth.auth.getUser();

      if (user) {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const { getUserPlan } = await import("@/services/billing");
        const { getAccessConfig } = await import("@/rules/paywall-rules");

        const plan = await getUserPlan(user.id);
        const config = getAccessConfig(plan);

        return NextResponse.json({
          accessLevel: config.isPaid ? "full" : "preview",
          accessConfig: config,
        });
      }
    } catch {
      // fallthrough to free-tier check
    }
  }

  // Anonymous / free user: check cookie
  const { getFreeTierStatus } = await import("@/lib/free-tier");
  const { MAX_FREE_FULL } = await import("@/lib/free-tier");
  const { getAccessConfig } = await import("@/rules/paywall-rules");
  const { UserPlan } = await import("@/domain/user-plan");

  const freeTier = await getFreeTierStatus(request);

  // First analysis (uses <= MAX_FREE_FULL) = full access (SIMPLE_SUBSCRIPTION equivalent)
  const isFirstAnalysis = freeTier.uses <= MAX_FREE_FULL;
  const plan = isFirstAnalysis ? UserPlan.SIMPLE_SUBSCRIPTION : UserPlan.FREE_FIRST;
  const config = getAccessConfig(plan);

  return NextResponse.json({
    accessLevel: isFirstAnalysis ? "full" : "preview",
    accessConfig: config,
  });
}

export async function POST(request: NextRequest) {
  const { id, documentType = "busta-paga", fileBase64, fileMime } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID analisi mancante" },
      { status: 400 }
    );
  }

  // Demo mode (no Supabase)
  if (DEMO_MODE) {
    // Se c'e' il file E la chiave OpenAI -> analisi reale
    if (fileBase64 && fileMime && process.env.OPENAI_API_KEY) {
      try {
        const { estraiDatiDocumento } = await import("@/lib/ai/ocr");
        const { analizzaBustaPaga } = await import("@/lib/ai/analisi");

        const fileBuffer = Buffer.from(fileBase64, "base64");

        // Step 1: OCR
        const ocrResult = await estraiDatiDocumento(fileBuffer, fileMime, documentType);
        const datiEstratti = ocrResult.data;

        // Step 2: Analisi
        const analisiResult = await analizzaBustaPaga(datiEstratti);
        const risultato = analisiResult.data;

        return NextResponse.json({ risultato, accessLevel: "full" });
      } catch (aiError) {
        console.error("Demo AI analysis failed:", aiError);
        // Fallback a mock data se l'AI fallisce
      }
    }

    // Fallback: mock data (no OPENAI_API_KEY or AI error)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockData = MOCK_DATA_MAP[(documentType as DocumentType)] || MOCK_DATA_MAP["busta-paga"];
    return NextResponse.json({ risultato: mockData, accessLevel: "full" });
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
        { error: "Analisi non trovata", code: "ERR-ANALYSIS-NOTFOUND" },
        { status: 404 }
      );
    }
    analisi = data;
  } else {
    // Utente anonimo: try cookie first, then fallback to direct DB lookup
    // (cookie may not be set yet if user just uploaded and navigated immediately)
    const { getFreeTierStatus } = await import("@/lib/free-tier");
    const freeTier = await getFreeTierStatus(request);

    const hasCookieId = freeTier.ids.includes(id);

    // Try direct DB lookup for anonymous analysis
    const { data, error: fetchError } = await supabase
      .from("analisi")
      .select("*")
      .eq("id", id)
      .is("user_id", null)
      .single();

    if (fetchError || !data) {
      return NextResponse.json(
        { error: "Analisi non trovata", code: "ERR-ANALYSIS-NOTFOUND" },
        { status: 404 }
      );
    }

    // If cookie doesn't have this ID but the record exists and is anonymous,
    // allow access (the cookie was likely not set yet due to navigation timing)
    void hasCookieId;

    analisi = data;
  }

  // If analysis errored, allow retry
  if (analisi.stato === "error") {
    // Reset to processing so the pipeline re-runs
    await supabase
      .from("analisi")
      .update({ stato: "processing", processing_started_at: null })
      .eq("id", id);
    analisi.stato = "processing";
    analisi.processing_started_at = null;
  }

  // If already being processed by another request, return processing status for polling
  if (analisi.stato === "processing" && analisi.processing_started_at) {
    const startedAt = new Date(analisi.processing_started_at).getTime();
    const elapsed = Date.now() - startedAt;
    // If started less than 90s ago, assume it's still running - tell client to poll
    if (elapsed < 90_000) {
      return NextResponse.json({ stato: "processing" });
    }
    // If more than 90s, assume it timed out - allow re-run
    await supabase
      .from("analisi")
      .update({ processing_started_at: null })
      .eq("id", id);
  }

  if (analisi.stato === "completed") {
    const { getUserPlan } = await import("@/services/billing");
    const { getAccessConfig } = await import("@/rules/paywall-rules");
    const { UserPlan } = await import("@/domain/user-plan");

    let plan = UserPlan.FREE_FIRST;
    if (user) {
      plan = await getUserPlan(user.id);
    } else {
      const { getFreeTierStatus, MAX_FREE_FULL } = await import("@/lib/free-tier");
      const freeTier = await getFreeTierStatus(request);
      if (freeTier.uses <= MAX_FREE_FULL) plan = UserPlan.SIMPLE_SUBSCRIPTION;
    }

    const config = getAccessConfig(plan);
    return NextResponse.json({
      risultato: analisi.risultato,
      accessLevel: config.isPaid ? "full" : "preview",
      accessConfig: config,
    });
  }

  // Read file from Supabase Storage (or fall back to legacy base64)
  let fileBuffer: Buffer<ArrayBuffer>;
  let mimeType: string;

  if (analisi.storage_path) {
    const { data: fileData, error: dlError } = await supabase.storage
      .from("payslips")
      .download(analisi.storage_path);

    if (dlError || !fileData) {
      console.error("Storage download error:", dlError);
      await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
      return NextResponse.json(
        { error: "File del documento non trovato nello storage" },
        { status: 500 }
      );
    }

    fileBuffer = Buffer.from(await fileData.arrayBuffer());
    mimeType = analisi.file_mime || (analisi.file_type === "pdf" ? "application/pdf" : "image/jpeg");
  } else if (analisi.file_data) {
    // Legacy: base64 stored in DB
    fileBuffer = Buffer.from(analisi.file_data, "base64");
    mimeType = analisi.file_mime || (analisi.file_type === "pdf" ? "application/pdf" : "image/jpeg");
  } else {
    await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
    return NextResponse.json(
      { error: "File del documento non trovato" },
      { status: 500 }
    );
  }

  // Check OpenAI key before starting pipeline
  if (!process.env.OPENAI_API_KEY) {
    console.error("[CRITICAL] OPENAI_API_KEY is not configured");
    await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
    return NextResponse.json(
      { error: "Servizio temporaneamente non disponibile", code: "ERR-OPENAI-MISSING" },
      { status: 503 }
    );
  }

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

    // Determine access level for this user
    const { getUserPlan: getPlan } = await import("@/services/billing");
    const { getAccessConfig: getConfig } = await import("@/rules/paywall-rules");
    const { UserPlan: UP } = await import("@/domain/user-plan");

    let pipelinePlan = UP.FREE_FIRST;
    if (user) {
      pipelinePlan = await getPlan(user.id);
    } else {
      const { getFreeTierStatus, MAX_FREE_FULL } = await import("@/lib/free-tier");
      const freeTier = await getFreeTierStatus(request);
      if (freeTier.uses <= MAX_FREE_FULL) pipelinePlan = UP.SIMPLE_SUBSCRIPTION;
    }

    const pipelineConfig = getConfig(pipelinePlan);
    return NextResponse.json({
      risultato,
      accessLevel: pipelineConfig.isPaid ? "full" : "preview",
      accessConfig: pipelineConfig,
    });
  } catch (error) {
    console.error("Analizza pipeline error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      analisiId: id,
      demoMode: DEMO_MODE,
    });

    // Aggiorna stato DB a "error" per evitare record zombie
    try {
      if (!DEMO_MODE) {
        await supabase.from("analisi").update({ stato: "error" }).eq("id", id);
      }
    } catch (dbError) {
      console.error("Errore aggiornamento stato error:", dbError);
    }

    // Map known error codes to user-friendly messages
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg === "ERR-OPENAI-MISSING") {
      return NextResponse.json(
        { error: "Servizio temporaneamente non disponibile", code: "ERR-OPENAI-MISSING" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Errore durante l'analisi del documento",
        code: "ERR-PIPELINE",
      },
      { status: 500 }
    );
  }
}
