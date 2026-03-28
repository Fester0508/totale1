import { NextResponse } from "next/server";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  // Recupera profilo utente
  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
  });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  // Recupera tutte le analisi dell'utente
  const analisi = await prisma.analisi.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      fileType: true,
      stato: true,
      semaforo: true,
      numeroAnomalie: true,
      datiEstratti: true,
      risultato: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const exportData = {
    esportazione: {
      data_esportazione: new Date().toISOString(),
      formato: "GDPR Art. 20 - Diritto alla portabilità dei dati",
      servizio: "LavoroChiaro",
    },
    profilo: {
      email: user.email,
      registrato_il: dbUser?.createdAt,
      consenso_privacy: profile?.privacyAcceptedAt ?? null,
      consenso_termini: profile?.termsAcceptedAt ?? null,
      consenso_marketing: profile?.marketingConsent ?? false,
      consenso_marketing_data: profile?.marketingConsentAt ?? null,
    },
    analisi: analisi.map((a) => ({
      id: a.id,
      data_creazione: a.createdAt,
      data_scadenza: a.expiresAt,
      tipo_file: a.fileType,
      stato: a.stato,
      semaforo: a.semaforo,
      numero_anomalie: a.numeroAnomalie,
      dati_estratti: a.datiEstratti,
      risultato: a.risultato,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="lavorochiaro-dati-${Date.now()}.json"`,
    },
  });
}
