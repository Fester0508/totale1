"use client";

export type AccessLevel = "preview" | "full";
export type Tier = "free" | "pay_per" | "sub_099" | "pro_999";

export function usePaywall(accessLevel: AccessLevel) {
  const isPaid = accessLevel === "full";
  return {
    canSeeScore: isPaid,
    canSeeImpact: true,        // Importi SEMPRE visibili (gancio conversione)
    canSeeDescription: isPaid,  // Spiegazioni dettagliate: bloccate per free
    canSeeNorma: isPaid,        // Riferimenti normativi: bloccati per free
    canSeeDonut: isPaid,        // Donut chart: bloccato per free
    canSeeRecommendations: isPaid, // Raccomandazioni: bloccate per free
    canSeePdf: isPaid,
    isPaid,
  };
}
