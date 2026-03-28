import { NextRequest, NextResponse } from "next/server";
import { MOCK_DATA_MAP, type DocumentType } from "@/lib/mock-data";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import * as fs from "fs/promises";
import * as path from "path";

const DEMO_MODE = !process.env.DATABASE_URL;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/uploads";

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
  const user = await getUser();

  if (user) {
    const { getUserPlan } = await import("@/services/billing");
    const { getAccessConfig } = await import("@/rules/paywall-rules");

    const plan = await getUserPlan(user.id);
    const config = getAccessConfig(plan);

    return NextResponse.json({
      accessLevel: config.isPaid ? "full" : "preview",
      accessConfig: config,
    });
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

  // Demo mode (no DB)
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
  const user = await getUser();

  const { estraiDatiDocumento } = await import("@/lib/ai/ocr");
  const { analizzaBustaPaga } = await import("@/lib/ai/analisi");

  let analisi;

  if (user) {
    // Utente autenticato: ownership check con user_id
    analisi = await prisma.analisi.findFirst({
      where: { id, userId: user.id },
    });

    if (!analisi) {
      return NextResponse.json(
        { error: "Analisi non trovata", code: "ERR-ANALYSIS-NOTFOUND" },
        { status: 404 }
      );
    }
  } else {
    // Utente anonimo: try cookie first, then fallback to direct DB lookup
    const { getFreeTierStatus } = await import("@/lib/free-tier");
    const freeTier = await getFreeTierStatus(request);
    void freeTier;

    // Try direct DB lookup for anonymous analysis
    analisi = await prisma.analisi.findFirst({
      where: { id, userId: null },
    });

    if (!analisi) {
      return NextResponse.json(
        { error: "Analisi non trovata", code: "ERR-ANALYSIS-NOTFOUND" },
        { status: 404 }
      );
    }
  }

  // If analysis errored, allow retry
  if (analisi.stato === "error") {
    await prisma.analisi.update({
      where: { id },
      data: { stato: "processing", processingStartedAt: null },
    });
    analisi = { ...analisi, stato: "processing", processingStartedAt: null };
  }

  // If already being processed by another request, return processing status for polling
  if (analisi.stato === "processing" && analisi.processingStartedAt) {
    const startedAt = new Date(analisi.processingStartedAt).getTime();
    const elapsed = Date.now() - startedAt;
    // If started less than 90s ago, assume it's still running - tell client to poll
    if (elapsed < 90_000) {
      return NextResponse.json({ stato: "processing" });
    }
    // If more than 90s, assume it timed out - allow re-run
    await prisma.analisi.update({
      where: { id },
      data: { processingStartedAt: null },
    });
  }

  if (analisi.stato === "completed") {
    const { getUserPlan: getPlan } = await import("@/services/billing");
    const { getAccessConfig: getConfig } = await import("@/rules/paywall-rules");
    const { UserPlan: UP } = await import("@/domain/user-plan");

    let plan = UP.FREE_FIRST;
    if (user) {
      plan = await getPlan(user.id);
    } else {
      const { getFreeTierStatus, MAX_FREE_FULL } = await import("@/lib/free-tier");
      const freeTier = await getFreeTierStatus(request);
      if (freeTier.uses <= MAX_FREE_FULL) plan = UP.SIMPLE_SUBSCRIPTION;
    }

    const config = getConfig(plan);
    return NextResponse.json({
      risultato: analisi.risultato,
      accessLevel: config.isPaid ? "full" : "preview",
      accessConfig: config,
    });
  }

  // Read file from local storage (or fall back to legacy base64)
  let fileBuffer: Buffer<ArrayBuffer>;
  let mimeType: string;

  if (analisi.storagePath) {
    try {
      const fullPath = path.join(UPLOAD_DIR, analisi.storagePath);
      const fileData = await fs.readFile(fullPath);
      fileBuffer = Buffer.from(fileData);
    } catch {
      console.error("Local storage read error for path:", analisi.storagePath);
      await prisma.analisi.update({ where: { id }, data: { stato: "error" } });
      return NextResponse.json(
        { error: "File del documento non trovato nello storage" },
        { status: 500 }
      );
    }
    mimeType = analisi.fileMime || (analisi.fileType === "pdf" ? "application/pdf" : "image/jpeg");
  } else if (analisi.fileData) {
    // Legacy: base64 stored in DB
    fileBuffer = Buffer.from(analisi.fileData, "base64");
    mimeType = analisi.fileMime || (analisi.fileType === "pdf" ? "application/pdf" : "image/jpeg");
  } else {
    await prisma.analisi.update({ where: { id }, data: { stato: "error" } });
    return NextResponse.json(
      { error: "File del documento non trovato" },
      { status: 500 }
    );
  }

  // Check OpenAI key before starting pipeline
  if (!process.env.OPENAI_API_KEY) {
    console.error("[CRITICAL] OPENAI_API_KEY is not configured");
    await prisma.analisi.update({ where: { id }, data: { stato: "error" } });
    return NextResponse.json(
      { error: "Servizio temporaneamente non disponibile", code: "ERR-OPENAI-MISSING" },
      { status: 503 }
    );
  }

  const { calcCosto } = await import("@/lib/ai/pricing");

  // Segna inizio elaborazione
  await prisma.analisi.update({
    where: { id },
    data: { processingStartedAt: new Date() },
  });

  try {
    // Step 1: OCR (file gia' ottimizzato all'upload)
    const ocrResult = await estraiDatiDocumento(fileBuffer, mimeType, documentType);
    const datiEstratti = ocrResult.data;

    // Log OCR usage
    try {
      await prisma.aiUsage.create({
        data: {
          analisiId: id,
          modello: "gpt-4o",
          fase: "ocr",
          tokensInput: ocrResult.tokensInput,
          tokensOutput: ocrResult.tokensOutput,
          costoUsd: calcCosto("gpt-4o", ocrResult.tokensInput, ocrResult.tokensOutput),
          durataMs: ocrResult.durata_ms,
        },
      });
    } catch (e) {
      console.error("Errore logging OCR usage:", e);
    }

    await prisma.analisi.update({
      where: { id },
      data: { datiEstratti },
    });

    // Step 2: Analisi
    const analisiResult = await analizzaBustaPaga(datiEstratti);
    const risultato = analisiResult.data;

    // Log analisi usage
    try {
      await prisma.aiUsage.create({
        data: {
          analisiId: id,
          modello: "gpt-4o",
          fase: "analisi",
          tokensInput: analisiResult.tokensInput,
          tokensOutput: analisiResult.tokensOutput,
          costoUsd: calcCosto("gpt-4o", analisiResult.tokensInput, analisiResult.tokensOutput),
          durataMs: analisiResult.durata_ms,
        },
      });
    } catch (e) {
      console.error("Errore logging analisi usage:", e);
    }

    await prisma.analisi.update({
      where: { id },
      data: {
        risultato,
        stato: "completed",
        semaforo: risultato.semaforo_globale,
        numeroAnomalie: risultato.anomalie?.length || 0,
      },
    });

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
        await prisma.analisi.update({ where: { id }, data: { stato: "error" } });
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
