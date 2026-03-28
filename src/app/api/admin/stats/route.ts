import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Query parallele
  const [
    total,
    today,
    week,
    month,
    semaforoData,
    errors,
    topCcnlData,
    topAnomalieData,
    aiCostMonth,
    usersCount,
    trendData,
  ] = await Promise.all([
    prisma.analisi.count(),
    prisma.analisi.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.analisi.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.analisi.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.analisi.findMany({
      where: { semaforo: { not: null } },
      select: { semaforo: true },
    }),
    prisma.analisi.count({ where: { stato: "error" } }),
    prisma.$queryRaw<{ ccnl: string; totale: bigint }[]>`
      SELECT risultato -> 'dati_anagrafici' ->> 'ccnl' AS ccnl, COUNT(*) AS totale
      FROM analisi WHERE risultato IS NOT NULL AND risultato -> 'dati_anagrafici' ->> 'ccnl' IS NOT NULL
      GROUP BY 1 ORDER BY 2 DESC LIMIT 10
    `,
    prisma.$queryRaw<{ titolo: string; totale: bigint }[]>`
      SELECT anomalia ->> 'titolo' AS titolo, COUNT(*) AS totale
      FROM analisi, jsonb_array_elements(risultato -> 'anomalie') AS anomalia
      WHERE risultato IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10
    `,
    prisma.aiUsage.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { costoUsd: true },
    }),
    prisma.user.count(),
    prisma.analisi.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Calcola distribuzione semaforo
  const semaforoDist = { verde: 0, giallo: 0, rosso: 0 };
  for (const row of semaforoData) {
    const s = row.semaforo as keyof typeof semaforoDist;
    if (s in semaforoDist) semaforoDist[s]++;
  }

  // Calcola costo AI del mese
  const costoMese = aiCostMonth.reduce(
    (sum, r) => sum + Number(r.costoUsd),
    0
  );

  // Trend ultimi 30 giorni
  const trendMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    trendMap[d.toISOString().substring(0, 10)] = 0;
  }
  for (const row of trendData) {
    const day = row.createdAt.toISOString().substring(0, 10);
    if (day in trendMap) trendMap[day]++;
  }
  const trend30Giorni = Object.entries(trendMap)
    .map(([data, conteggio]) => ({ data, conteggio }))
    .sort((a, b) => a.data.localeCompare(b.data));

  return NextResponse.json({
    contatori: {
      totale: total,
      oggi: today,
      settimana: week,
      mese: month,
    },
    utenti_registrati: usersCount,
    semaforo: semaforoDist,
    tasso_errore: total > 0 ? ((errors / total) * 100).toFixed(1) : "0",
    top_ccnl: topCcnlData.map((r) => ({ ccnl: r.ccnl, totale: Number(r.totale) })),
    top_anomalie: topAnomalieData.map((r) => ({ titolo: r.titolo, totale: Number(r.totale) })),
    costo_ai_mese: costoMese,
    trend_30_giorni: trend30Giorni,
  });
}
