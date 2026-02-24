import { PaywallLock } from "./PaywallBlur";

function fmtEuro(v: number): string {
  return v.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function scoreColor(s: number): string {
  if (s <= 50) return "text-[#C62828]";
  if (s <= 75) return "text-[#E65100]";
  if (s <= 90) return "text-[#558B2F]";
  return "text-[#2E7D32]";
}

function scoreUnderline(s: number): string {
  if (s <= 50) return "bg-[#C62828]";
  if (s <= 75) return "bg-[#E65100]";
  if (s <= 90) return "bg-[#558B2F]";
  return "bg-[#2E7D32]";
}

function scoreLabel(s: number): string {
  if (s <= 50) return "Problemi critici";
  if (s <= 75) return "Anomalie presenti";
  if (s <= 90) return "Regolare";
  return "Eccellente";
}

interface KpiStripProps {
  lordo: number;
  netto: number;
  score: number | null;
  recuperabile: number;
  isPaid: boolean;
}

export function KpiStrip({ lordo, netto, score, recuperabile, isPaid }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Card 1 - Lordo: always visible */}
      <KpiCard
        label="Lordo Mensile"
        value={fmtEuro(lordo)}
        unit="euro"
        status="Nella media contrattuale"
        statusColor="text-[#2E7D32]"
        underlineColor="bg-[#2E7D32]"
      />
      {/* Card 2 - Netto: always visible */}
      <KpiCard
        label="Netto Accreditato"
        value={fmtEuro(netto)}
        unit="euro"
        status="Regolare"
        statusColor="text-[#2E7D32]"
        underlineColor="bg-[#2E7D32]"
      />
      {/* Card 3 - Score: locked for free */}
      {isPaid && score != null ? (
        <KpiCard
          label="Score Busta Paga"
          value={String(score)}
          unit="punti / 100"
          status={scoreLabel(score)}
          statusColor={scoreColor(score)}
          underlineColor={scoreUnderline(score)}
        />
      ) : (
        <div className="bg-card rounded-xl border p-5">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Score Busta Paga
          </p>
          <div className="mt-3">
            <PaywallLock placeholder="?" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">punti / 100</p>
        </div>
      )}
      {/* Card 4 - Recuperabile: locked for free */}
      {isPaid ? (
        <KpiCard
          label="Recuperabile"
          value={fmtEuro(recuperabile)}
          unit="euro stimati"
          status={recuperabile === 0 ? "Nessuna anomalia" : "Verifica consigliata"}
          statusColor={recuperabile === 0 ? "text-[#2E7D32]" : "text-[#E65100]"}
          underlineColor={recuperabile === 0 ? "bg-[#2E7D32]" : "bg-[#E65100]"}
        />
      ) : (
        <div className="bg-card rounded-xl border p-5">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
            Recuperabile
          </p>
          <div className="mt-3">
            <PaywallLock />
          </div>
          <p className="text-xs text-muted-foreground mt-1">euro stimati</p>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  unit,
  status,
  statusColor,
  underlineColor,
}: {
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  underlineColor: string;
}) {
  return (
    <div className="bg-card rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{unit}</p>
      <div className="mt-3">
        <p className={`text-xs font-semibold ${statusColor}`}>{status}</p>
        <div className={`h-0.5 w-12 mt-1 rounded ${underlineColor}`} />
      </div>
    </div>
  );
}
