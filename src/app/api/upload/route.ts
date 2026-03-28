import { NextRequest, NextResponse } from "next/server";
import { validateFile } from "@/lib/file-utils";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import * as path from "path";

const DEMO_MODE = !process.env.DATABASE_URL;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/uploads";

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

    // Demo mode: skip DB, return a fake ID
    if (DEMO_MODE) {
      const analisiId = uuidv4();
      return NextResponse.json({ id: analisiId, mimeType: file.type });
    }

    // --- Production mode ---
    const user = await getUser();

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
            error: "Hai gia' utilizzato la tua analisi gratuita. Registrati per continuare!",
            code: "FREE_LIMIT_REACHED",
          },
          { status: 403 }
        );
      }
    }

    const { convertHeicToJpeg, optimizeImage, isHeic, isPdf } =
      await import("@/lib/file-utils");

    let buffer: Buffer<ArrayBuffer> = Buffer.from(await file.arrayBuffer());
    let finalMimeType = file.type;

    // Converti HEIC -> JPEG
    if (isHeic(file.name, file.type)) {
      buffer = Buffer.from(await convertHeicToJpeg(buffer));
      finalMimeType = "image/jpeg";
    }

    // Ottimizza tutte le immagini
    if (!isPdf(file.type)) {
      buffer = Buffer.from(await optimizeImage(buffer));
      finalMimeType = "image/jpeg";
    }

    // Save file to local filesystem
    const analisiId = uuidv4();
    const ext = isPdf(file.type) ? "pdf" : "jpg";
    const storagePath = `${userId ?? "anon"}/${analisiId}.${ext}`;
    const fullPath = path.join(UPLOAD_DIR, storagePath);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);

    await prisma.analisi.create({
      data: {
        id: analisiId,
        sessionId: sessionId,
        userId: userId,
        fileUrl: `local://${storagePath}`,
        storagePath: storagePath,
        fileMime: finalMimeType,
        fileType: ext,
        stato: "processing",
      },
    });

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
