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
import { Lock } from "lucide-react";
import Link from "next/link";

interface FreeLimitDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FreeLimitDialog({ open, onClose }: FreeLimitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-brand-amber" />
            Analisi gratuita esaurita
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground pt-2">
              <p>
                Hai usato la tua <strong>analisi gratuita del mese</strong>.
              </p>
              <p>
                Scegli un piano per continuare ad analizzare i tuoi
                cedolini e sbloccare i referti completi.
              </p>
              <ul className="space-y-2 pt-1">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Pay-Per-Error: &euro;3,99 una tantum</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Abbonamento: &euro;0,99/mese illimitato</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Pro + Chatbot: &euro;9,99/mese tutto incluso</span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button asChild className="bg-brand-amber hover:bg-brand-amber-dark text-accent-foreground">
            <Link href="/registrati">Registrati</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
