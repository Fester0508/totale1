"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UpsellModalProps {
  open: boolean;
  onClose: () => void;
  anomalieCount?: number;
  importoRecuperabile?: number;
}

export function UpsellModal({
  open,
  onClose,
  anomalieCount,
  importoRecuperabile,
}: UpsellModalProps) {
  const hasAnomalie = anomalieCount && anomalieCount > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-brand-navy">
            {hasAnomalie
              ? `Abbiamo trovato ${anomalieCount} anomalie`
              : "Hai usato la tua analisi gratuita del mese"}
          </DialogTitle>
          <DialogDescription className="pt-1">
            {hasAnomalie && importoRecuperabile
              ? `Scopri i dettagli e recupera fino a \u20ac${importoRecuperabile.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`
              : "Sblocca il referto completo per vedere dettagli, importi e raccomandazioni."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Pay-Per-Error */}
          <div className="border-2 border-brand-amber rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-foreground">Pay-Per-Error</h4>
              <span className="text-lg font-bold text-brand-navy">&euro;3,99</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Sblocca questa analisi. Una tantum, paghi solo una volta.
            </p>
            <Link
              href="/registrati"
              className="block text-center py-2.5 rounded-sm bg-brand-amber text-accent-foreground font-semibold text-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors"
            >
              Sblocca analisi
            </Link>
          </div>

          {/* Abbonamento */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-foreground">Abbonamento</h4>
                <span className="text-[9px] font-bold tracking-wider uppercase bg-brand-amber/10 text-brand-amber px-2 py-0.5 rounded">CONSIGLIATO</span>
              </div>
              <span className="text-lg font-bold text-brand-navy">&euro;0,99/mese</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Analisi illimitate, storico 24 mesi, alert mensili. Bloccato 6 mesi.
            </p>
            <Link
              href="/registrati"
              className="block text-center py-2.5 rounded-sm bg-brand-navy text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:bg-brand-navy-light transition-colors"
            >
              Abbonati ora
            </Link>
          </div>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Non ora
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
