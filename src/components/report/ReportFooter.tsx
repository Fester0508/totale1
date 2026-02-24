import type { VoceAnalisi } from "@/lib/types";
import { PaywallLock } from "./PaywallBlur";

interface Props {
  vociRosse: number;
  vociTotali: number;
  vociVerdi: number;
  importoRecuperabile: number;
  isPaid: boolean;
  refNumber: string;
}

export function ReportFooter({ vociRosse, vociTotali, vociVerdi, importoRecuperabile, isPaid, refNumber }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-6">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Errori Confermati
          </p>
          <p className="text-4xl font-bold text-[#C62828] mt-2">{vociRosse}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {vociRosse > 0
              ? "Richiedono correzione immediata"
              : "Nessun errore confermato"}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Voci Regolari
          </p>
          <p className="text-4xl font-bold text-foreground mt-2">{vociVerdi}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Su {vociTotali} voci analizzate, {vociVerdi} risultano corrette e conformi al contratto applicato
          </p>
        </div>
        {isPaid ? (
          <div className="bg-[#2E7D32] rounded-xl p-6 text-white">
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/70 font-medium">
              Importo Recuperabile
            </p>
            <p className="text-4xl font-bold mt-2">
              &euro; {importoRecuperabile.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-white/80 mt-2">
              Stima basata sulle anomalie rilevate &mdash; soggetta a verifica del consulente del lavoro
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border p-6">
            <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
              Importo Recuperabile
            </p>
            <div className="mt-3">
              <PaywallLock />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Disponibile con analisi completa
            </p>
          </div>
        )}
      </div>

      {/* Legal note - ALWAYS visible */}
      <LegalNote refNumber={refNumber} />
    </div>
  );
}

function LegalNote({ refNumber }: { refNumber: string }) {
  return (
    <footer className="border-t pt-6 flex flex-col md:flex-row md:justify-between gap-4">
      <p className="text-[11px] text-[#888888] max-w-2xl leading-relaxed italic">
        Nota legale: Il presente referto ha natura meramente informativa e non
        costituisce consulenza legale, fiscale o previdenziale. Per azioni legali
        o contestazioni formali rivolgersi a un consulente del lavoro abilitato.
      </p>
      <p className="text-[11px] text-[#888888] shrink-0 font-mono">
        {refNumber} &middot; lavoroinchiaro.it
      </p>
    </footer>
  );
}
