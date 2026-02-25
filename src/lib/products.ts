import { UserPlan } from "@/domain/user-plan";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  period: "once" | "month";
  plan: UserPlan;
  features: string[];
  /** Stripe mode: "subscription" for recurring, "payment" for one-shot */
  stripeMode: "payment" | "subscription";
}

/**
 * Product catalog -- source of truth for all pricing.
 * IDs are used in the Stripe Checkout flow.
 */
export const PRODUCTS: Product[] = [
  {
    id: "sub-simple",
    name: "Abbonamento Base",
    description: "Analisi tecnica completa, meno di 1 euro al mese",
    priceInCents: 99,
    period: "month",
    plan: UserPlan.SIMPLE_SUBSCRIPTION,
    stripeMode: "subscription",
    features: [
      "Analisi tecnica completa",
      "Storico cedolini",
      "Alert automatici",
      "Minimo 6 mesi",
    ],
  },
  {
    id: "one-shot-pro",
    name: "Analisi Pro",
    description: "Analisi Pro one-shot con dettagli completi",
    priceInCents: 399,
    period: "once",
    plan: UserPlan.ONE_SHOT_PRO,
    stripeMode: "payment",
    features: [
      "Dettagli completi",
      "Link normativi (Normattiva/INPS/CNEL)",
      "Grafico comparativo EU",
      "Raccomandazioni personalizzate",
    ],
  },
  {
    id: "consulting",
    name: "Consulenza 24h",
    description: "Consulenza diritto del lavoro con risposta entro 24h",
    priceInCents: 990,
    period: "once",
    plan: UserPlan.CONSULTING_ADDON,
    stripeMode: "payment",
    features: [
      "Tutto di Pro",
      "Chat prioritaria 24h",
      "Ticket con scadenza garantita",
      "Storico messaggi",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
