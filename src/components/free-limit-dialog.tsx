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
            <Lock className="h-5 w-5 text-amber-600" />
            Analisi gratuita esaurita
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground pt-2">
              <p>
                Hai già utilizzato la tua <strong>analisi gratuita</strong>.
              </p>
              <p>
                Crea un account gratuito per continuare ad analizzare i tuoi
                documenti di lavoro. La registrazione richiede solo 30 secondi.
              </p>
              <ul className="space-y-2 pt-1">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Analisi illimitate</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Storico delle tue analisi</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">&#10003;</span>
                  <span>Dashboard personale</span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button asChild>
            <Link href="/registrati">Registrati gratis</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
