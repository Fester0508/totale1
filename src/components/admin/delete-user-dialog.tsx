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

interface DeleteUserDialogProps {
  userId: string;
  userEmail: string;
  onDeleted: () => void;
}

export function DeleteUserDialog({
  userId,
  userEmail,
  onDeleted,
}: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Elimina utente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma eliminazione utente</DialogTitle>
          <DialogDescription>
            Stai per eliminare permanentemente l&apos;utente{" "}
            <span className="font-medium text-foreground">{userEmail}</span> e
            tutti i dati associati (analisi, file, profilo). Questa azione non
            &egrave; reversibile.
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
            {loading ? "Eliminazione..." : "Elimina utente e dati"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
