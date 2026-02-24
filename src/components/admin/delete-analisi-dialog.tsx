"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteAnalisiDialogProps {
  analisiId: string;
  onDeleted: () => void;
}

export function DeleteAnalisiDialog({
  analisiId,
  onDeleted,
}: DeleteAnalisiDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analisi/${analisiId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpen(false);
        onDeleted();
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
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setError(null); }}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Elimina
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma eliminazione</DialogTitle>
          <DialogDescription>
            Questa azione eliminerà permanentemente l&apos;analisi e il file
            associato. Non è reversibile.
          </DialogDescription>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminazione..." : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
