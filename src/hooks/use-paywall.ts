"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lc_analysis_count";
const FREE_LIMIT = 3;

interface PaywallState {
  analysisCount: number;
  canAnalyze: boolean;
  remaining: number;
  showPaywall: boolean;
  isPro: boolean;
  incrementCount: () => void;
  dismissPaywall: () => void;
  openPaywall: () => void;
}

export function usePaywall(): PaywallState {
  const [analysisCount, setAnalysisCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setAnalysisCount(parseInt(stored, 10) || 0);

    // Check if user has pro subscription (from Satispay payment)
    const pro = localStorage.getItem("lc_pro");
    if (pro === "true") setIsPro(true);
  }, []);

  const remaining = Math.max(0, FREE_LIMIT - analysisCount);
  const canAnalyze = isPro || analysisCount < FREE_LIMIT;

  const incrementCount = useCallback(() => {
    if (isPro) return;
    const next = analysisCount + 1;
    setAnalysisCount(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    if (next >= FREE_LIMIT) setShowPaywall(true);
  }, [analysisCount, isPro]);

  const dismissPaywall = useCallback(() => setShowPaywall(false), []);
  const openPaywall = useCallback(() => setShowPaywall(true), []);

  return {
    analysisCount,
    canAnalyze,
    remaining,
    showPaywall,
    isPro,
    incrementCount,
    dismissPaywall,
    openPaywall,
  };
}
