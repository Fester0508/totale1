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
  analysisCount: number;
}

export function UpsellModal({ open, onClose, analysisCount }: UpsellModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Hai usato {analysisCount} analisi su 3
          </DialogTitle>
          <DialogDescription>
            Le analisi gratuite sono finite. Scegli un piano per continuare.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="border border-brand-amber rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-foreground">Pay-Per-Error</h4>
              <span className="text-lg font-bold text-brand-navy">&euro;3,99</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Paghi solo quando trovi anomalie. Nessun abbonamento.
            </p>
            <Link
              href="/registrati"
              className="block text-center py-2.5 rounded-sm bg-brand-amber text-accent-foreground font-semibold text-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors"
            >
              Scegli questo
            </Link>
          </div>

          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-foreground">Ultra-Low</h4>
              <span className="text-lg font-bold text-brand-navy">&euro;0,99/mese</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Analisi illimitate. Meno di un caffe al mese.
            </p>
            <Link
              href="/registrati"
              className="block text-center py-2.5 rounded-sm bg-brand-navy text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:bg-brand-navy-light transition-colors"
            >
              Scegli questo
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
