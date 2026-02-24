"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { AnalysisLoading } from "@/components/analysis-loading";
import { AnalysisResult } from "@/components/analysis-result";
import { useAnalysis } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function AnalisiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const documentType = searchParams.get("type") || "busta-paga";
  const { stato, risultato, error, accessLevel, startAnalysis } = useAnalysis(
    id,
    documentType
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {stato === "processing" && <AnalysisLoading />}

        {stato === "completed" && risultato && (
          <AnalysisResult risultato={risultato} id={id} accessLevel={accessLevel} />
        )}

        {stato === "error" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Si &egrave; verificato un errore
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {error ||
                "Non siamo riusciti ad analizzare il documento. Prova a caricarlo di nuovo."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={startAnalysis}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Riprova
              </Button>
              <Link href="/">
                <Button>Carica un altro documento</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
