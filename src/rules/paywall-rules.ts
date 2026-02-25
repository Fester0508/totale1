import { UserPlan, type AccessConfig } from "@/domain/user-plan";

/**
 * Paywall visibility matrix.
 *
 * FREE_FIRST:           anomaly titles only (hook for conversion)
 * SIMPLE_SUBSCRIPTION:  full technical analysis, no norm links, no consulting
 * ONE_SHOT_PRO:         everything unlocked
 * CONSULTING_ADDON:     everything + priority chat 24h
 */
const PAYWALL_MATRIX: Record<UserPlan, AccessConfig> = {
  [UserPlan.FREE_FIRST]: {
    canSeeAnomalyTitle: true,
    canSeeDetails: false,
    canSeeNormLinks: false,
    canSeeChart: false,
    canSeeRecommendations: false,
    canSeeConsulting: false,
    canSeeImpact: true, // always visible as conversion hook
    isPaid: false,
  },
  [UserPlan.SIMPLE_SUBSCRIPTION]: {
    canSeeAnomalyTitle: true,
    canSeeDetails: true,
    canSeeNormLinks: false,
    canSeeChart: false,
    canSeeRecommendations: false,
    canSeeConsulting: false,
    canSeeImpact: true,
    isPaid: true,
  },
  [UserPlan.ONE_SHOT_PRO]: {
    canSeeAnomalyTitle: true,
    canSeeDetails: true,
    canSeeNormLinks: true,
    canSeeChart: true,
    canSeeRecommendations: true,
    canSeeConsulting: false,
    canSeeImpact: true,
    isPaid: true,
  },
  [UserPlan.CONSULTING_ADDON]: {
    canSeeAnomalyTitle: true,
    canSeeDetails: true,
    canSeeNormLinks: true,
    canSeeChart: true,
    canSeeRecommendations: true,
    canSeeConsulting: true,
    canSeeImpact: true,
    isPaid: true,
  },
};

/** Returns the access configuration for a given plan. */
export function getAccessConfig(plan: UserPlan): AccessConfig {
  return PAYWALL_MATRIX[plan];
}

/** Given a plan, returns the suggested upgrade product ID. */
export function suggestedUpgrade(plan: UserPlan): string | null {
  switch (plan) {
    case UserPlan.FREE_FIRST:
      return "sub-simple";
    case UserPlan.SIMPLE_SUBSCRIPTION:
      return "one-shot-pro";
    case UserPlan.ONE_SHOT_PRO:
      return "consulting";
    case UserPlan.CONSULTING_ADDON:
      return null; // already max
  }
}
