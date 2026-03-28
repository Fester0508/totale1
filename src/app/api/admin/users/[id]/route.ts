import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Utente non trovato" },
      { status: 404 }
    );
  }

  const analisi = await prisma.analisi.findMany({
    where: { userId: id },
    select: {
      id: true,
      stato: true,
      semaforo: true,
      fileType: true,
      numeroAnomalie: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.createdAt,
      last_sign_in_at: user.updatedAt,
    },
    profile: user.profile,
    analisi: analisi.map((a) => ({
      id: a.id,
      stato: a.stato,
      semaforo: a.semaforo,
      file_type: a.fileType,
      numero_anomalie: a.numeroAnomalie,
      created_at: a.createdAt,
    })),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json(
      { error: "Utente non trovato" },
      { status: 404 }
    );
  }

  // Conta analisi utente per il log
  const analisiCount = await prisma.analisi.count({ where: { userId: id } });

  // Log GDPR
  const emailHash = await sha256(user.email ?? "");
  await prisma.gdprDeletionLog.create({
    data: {
      userEmailHash: emailHash,
      deletionType: "admin_request",
      itemsDeleted: { analisi_count: analisiCount },
      requestedBy: "admin",
      completedAt: new Date(),
    },
  });

  // Elimina utente (CASCADE elimina profilo e analisi)
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "Errore nell'eliminazione dell'utente" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
