"use client";

import { Check, Crown, Sparkles, ArrowRight, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./animated-section";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "",
    subtitle: "Analisi base senza upload dati sensibili",
    highlight: false,
    features: [
      "Verifica cedolino base",
      "Rilevamento anomalie comuni",
      "Report semplice",
      "Nessun dato salvato",
    ],
    ctaLabel: "Inizia gratis",
    ctaHref: "#analizza",
    ctaVariant: "outline" as const,
  },
  {
    id: "pay-per-error",
    name: "Pay-Per-Error",
    price: "3,99",
    period: "",
    subtitle: "Paghi solo quando trovi anomalie",
    highlight: true,
    features: [
      "Analisi completa",
      "Rilevamento anomalie avanzate",
      "Report dettagliato",
      "Storico cedolini",
    ],
    ctaLabel: "Scegli Pay-Per-Error",
    ctaHref: "#analizza",
    ctaVariant: "default" as const,
  },
  {
    id: "ultra-low",
    name: "Abbonamento Ultra-Low",
    price: "0,99",
    period: "/mese",
    subtitle: "Illimitato, meno di 1\u20AC al mese",
    highlight: false,
    features: [
      "Analisi illimitata",
      "Alert automatici",
      "Storico completo",
      "Supporto email",
    ],
    ctaLabel: "Abbonati ora",
    ctaHref: "#analizza",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro-chatbot",
    name: "Pro + Chatbot",
    price: "9,99",
    period: "/mese",
    subtitle: "Chatbot specializzato in diritto del lavoro",
    highlight: false,
    features: [
      "Tutto di Ultra-Low",
      "Chatbot 24/7",
      "Consulenza personalizzata",
      "Priorita\u0300 support",
    ],
    ctaLabel: "Vai Pro",
    ctaHref: "#analizza",
    ctaVariant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section id="prezzi" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy text-balance">
              Scegli come controllare
              <br />
              il tuo cedolino
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg leading-relaxed">
              Parti gratis. Paga solo se trovi errori, o scegli un piano
              illimitato.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-amber-light rounded-full px-5 py-2.5 text-sm font-medium text-brand-amber">
              <Sparkles className="h-4 w-4" />
              {"Il 67% dei lavoratori ha errori in busta paga. Tu?"}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.id} delay={0.2 + i * 0.1}>
              <div
                className={`group relative bg-card rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.highlight
                    ? "border-2 border-brand-amber shadow-lg shadow-brand-amber/10 hover:shadow-brand-amber/20 hover:-translate-y-1.5"
                    : "border border-border/60 shadow-sm hover:border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-0 left-6">
                    <div className="inline-flex items-center gap-1.5 bg-card border-2 border-brand-amber rounded-full px-3 py-1 -translate-y-1/2">
                      <Crown className="h-3.5 w-3.5 text-brand-amber" />
                      <span className="text-xs font-bold text-brand-amber uppercase tracking-wide">
                        Consigliato
                      </span>
                    </div>
                  </div>
                )}

                <div className={`mb-5 ${plan.highlight ? "mt-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {plan.id === "free" && (
                      <Zap className="h-4 w-4 text-brand-navy" />
                    )}
                    {plan.id === "pay-per-error" && (
                      <Sparkles className="h-4 w-4 text-brand-amber" />
                    )}
                    {plan.id === "ultra-low" && (
                      <ArrowRight className="h-4 w-4 text-brand-navy" />
                    )}
                    {plan.id === "pro-chatbot" && (
                      <Bot className="h-4 w-4 text-brand-navy" />
                    )}
                    <p
                      className={`text-sm font-semibold ${
                        plan.highlight ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {plan.name}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${
                        plan.highlight ? "text-brand-amber" : "text-brand-navy"
                      }`}
                    >
                      {"\u20AC"}
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {plan.subtitle}
                  </p>
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Features
                </p>
                <div className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2.5 text-foreground"
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          plan.highlight ? "text-brand-amber" : "text-green-600"
                        }`}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  variant={plan.ctaVariant}
                  asChild
                  className={`w-full mt-7 rounded-xl py-5 font-semibold gap-2 transition-all ${
                    plan.highlight
                      ? "bg-brand-amber hover:bg-brand-amber-dark text-accent-foreground shadow-lg hover:shadow-xl"
                      : ""
                  }`}
                >
                  <a href={plan.ctaHref}>
                    {plan.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.6}>
          <p className="text-center text-sm text-muted-foreground mt-10 max-w-lg mx-auto">
            Tutti i piani includono crittografia AES-256, conformita GDPR e
            cancellazione automatica dei file dopo 30 giorni.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
