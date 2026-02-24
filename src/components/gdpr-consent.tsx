"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface GDPRConsentProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function GDPRConsent({ open, onAccept, onDecline }: GDPRConsentProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Privacy e trattamento dati
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground pt-2">
              <p>
                Per analizzare il tuo documento, dobbiamo elaborarlo tramite
                intelligenza artificiale. Ecco come trattiamo i tuoi dati:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>
                    Il documento viene eliminato automaticamente dopo 30 giorni
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>
                    Non conserviamo i tuoi dati personali
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>
                    I dati non vengono usati per addestrare modelli AI
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>
                    Connessione crittografata e storage sicuro
                  </span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground/70 pt-1">
                Procedendo, acconsenti al trattamento dei dati ai sensi del GDPR
                (Reg. UE 2016/679).{" "}
                <a href="/privacy" className="underline hover:text-foreground">
                  Leggi la Privacy Policy
                </a>
                . Puoi richiedere la cancellazione in qualsiasi momento.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onDecline}>
            Annulla
          </Button>
          <Button onClick={onAccept}>
            Accetto e procedo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
