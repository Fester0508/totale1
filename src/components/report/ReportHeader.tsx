import type { RisultatoAnalisi, SemaforoColore } from "@/lib/types";

const badgeCfg: Record<SemaforoColore, { label: string; bg: string; border: string; text: string }> = {
  rosso: { label: "Anomalie Rilevate", bg: "bg-[#FFF3E0]", border: "border-[#E65100]", text: "text-[#E65100]" },
  giallo: { label: "Anomalie Rilevate", bg: "bg-[#FFF3E0]", border: "border-[#E65100]", text: "text-[#E65100]" },
  verde: { label: "Tutto OK", bg: "bg-[#E8F5E9]", border: "border-[#2E7D32]", text: "text-[#2E7D32]" },
};

export function generateRefNumber(id?: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const short = id ? id.replace(/-/g, "").slice(0, 5).toUpperCase() : "00000";
  return `REF-${y}-${m}-${short}`;
}

interface Props {
  risultato: RisultatoAnalisi;
  refNumber: string;
}

export function ReportHeader({ risultato, refNumber }: Props) {
  const badge = badgeCfg[risultato.semaforo_globale];
  const ana = risultato.dati_anagrafici;

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Intestatario Cedolino
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
            {ana?.nome ?? "\u2014"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            {ana?.ccnl && (
              <span>
                {"Contratto: "}
                <span className="font-medium text-foreground">
                  {ana.ccnl}
                </span>
              </span>
            )}
            {ana?.livello && <span>Livello: {ana.livello}</span>}
            {ana?.anzianita && <span>Anzianit&agrave;: {ana.anzianita}</span>}
            {ana?.mese_anno && <span>Mese: {ana.mese_anno}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 gap-1.5">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Referto
          </p>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-semibold ${badge.bg} ${badge.border} ${badge.text}`}
          >
            {risultato.semaforo_globale !== "verde" && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h18.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
              </svg>
            )}
            {badge.label}
          </span>
          <p className="text-xs text-muted-foreground font-mono">{refNumber}</p>
        </div>
      </div>
    </div>
  );
}
