import { NextRequest, NextResponse } from "next/server";
import { validateFile } from "@/lib/file-utils";
import { v4 as uuidv4 } from "uuid";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file caricato" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID mancante" },
        { status: 400 }
      );
    }

    // Validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Demo mode: skip Supabase, return a fake ID
    if (DEMO_MODE) {
      const analisiId = uuidv4();
      return NextResponse.json({ id: analisiId });
    }

    // --- Production mode: upload to Supabase ---
    // Verifica autenticazione utente o free tier
    const { createClient: createAuthClient } = await import("@/lib/supabase/server");
    const supabaseAuth = await createAuthClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    let userId: string | null = null;
    let freeTierStatus: { uses: number; ids: string[] } | null = null;

    if (user) {
      userId = user.id;
    } else {
      const { getFreeTierStatus, MAX_FREE_USES } = await import("@/lib/free-tier");
      freeTierStatus = await getFreeTierStatus(request);

      if (freeTierStatus.uses >= MAX_FREE_USES) {
        return NextResponse.json(
          {
            error: "Hai già utilizzato la tua analisi gratuita. Registrati per continuare!",
            code: "FREE_LIMIT_REACHED",
          },
          { status: 403 }
        );
      }
    }

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { convertHeicToJpeg, optimizeImage, isHeic, isPdf, getFileExtension } =
      await import("@/lib/file-utils");

    let buffer: Buffer<ArrayBuffer> = Buffer.from(await file.arrayBuffer());
    let finalExtension = getFileExtension(file.name);
    let finalMimeType = file.type;

    // Converti HEIC → JPEG
    if (isHeic(file.name, file.type)) {
      buffer = Buffer.from(await convertHeicToJpeg(buffer));
      finalExtension = "jpg";
      finalMimeType = "image/jpeg";
    }

    // Ottimizza tutte le immagini (incluse HEIC convertite)
    if (!isPdf(file.type)) {
      buffer = Buffer.from(await optimizeImage(buffer));
      finalExtension = "jpg";
      finalMimeType = "image/jpeg";
    }

    const supabase = createAdminClient();
    const fileId = uuidv4();
    const storagePath = `${sessionId}/${fileId}.${finalExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("documenti")
      .upload(storagePath, buffer, {
        contentType: finalMimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Errore durante il caricamento del file" },
        { status: 500 }
      );
    }

    const analisiId = uuidv4();
    const { error: dbError } = await supabase.from("analisi").insert({
      id: analisiId,
      session_id: sessionId,
      user_id: userId,
      file_url: storagePath,
      file_type: isPdf(file.type) ? "pdf" : finalExtension,
      stato: "processing",
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Errore durante la creazione dell'analisi" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ id: analisiId });

    // Aggiorna cookie free-tier per utenti anonimi
    if (!user && freeTierStatus) {
      const { setFreeTierCookie } = await import("@/lib/free-tier");
      await setFreeTierCookie(response, {
        uses: freeTierStatus.uses + 1,
        ids: [...freeTierStatus.ids, analisiId],
      });
    }

    return response;
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
