"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log("[v0] Error boundary caught:", error?.message, error?.stack);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Si è verificato un errore
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Qualcosa è andato storto. Prova a ricaricare la pagina.
        </p>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Riprova
        </Button>
      </main>
    </div>
  );
}
