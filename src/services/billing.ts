import { UserPlan } from "@/domain/user-plan";
import { getAccessConfig } from "@/rules/paywall-rules";
import type { AccessConfig } from "@/domain/user-plan";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Queries user_profiles to resolve the current plan for a user.
 * Falls back to FREE_FIRST if not found.
 */
export async function getUserPlan(userId: string): Promise<UserPlan> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("tier")
    .eq("user_id", userId)
    .single();

  if (!data?.tier) return UserPlan.FREE_FIRST;

  // Validate that it's a known plan
  if (Object.values(UserPlan).includes(data.tier as UserPlan)) {
    return data.tier as UserPlan;
  }

  return UserPlan.FREE_FIRST;
}

/**
 * Checks whether the user can start a new analysis.
 * FREE_FIRST: only 1 analysis allowed.
 * Paid plans: unlimited.
 */
export async function canAnalyze(userId: string | null): Promise<boolean> {
  if (!userId) return true; // anonymous users use free-tier cookie logic

  const plan = await getUserPlan(userId);
  if (plan !== UserPlan.FREE_FIRST) return true;

  // FREE_FIRST: check count
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("analisi")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("stato", "completed");

  return (count ?? 0) < 1;
}

/**
 * Returns the visibility flags for a given plan.
 */
export function getAccessLevel(plan: UserPlan): AccessConfig {
  return getAccessConfig(plan);
}
