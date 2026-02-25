"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RisultatoAnalisi, StatoAnalisi } from "@/lib/types";
import type { AccessLevel } from "@/hooks/use-paywall";
import type { AccessConfig } from "@/domain/user-plan";

interface UseAnalysisReturn {
  stato: StatoAnalisi;
  risultato: RisultatoAnalisi | null;
  error: string | null;
  accessLevel: AccessLevel;
  accessConfig: AccessConfig | null;
  startAnalysis: () => void;
}

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_TIME = 120_000; // 2 minutes max polling

export function useAnalysis(
  analisiId: string,
  documentType?: string
): UseAnalysisReturn {
  const [stato, setStato] = useState<StatoAnalisi>("processing");
  const [risultato, setRisultato] = useState<RisultatoAnalisi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("full");
  const [accessConfig, setAccessConfig] = useState<AccessConfig | null>(null);
  const hasStarted = useRef(false);
  const isProcessing = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartRef = useRef<number>(0);

  const clearPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startAnalysis = useCallback(async () => {
    // Prevent concurrent calls
    if (isProcessing.current) return;

    // Abort any previous request
    abortControllerRef.current?.abort();
    clearPolling();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Timeout 90 seconds (OCR + AI analysis)
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    isProcessing.current = true;

    try {
      setStato("processing");
      setError(null);

      // Recover file from sessionStorage (for demo mode)
      let fileBase64: string | null = null;
      let fileMime: string | null = null;
      try {
        fileBase64 = sessionStorage.getItem(`file_${analisiId}`);
        fileMime = sessionStorage.getItem(`mime_${analisiId}`);
      } catch {
        // sessionStorage not available
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

      // If the server says it's still processing, start polling
      if (data.stato === "processing") {
        isProcessing.current = false;
        pollStartRef.current = Date.now();
        startPolling();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'analisi");
      }

      setRisultato(data.risultato);
      if (data.accessLevel) setAccessLevel(data.accessLevel);
      if (data.accessConfig) setAccessConfig(data.accessConfig);
      setStato("completed");

      // Clean up sessionStorage
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
  }, [analisiId, documentType, clearPolling]);

  // Polling: re-POST to check if the analysis is done
  const startPolling = useCallback(() => {
    const poll = async () => {
      // Check max poll time
      if (Date.now() - pollStartRef.current > MAX_POLL_TIME) {
        setError("L'analisi ha impiegato troppo tempo. Riprova.");
        setStato("error");
        return;
      }

      try {
        const response = await fetch("/api/analizza", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: analisiId,
            documentType: documentType || "busta-paga",
          }),
        });

        const data = await response.json();

        // Still processing - keep polling
        if (data.stato === "processing") {
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Errore durante l'analisi");
        }

        // Analysis completed
        setRisultato(data.risultato);
        if (data.accessLevel) setAccessLevel(data.accessLevel);
        if (data.accessConfig) setAccessConfig(data.accessConfig);
        setStato("completed");

        // Clean up sessionStorage
        try {
          sessionStorage.removeItem(`file_${analisiId}`);
          sessionStorage.removeItem(`mime_${analisiId}`);
        } catch {}
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Errore durante l'analisi"
        );
        setStato("error");
      }
    };

    pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
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
      clearPolling();
    };
  }, [clearPolling]);

  return { stato, risultato, error, accessLevel, accessConfig, startAnalysis };
}
