"use client";

import type { AccessConfig } from "@/domain/user-plan";

/**
 * Legacy access level string for backwards compatibility.
 * "full" maps to ONE_SHOT_PRO-level access, "preview" maps to FREE_FIRST.
 */
export type AccessLevel = "preview" | "full";

/**
 * Accepts either:
 * - an AccessConfig object (new 4-tier system from server)
 * - an AccessLevel string (legacy "preview" | "full")
 *
 * Returns a unified PaywallState used by all report components.
 */
export interface PaywallState {
  canSeeAnomalyTitle: boolean;
  canSeeDetails: boolean;
  canSeeNormLinks: boolean;
  canSeeChart: boolean;
  canSeeRecommendations: boolean;
  canSeeConsulting: boolean;
  canSeeImpact: boolean;
  isPaid: boolean;
  /** Legacy aliases kept for backwards compat with existing components */
  canSeeScore: boolean;
  canSeeDescription: boolean;
  canSeeNorma: boolean;
  canSeeDonut: boolean;
  canSeePdf: boolean;
}

export function usePaywall(
  accessLevelOrConfig: AccessLevel | AccessConfig
): PaywallState {
  // If it's a full AccessConfig object, use it directly
  if (typeof accessLevelOrConfig === "object" && accessLevelOrConfig !== null) {
    const cfg = accessLevelOrConfig;
    return {
      ...cfg,
      // Legacy aliases
      canSeeScore: cfg.canSeeDetails,
      canSeeDescription: cfg.canSeeDetails,
      canSeeNorma: cfg.canSeeNormLinks,
      canSeeDonut: cfg.canSeeChart,
      canSeePdf: cfg.isPaid,
    };
  }

  // Legacy string mode
  const isPaid = accessLevelOrConfig === "full";
  return {
    canSeeAnomalyTitle: true,
    canSeeDetails: isPaid,
    canSeeNormLinks: isPaid,
    canSeeChart: isPaid,
    canSeeRecommendations: isPaid,
    canSeeConsulting: false,
    canSeeImpact: true,
    isPaid,
    // Legacy aliases
    canSeeScore: isPaid,
    canSeeDescription: isPaid,
    canSeeNorma: isPaid,
    canSeeDonut: isPaid,
    canSeePdf: isPaid,
  };
}
