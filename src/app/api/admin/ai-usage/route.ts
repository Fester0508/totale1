import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const period = searchParams.get("period") || "month";

  const now = new Date();
  let since: Date;
  switch (period) {
    case "today":
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      since = new Date("2020-01-01T00:00:00Z");
      break;
    case "month":
    default:
      since = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const rows = await prisma.aiUsage.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  // Aggregazioni
  let totaleTokensInput = 0;
  let totaleTokensOutput = 0;
  let totaleCostoUsd = 0;
  let totaleErrori = 0;
  const perModello: Record<string, { chiamate: number; tokens_input: number; tokens_output: number; costo_usd: number }> = {};

  for (const row of rows) {
    totaleTokensInput += row.tokensInput;
    totaleTokensOutput += row.tokensOutput;
    totaleCostoUsd += Number(row.costoUsd);
    if (row.errore) totaleErrori++;

    if (!perModello[row.modello]) {
      perModello[row.modello] = { chiamate: 0, tokens_input: 0, tokens_output: 0, costo_usd: 0 };
    }
    perModello[row.modello].chiamate++;
    perModello[row.modello].tokens_input += row.tokensInput;
    perModello[row.modello].tokens_output += row.tokensOutput;
    perModello[row.modello].costo_usd += Number(row.costoUsd);
  }

  // Aggregazione per giorno
  const perGiorno: Record<string, { chiamate: number; costo_usd: number; tokens_input: number; tokens_output: number }> = {};
  for (const row of rows) {
    const giorno = row.createdAt.toISOString().substring(0, 10);
    if (!perGiorno[giorno]) {
      perGiorno[giorno] = { chiamate: 0, costo_usd: 0, tokens_input: 0, tokens_output: 0 };
    }
    perGiorno[giorno].chiamate++;
    perGiorno[giorno].costo_usd += Number(row.costoUsd);
    perGiorno[giorno].tokens_input += row.tokensInput;
    perGiorno[giorno].tokens_output += row.tokensOutput;
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
