import { NextResponse } from "next/server";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  // 1. Conta analisi dell'utente per il log
  const analisiCount = await prisma.analisi.count({
    where: { userId: user.id },
  });

  // 2. Scrivi nel log GDPR (prima di eliminare l'utente)
  const emailHash = await sha256(user.email ?? "");
  await prisma.gdprDeletionLog.create({
    data: {
      userEmailHash: emailHash,
      deletionType: "user_request",
      itemsDeleted: { analisi_count: analisiCount },
      requestedBy: "user",
      completedAt: new Date(),
    },
  });

  // 3. Elimina l'utente (CASCADE elimina user_profiles e analisi)
  try {
    await prisma.user.delete({ where: { id: user.id } });
  } catch {
    return NextResponse.json(
      { error: "Errore nell'eliminazione dell'account" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
