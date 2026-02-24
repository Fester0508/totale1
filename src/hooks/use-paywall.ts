"use client";

export type AccessLevel = "preview" | "full";
export type Tier = "free" | "pay_per" | "sub_099" | "pro_999";

export function usePaywall(accessLevel: AccessLevel) {
  const isPaid = accessLevel === "full";
  return {
    canSeeScore: isPaid,
    canSeeImpact: isPaid,
    canSeeDescription: isPaid,
    canSeeNorma: isPaid,
    canSeeDonut: isPaid,
    canSeeRecommendations: isPaid,
    canSeePdf: isPaid,
    isPaid,
  };
}
