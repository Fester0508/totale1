import { UserPlan } from "@/domain/user-plan";
import { getAccessConfig } from "@/rules/paywall-rules";
import type { AccessConfig } from "@/domain/user-plan";
import { prisma } from "@/lib/db";

/**
 * Queries user_profiles to resolve the current plan for a user.
 * Falls back to FREE_FIRST if not found.
 */
export async function getUserPlan(userId: string): Promise<UserPlan> {
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { tier: true },
  });

  if (!profile?.tier) return UserPlan.FREE_FIRST;

  // Validate that it's a known plan
  if (Object.values(UserPlan).includes(profile.tier as UserPlan)) {
    return profile.tier as UserPlan;
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
  const count = await prisma.analisi.count({
    where: { userId, stato: "completed" },
  });

  return count < 1;
}

/**
 * Returns the visibility flags for a given plan.
 */
export function getAccessLevel(plan: UserPlan): AccessConfig {
  return getAccessConfig(plan);
}
