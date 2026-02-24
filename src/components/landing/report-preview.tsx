import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

export function ReportPreview() {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden animate-float">
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Report Istantaneo
        </p>
      </div>

      {/* Traffic light items */}
      <div className="px-6 space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-foreground">
              Stipendio base corretto
            </span>
          </div>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-sm text-foreground">
              Trattenute INPS da verificare
            </span>
          </div>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-sm text-foreground">
              Scatto anzianit&agrave; mancante: -&euro;47/mese
            </span>
          </div>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
      </div>

      {/* Retribuzione summary */}
      <div className="mx-6 border-t border-border/50 py-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lordo</span>
          <span className="font-semibold text-foreground">
            &euro;2.150
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trattenute</span>
          <span className="font-semibold text-red-500">-&euro;485</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border/50 pt-1.5">
          <span className="font-semibold text-foreground">Netto</span>
          <span className="font-bold text-foreground">&euro;1.665</span>
        </div>
      </div>

      {/* Tip */}
      <div className="m-4 mt-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3.5 flex gap-2.5">
        <Lightbulb className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80 leading-relaxed">
          <span className="font-semibold">Consiglio:</span> Hai diritto a 2
          scatti di anzianit&agrave; non applicati. Potenziale recupero:{" "}
          <span className="font-semibold text-brand-amber">
            &euro;564/anno
          </span>
        </p>
      </div>
    </div>
  );
}
