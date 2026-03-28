import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const analisi = await prisma.analisi.findUnique({ where: { id } });

  if (!analisi) {
    return NextResponse.json(
      { error: "Analisi non trovata" },
      { status: 404 }
    );
  }

  // AI usage per questa analisi
  const aiUsage = await prisma.aiUsage.findMany({
    where: { analisiId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    analisi,
    ai_usage: aiUsage,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.analisi.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "Errore nella cancellazione dell'analisi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
