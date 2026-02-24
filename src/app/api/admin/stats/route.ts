import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Query parallele
  const [
    totalRes,
    todayRes,
    weekRes,
    monthRes,
    semaforoRes,
    errorRes,
    topCcnlRes,
    topAnomalieRes,
    aiCostMonthRes,
    usersRes,
    trendRes,
  ] = await Promise.all([
    supabase.from("analisi").select("id", { count: "exact", head: true }),
    supabase.from("analisi").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("analisi").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("analisi").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("analisi").select("semaforo").not("semaforo", "is", null),
    supabase.from("analisi").select("id", { count: "exact", head: true }).eq("stato", "error"),
    supabase.rpc("top_ccnl", { limit_n: 10 }),
    supabase.rpc("top_anomalie", { limit_n: 10 }),
    supabase.from("ai_usage").select("costo_usd").gte("created_at", monthStart),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
    supabase.from("analisi").select("created_at").gte("created_at", thirtyDaysAgo),
  ]);

  // Calcola distribuzione semaforo
  const semaforoDist = { verde: 0, giallo: 0, rosso: 0 };
  if (semaforoRes.data) {
    for (const row of semaforoRes.data) {
      const s = row.semaforo as keyof typeof semaforoDist;
      if (s in semaforoDist) semaforoDist[s]++;
    }
  }

  // Calcola costo AI del mese
  const costoMese = aiCostMonthRes.data?.reduce(
    (sum: number, r: { costo_usd: number }) => sum + Number(r.costo_usd),
    0
  ) ?? 0;

  const total = totalRes.count ?? 0;
  const errors = errorRes.count ?? 0;

  // Conteggio utenti registrati
  const utentiRegistrati = usersRes.data?.users?.length === 1
    ? (usersRes as unknown as { data: { users: unknown[]; total?: number } }).data.total ?? 0
    : 0;

  // Trend ultimi 30 giorni
  const trendMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    trendMap[d.toISOString().substring(0, 10)] = 0;
  }
  for (const row of trendRes.data ?? []) {
    const day = (row.created_at as string).substring(0, 10);
    if (day in trendMap) trendMap[day]++;
  }
  const trend30Giorni = Object.entries(trendMap)
    .map(([data, conteggio]) => ({ data, conteggio }))
    .sort((a, b) => a.data.localeCompare(b.data));

  return NextResponse.json({
    contatori: {
      totale: total,
      oggi: todayRes.count ?? 0,
      settimana: weekRes.count ?? 0,
      mese: monthRes.count ?? 0,
    },
    utenti_registrati: utentiRegistrati,
    semaforo: semaforoDist,
    tasso_errore: total > 0 ? ((errors / total) * 100).toFixed(1) : "0",
    top_ccnl: topCcnlRes.data ?? [],
    top_anomalie: topAnomalieRes.data ?? [],
    costo_ai_mese: costoMese,
    trend_30_giorni: trend30Giorni,
  });
}
