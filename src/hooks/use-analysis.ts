"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RisultatoAnalisi, StatoAnalisi } from "@/lib/types";

interface UseAnalysisReturn {
  stato: StatoAnalisi;
  risultato: RisultatoAnalisi | null;
  error: string | null;
  startAnalysis: () => void;
}

export function useAnalysis(
  analisiId: string,
  documentType?: string
): UseAnalysisReturn {
  const [stato, setStato] = useState<StatoAnalisi>("processing");
  const [risultato, setRisultato] = useState<RisultatoAnalisi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);
  const isProcessing = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startAnalysis = useCallback(async () => {
    // Previeni chiamate concorrenti
    if (isProcessing.current) return;

    // Annulla eventuale richiesta precedente
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    isProcessing.current = true;

    try {
      setStato("processing");
      setError(null);

      const response = await fetch("/api/analizza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: analisiId,
          documentType: documentType || "busta-paga",
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'analisi");
      }

      setRisultato(data.risultato);
      setStato("completed");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Errore durante l'analisi"
      );
      setStato("error");
    } finally {
      isProcessing.current = false;
    }
  }, [analisiId, documentType]);

  // Auto-start analysis when component mounts (once only)
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startAnalysis();
  }, [startAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { stato, risultato, error, startAnalysis };
}
