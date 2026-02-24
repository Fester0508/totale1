"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RisultatoAnalisi, StatoAnalisi } from "@/lib/types";
import type { AccessLevel } from "@/hooks/use-paywall";

interface UseAnalysisReturn {
  stato: StatoAnalisi;
  risultato: RisultatoAnalisi | null;
  error: string | null;
  accessLevel: AccessLevel;
  startAnalysis: () => void;
}

export function useAnalysis(
  analisiId: string,
  documentType?: string
): UseAnalysisReturn {
  const [stato, setStato] = useState<StatoAnalisi>("processing");
  const [risultato, setRisultato] = useState<RisultatoAnalisi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("full");
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

    // Timeout 90 secondi (OCR + analisi AI)
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    isProcessing.current = true;

    try {
      setStato("processing");
      setError(null);

      // Recupera file da sessionStorage (per demo mode)
      let fileBase64: string | null = null;
      let fileMime: string | null = null;
      try {
        fileBase64 = sessionStorage.getItem(`file_${analisiId}`);
        fileMime = sessionStorage.getItem(`mime_${analisiId}`);
      } catch {
        // sessionStorage non disponibile
      }

      const response = await fetch("/api/analizza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: analisiId,
          documentType: documentType || "busta-paga",
          ...(fileBase64 && fileMime ? { fileBase64, fileMime } : {}),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'analisi");
      }

      setRisultato(data.risultato);
      if (data.accessLevel) setAccessLevel(data.accessLevel);
      setStato("completed");

      // Pulisci sessionStorage
      try {
        sessionStorage.removeItem(`file_${analisiId}`);
        sessionStorage.removeItem(`mime_${analisiId}`);
      } catch {}
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("L'analisi ha impiegato troppo tempo. Riprova.");
        setStato("error");
      } else {
        setError(
          err instanceof Error ? err.message : "Errore durante l'analisi"
        );
        setStato("error");
      }
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

  return { stato, risultato, error, accessLevel, startAnalysis };
}
