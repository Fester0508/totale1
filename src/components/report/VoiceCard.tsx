"use client";

import { useState } from "react";
import type { VoceAnalisi } from "@/lib/types";
import { PaywallBlur } from "./PaywallBlur";

type Severity = "rosso" | "giallo" | "verde";

const cfg: Record<Severity, { borderColor: string; bg: string; chipBg: string; chipText: string; chipLabel: string }> = {
  rosso:  { borderColor: "border-l-[#C62828]", bg: "bg-[#FFF8F8]", chipBg: "bg-[#FFEBEE]", chipText: "text-[#C62828]", chipLabel: "ERRORE" },
  giallo: { borderColor: "border-l-[#E65100]", bg: "bg-[#FFFAF5]", chipBg: "bg-[#FFF3E0]", chipText: "text-[#E65100]", chipLabel: "VERIFICA" },
  verde:  { borderColor: "border-l-[#2E7D32]", bg: "bg-[#F9FFF9]", chipBg: "bg-[#E8F5E9]", chipText: "text-[#2E7D32]", chipLabel: "CORRETTO" },
};

interface VoiceCardProps {
  voce: VoceAnalisi & { codice: string };
  isPaid: boolean;
}

export function VoiceCard({ voce, isPaid }: VoiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const c = cfg[voce.stato];
  const impatto = (voce as VoceAnalisi & { impatto_euro?: number | null }).impatto_euro;

  return (
    <div
      className={`rounded-lg border border-l-4 ${c.borderColor} ${c.bg} transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5`}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-mono">
              {voce.codice}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
              &middot;
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
              {voce.categoria ?? "GENERALE"}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mt-0.5 leading-snug text-sm md:text-base line-clamp-2">
            {voce.nome}
          </h3>

          {/* Description - blur for free */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            {isPaid ? (
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {voce.spiegazione}
              </p>
            ) : (
              <PaywallBlur locked>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {voce.spiegazione}
                </p>
              </PaywallBlur>
            )}
            {isPaid && voce.riferimento_normativo && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Rif.: {voce.riferimento_normativo}
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          {voce.stato === "verde" ? (
            <>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E8F5E9]">
                <svg className="h-4 w-4 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className={`text-xs font-semibold mt-1 ${c.chipText}`}>{c.chipLabel}</p>
            </>
          ) : (
            <>
              {/* Importo SEMPRE visibile -- il gancio per convertire */}
              <p className="font-semibold text-foreground whitespace-nowrap">
                {voce.stato === "rosso" ? "\u2013" : "~"} &euro;
                {Math.abs(impatto ?? voce.importo).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${c.chipBg} ${c.chipText} mt-1`}>
                {c.chipLabel}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
