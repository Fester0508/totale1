"use client";

import { useState } from "react";
import type { VoceAnalisi } from "@/lib/types";
import { VoiceCard } from "./VoiceCard";

interface Props {
  voci: (VoceAnalisi & { codice: string })[];
  isPaid: boolean;
}

export function AnalysisResultsList({ voci, isPaid }: Props) {
  const [showOk, setShowOk] = useState(false);

  // Sort: errors by impact desc, then warnings by impact desc, then info, then ok
  const errors = voci
    .filter((v) => v.stato === "rosso")
    .sort((a, b) => Math.abs(b.impatto_euro ?? 0) - Math.abs(a.impatto_euro ?? 0));
  const warnings = voci
    .filter((v) => v.stato === "giallo")
    .sort((a, b) => Math.abs(b.impatto_euro ?? 0) - Math.abs(a.impatto_euro ?? 0));
  const ok = voci.filter((v) => v.stato === "verde");

  const sorted = [...errors, ...warnings];

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
        Risultanze Analisi
      </h2>
      <div className="space-y-3">
        {sorted.map((voce) => (
          <VoiceCard key={voce.codice} voce={voce} isPaid={isPaid} />
        ))}
      </div>

      {/* OK voices - collapsed accordion */}
      {ok.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowOk((p) => !p)}
            className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showOk ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">
              {ok.length} voci regolari
            </span>
            <span>&mdash; {showOk ? "Nascondi" : "Mostra dettaglio"}</span>
          </button>
          {showOk && (
            <div className="space-y-3 mt-2">
              {ok.map((voce) => (
                <VoiceCard key={voce.codice} voce={voce} isPaid={isPaid} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
