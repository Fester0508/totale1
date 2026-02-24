"use client";

import { Check, Crown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./animated-section";

const freePlan = {
  name: "Free",
  price: "€0",
  period: "",
  description: "Per chi vuole provare il servizio",
  features: [
    { text: "3 analisi al mese", included: true },
    { text: "Verdetto rapido a semafori", included: true },
    { text: "Rilevamento anomalie (solo conteggio)", included: true },
    { text: "Esportazione PDF base", included: true },
    { text: "Chatbot assistente AI", included: false },
    { text: "Dettagli anomalie e consigli", included: false },
    { text: "Analisi illimitate", included: false },
    { text: "Report PDF completo", included: false },
  ],
};

const proPlan = {
  name: "Pro",
  price: "€0,99",
  period: "/mese",
  description: "Prezzo bloccato per 6 mesi. Poi €4,99/mese.",
  features: [
    { text: "Analisi illimitate", included: true },
    { text: "Chatbot assistente AI dedicato", included: true },
    { text: "Dettagli anomalie + consigli personalizzati", included: true },
    { text: "Report PDF completo", included: true },
    { text: "Storico completo e confronto mesi", included: true },
    { text: "Supporto prioritario", included: true },
  ],
};

export function PricingSection() {
  return (
    <section
      id="prezzi"
      className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-muted/10 dark:to-background"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy">
              Scegli il tuo piano
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg leading-relaxed">
              Inizia senza costi. Passa a Pro a soli &euro;0,99/mese &mdash;
              prezzo bloccato per 6 mesi.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-amber-light dark:bg-brand-amber-light/20 rounded-full px-5 py-2.5 text-sm font-medium text-brand-amber">
              <Sparkles className="h-4 w-4" />
              Meno di un caff&egrave; al mese per proteggere il tuo stipendio.
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <AnimatedSection delay={0.2}>
            <div className="group bg-white dark:bg-card rounded-2xl border border-border/60 p-8 h-full flex flex-col shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border">
              <div className="mb-6">
                <p className="text-sm font-semibold text-muted-foreground italic">
                  Free
                </p>
                <p className="text-5xl font-bold text-brand-navy mt-2">€0</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {freePlan.description}
                </p>
              </div>

              <div className="space-y-3.5 flex-1">
                {freePlan.features.map((feature) => (
                  <div
                    key={feature.text}
                    className={`flex items-start gap-3 ${
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground/50 line-through"
                    }`}
                  >
                    <Check
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        feature.included
                          ? "text-green-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full mt-8 rounded-xl py-6 font-semibold"
              >
                Piano attuale
              </Button>
            </div>
          </AnimatedSection>

          {/* Pro Plan */}
          <AnimatedSection delay={0.35}>
            <div className="group relative bg-white dark:bg-card rounded-2xl border-2 border-brand-amber p-8 h-full flex flex-col shadow-lg shadow-brand-amber/10 transition-all duration-300 hover:shadow-xl hover:shadow-brand-amber/20 hover:-translate-y-1.5">
              {/* Badge */}
              <div className="absolute -top-0 left-8">
                <div className="inline-flex items-center gap-1.5 bg-white dark:bg-card border-2 border-brand-amber rounded-full px-4 py-1.5 -translate-y-1/2">
                  <Crown className="h-4 w-4 text-brand-amber" />
                  <span className="text-xs font-bold text-brand-amber uppercase tracking-wide">
                    Consigliato
                  </span>
                </div>
              </div>

              <div className="mb-6 mt-2">
                <p className="text-sm font-semibold text-foreground">Pro</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-bold text-brand-amber">
                    €0,99
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /mese
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {proPlan.description}
                </p>
              </div>

              <div className="space-y-3.5 flex-1">
                {proPlan.features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                asChild
                className="w-full mt-8 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl py-6 font-semibold gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <a href="#analizza">
                  <ArrowRight className="h-4 w-4" />
                  Accedi per iniziare
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.5}>
          <p className="text-center text-sm text-muted-foreground mt-10 max-w-lg mx-auto">
            Abbonamento mensile. Prezzo promozionale di &euro;0,99/mese bloccato
            per i primi 6 mesi, poi &euro;4,99/mese. Cancellabile in qualsiasi momento.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
