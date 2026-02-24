import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const period = searchParams.get("period") || "month";

  const now = new Date();
  let since: string;
  switch (period) {
    case "today":
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      break;
    case "week":
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case "all":
      since = "2020-01-01T00:00:00Z";
      break;
    case "month":
    default:
      since = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      break;
  }

  const { data, error } = await supabase
    .from("ai_usage")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];

  // Aggregazioni
  let totaleTokensInput = 0;
  let totaleTokensOutput = 0;
  let totaleCostoUsd = 0;
  let totaleErrori = 0;
  const perModello: Record<string, { chiamate: number; tokens_input: number; tokens_output: number; costo_usd: number }> = {};

  for (const row of rows) {
    totaleTokensInput += row.tokens_input;
    totaleTokensOutput += row.tokens_output;
    totaleCostoUsd += Number(row.costo_usd);
    if (row.errore) totaleErrori++;

    if (!perModello[row.modello]) {
      perModello[row.modello] = { chiamate: 0, tokens_input: 0, tokens_output: 0, costo_usd: 0 };
    }
    perModello[row.modello].chiamate++;
    perModello[row.modello].tokens_input += row.tokens_input;
    perModello[row.modello].tokens_output += row.tokens_output;
    perModello[row.modello].costo_usd += Number(row.costo_usd);
  }

  // Aggregazione per giorno
  const perGiorno: Record<string, { chiamate: number; costo_usd: number; tokens_input: number; tokens_output: number }> = {};
  for (const row of rows) {
    const giorno = row.created_at.substring(0, 10);
    if (!perGiorno[giorno]) {
      perGiorno[giorno] = { chiamate: 0, costo_usd: 0, tokens_input: 0, tokens_output: 0 };
    }
    perGiorno[giorno].chiamate++;
    perGiorno[giorno].costo_usd += Number(row.costo_usd);
    perGiorno[giorno].tokens_input += row.tokens_input;
    perGiorno[giorno].tokens_output += row.tokens_output;
  }

  return NextResponse.json({
    totale_chiamate: rows.length,
    totale_tokens_input: totaleTokensInput,
    totale_tokens_output: totaleTokensOutput,
    totale_costo_usd: totaleCostoUsd,
    totale_errori: totaleErrori,
    per_modello: Object.entries(perModello).map(([modello, stats]) => ({
      modello,
      ...stats,
    })),
    per_giorno: Object.entries(perGiorno)
      .map(([data, stats]) => ({ data, ...stats }))
      .sort((a, b) => a.data.localeCompare(b.data)),
  });
}
