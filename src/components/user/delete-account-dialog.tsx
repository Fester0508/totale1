"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText === "ELIMINA";

  async function handleDelete() {
    if (!canDelete) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/?deleted=1");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Errore durante l'eliminazione");
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setConfirmText("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Elimina il mio account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elimina account</DialogTitle>
          <DialogDescription>
            Questa azione &egrave; irreversibile. Verranno eliminati
            permanentemente il tuo account, tutte le analisi e i file caricati.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            Digita{" "}
            <span className="font-mono font-bold text-foreground">ELIMINA</span>{" "}
            per confermare:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ELIMINA"
            autoComplete="off"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || loading}
          >
            {loading ? "Eliminazione..." : "Conferma eliminazione"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
