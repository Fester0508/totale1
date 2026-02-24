"use client";

import { Zap, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./animated-section";

export function FinalCTASection() {
  const scrollToUpload = () => {
    document.getElementById("analizza")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection>
          <div className="bg-gradient-to-br from-brand-navy to-[#152a45] dark:from-brand-navy/30 dark:to-brand-navy/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <Zap className="h-7 w-7 text-white" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Hai un documento da controllare?
              </h2>
              <p className="text-white/70 mb-4 max-w-md mx-auto leading-relaxed text-lg">
                Busta paga, 730, cartella esattoriale o multa &mdash; caricalo e
                scopri subito cosa non torna.
              </p>
              <p className="text-white/50 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                La prima analisi è gratuita. Nessuna registrazione richiesta.
                I tuoi dati sono sempre al sicuro.
              </p>

              <Button
                size="lg"
                onClick={scrollToUpload}
                className="bg-white text-brand-navy hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Controlla il tuo documento
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex justify-center items-center gap-6 mt-6 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  30 secondi
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  GDPR compliant
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
