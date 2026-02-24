"use client";

import Link from "next/link";
import type { RisultatoAnalisi, VoceAnalisi } from "@/lib/types";
import { usePaywall, type AccessLevel } from "@/hooks/use-paywall";
import { ReportHeader, generateRefNumber } from "./report/ReportHeader";
import { KpiStrip } from "./report/KpiStrip";
import { AnalysisResultsList } from "./report/AnalysisResultsList";
import { DonutChart } from "./report/DonutChart";
import { Recommendations } from "./report/Recommendations";
import { ReportFooter } from "./report/ReportFooter";
import { PaywallBlur, PaywallHidden } from "./report/PaywallBlur";

interface AnalysisResultProps {
  risultato: RisultatoAnalisi;
  id?: string;
  accessLevel?: AccessLevel;
}

export function AnalysisResult({
  risultato,
  id,
  accessLevel = "preview",
}: AnalysisResultProps) {
  const pw = usePaywall(accessLevel);

  /* ── Computed values ── */
  const vociAll = risultato.voci ?? [];
  const vociRosse = vociAll.filter((v) => v.stato === "rosso");
  const vociVerdi = vociAll.filter((v) => v.stato === "verde");

  let rIdx = 0,
    gIdx = 0,
    vIdx = 0;
  const vociWithCodes = vociAll.map((voce) => {
    let codice: string;
    if (voce.stato === "rosso") codice = `ERR-${String(++rIdx).padStart(3, "0")}`;
    else if (voce.stato === "giallo") codice = `AVV-${String(++gIdx).padStart(3, "0")}`;
    else codice = `OK-${String(++vIdx).padStart(3, "0")}`;
    return { ...voce, codice };
  });

  const refNumber = generateRefNumber(id);

  const importoRecuperabile =
    risultato.importo_recuperabile ??
    vociRosse.reduce(
      (s, v) =>
        s + Math.abs((v as VoceAnalisi & { impatto_euro?: number | null }).impatto_euro ?? 0),
      0,
    );

  const lordo = risultato.retribuzione?.lordo ?? 0;
  const netto = risultato.retribuzione?.netto ?? 0;
  const score = risultato.score ?? null;

  const raccomandazioni =
    risultato.raccomandazioni ?? risultato.anomalie?.map((a) => a.cosa_fare) ?? [];

  return (
    <div className="max-w-[900px] mx-auto pb-12 space-y-6">
      {/* Back */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover:-translate-x-0.5 duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Nuova analisi
        </Link>
      </div>

      {/* Sezione A -- Header */}
      <ReportHeader risultato={risultato} refNumber={refNumber} />

      {/* Sezione B -- KPI Strip */}
      <KpiStrip
        lordo={lordo}
        netto={netto}
        score={score}
        recuperabile={importoRecuperabile}
        isPaid={pw.isPaid}
      />

      {/* Sezioni C + D + E -- Grid 60/40 */}
      <div className="grid md:grid-cols-[3fr_2fr] gap-6 items-start">
        {/* Left 60%: Sezione C -- Risultanze */}
        <AnalysisResultsList voci={vociWithCodes} isPaid={pw.isPaid} />

        {/* Right 40%: Sezione D -- Donut + Sezione E -- Raccomandazioni */}
        <div className="space-y-6">
          {/* Donut chart */}
          {risultato.retribuzione && (
            <div>
              <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
                Composizione Retribuzione
              </h2>
              {pw.canSeeDonut ? (
                <DonutChart retribuzione={risultato.retribuzione} />
              ) : (
                <PaywallBlur locked>
                  <DonutChart retribuzione={risultato.retribuzione} />
                </PaywallBlur>
              )}
            </div>
          )}

          {/* Recommendations */}
          {raccomandazioni.length > 0 && (
            pw.canSeeRecommendations ? (
              <Recommendations raccomandazioni={raccomandazioni} />
            ) : (
              <div>
                <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
                  Raccomandazioni
                </h2>
                <PaywallHidden />
              </div>
            )
          )}
        </div>
      </div>

      {/* Sezione F -- Footer */}
      <ReportFooter
        vociRosse={vociRosse.length}
        vociTotali={vociAll.length}
        vociVerdi={vociVerdi.length}
        importoRecuperabile={importoRecuperabile}
        isPaid={pw.isPaid}
        refNumber={refNumber}
      />
    </div>
  );
}
