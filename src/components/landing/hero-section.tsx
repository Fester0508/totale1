"use client";

import { Camera, ArrowRight, Shield, Clock, Lock, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportPreview } from "./report-preview";
import { AnimatedSection } from "./animated-section";

export function HeroSection() {
  const scrollToUpload = () => {
    document.getElementById("analizza")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative bg-background"
    >
      <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left column */}
          <AnimatedSection direction="up" delay={0}>
            <div>
              {/* Alert badge */}
              <div className="inline-flex items-center gap-2 bg-brand-amber-light dark:bg-brand-amber-light rounded-full px-4 py-1.5 text-sm font-medium text-brand-amber mb-6 transition-all duration-300 hover:shadow-md hover:shadow-brand-amber/20 hover:scale-[1.03] cursor-default">
                <AlertTriangleIcon />
                Il 67% dei lavoratori ha errori in busta paga
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-brand-navy leading-tight mb-5">
                Scopri se la tua
                <br />
                busta paga
                <br />
                ha degli errori.{" "}
                <span className="text-brand-amber">In 30 secondi.</span>
              </h1>

              {/* Subtitle - longer SEO text */}
              <p className="text-lg text-muted-foreground mb-4 max-w-lg leading-relaxed">
                Carica una foto del tuo cedolino. L&apos;intelligenza artificiale
                controlla stipendio base, trattenute INPS, contributi, TFR, ferie
                e straordinari &mdash; e ti dice subito cosa non torna.
              </p>
              <p className="text-base text-muted-foreground/80 mb-4 max-w-lg leading-relaxed">
                Ogni anno i lavoratori italiani perdono in media &euro;1.200 per
                errori mai scoperti. LavoroChiaro analizza il tuo documento in
                tempo reale, confrontandolo con le tabelle CCNL aggiornate e la
                normativa vigente. La prima analisi è gratuita, senza registrazione.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-8 max-w-lg leading-relaxed">
                Analizziamo buste paga di tutti i CCNL: Commercio e Terziario,
                Metalmeccanico, Pubblico Impiego, Sanità, Edilizia, Turismo e
                altri 15+ contratti nazionali. Verifica anche 730, cartelle
                esattoriali e multe.
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                onClick={scrollToUpload}
                className="bg-brand-navy hover:bg-brand-navy-light text-primary-foreground rounded-full px-8 py-6 text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Camera className="h-5 w-5" />
                Controlla il tuo documento ora
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Trust tags */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground cursor-default">
                  <Lock className="h-3.5 w-3.5" />
                  Prima analisi gratis
                </span>
                <span className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground cursor-default">
                  <Clock className="h-3.5 w-3.5" />
                  30 secondi
                </span>
                <span className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground cursor-default">
                  <Shield className="h-3.5 w-3.5" />
                  GDPR compliant
                </span>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-card border-2 border-background flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-brand-navy">
                        {["M", "L", "A", "G", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-brand-amber text-brand-amber"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Usato da <span className="font-semibold">2.400+</span> lavoratori
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right column */}
          <AnimatedSection direction="right" delay={0.3} className="hidden md:block">
            <ReportPreview />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function AlertTriangleIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
