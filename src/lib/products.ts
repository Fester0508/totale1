export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  period?: string; // "once" | "month"
  features: string[];
}

/**
 * Product catalog -- source of truth for all pricing.
 * IDs are used in the Satispay payment flow.
 */
export const PRODUCTS: Product[] = [
  {
    id: "pay-per-error",
    name: "Pay-Per-Error",
    description: "Paghi solo quando trovi anomalie",
    priceInCents: 399,
    period: "once",
    features: [
      "Analisi completa",
      "Rilevamento anomalie avanzate",
      "Report dettagliato",
      "Storico cedolini",
    ],
  },
  {
    id: "ultra-low",
    name: "Abbonamento Ultra-Low",
    description: "Illimitato, meno di 1 euro al mese",
    priceInCents: 99,
    period: "month",
    features: [
      "Analisi illimitata",
      "Alert automatici",
      "Storico completo",
      "Supporto email",
    ],
  },
  {
    id: "pro-chatbot",
    name: "Pro + Chatbot",
    description: "Chatbot specializzato in diritto del lavoro",
    priceInCents: 999,
    period: "month",
    features: [
      "Tutto di Ultra-Low",
      "Chatbot 24/7",
      "Consulenza personalizzata",
      "Priorita' supporto",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
