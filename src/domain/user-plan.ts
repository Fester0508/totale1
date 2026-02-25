/**
 * UserPlan enum — single source of truth for all plan tiers.
 * Maps 1:1 with the `tier` column in the `user_profiles` table.
 */
export enum UserPlan {
  FREE_FIRST = "FREE_FIRST",
  SIMPLE_SUBSCRIPTION = "SIMPLE_SUBSCRIPTION",
  ONE_SHOT_PRO = "ONE_SHOT_PRO",
  CONSULTING_ADDON = "CONSULTING_ADDON",
}

/** Visibility flags driven by the active plan. */
export interface AccessConfig {
  canSeeAnomalyTitle: boolean;
  canSeeDetails: boolean;
  canSeeNormLinks: boolean;
  canSeeChart: boolean;
  canSeeRecommendations: boolean;
  canSeeConsulting: boolean;
  canSeeImpact: boolean;
  isPaid: boolean;
}

/** Returns a human-readable label for the plan. */
export function planLabel(plan: UserPlan): string {
  switch (plan) {
    case UserPlan.FREE_FIRST:
      return "Gratuito";
    case UserPlan.SIMPLE_SUBSCRIPTION:
      return "Abbonamento Base";
    case UserPlan.ONE_SHOT_PRO:
      return "Analisi Pro";
    case UserPlan.CONSULTING_ADDON:
      return "Consulenza 24h";
  }
}
