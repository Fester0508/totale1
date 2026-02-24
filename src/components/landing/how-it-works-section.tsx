"use client";

import { Camera, TrendingUp, MessageSquare } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const steps = [
  {
    number: 1,
    icon: Camera,
    title: "Fai una foto",
    description:
      "Fotografa la busta paga, scansiona il documento o carica direttamente il file PDF. Accettiamo qualsiasi formato: PDF, JPG, PNG, persino HEIC da iPhone. L'AI legge anche foto mosse e documenti piegati.",
    bgClass: "bg-blue-100/60 dark:bg-blue-950/30",
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "Noi controlliamo tutto",
    description:
      "In 30 secondi l'intelligenza artificiale estrae ogni dato con OCR avanzato e lo confronta con le tabelle CCNL, le aliquote fiscali aggiornate e la normativa italiana vigente. Verifichiamo stipendio, trattenute, contributi, TFR, ferie e straordinari.",
    bgClass: "bg-orange-100/50 dark:bg-orange-950/20",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "Ti spieghiamo tutto",
    description:
      "Ricevi un report dettagliato con il sistema a semafori: verde (tutto ok), giallo (da verificare), rosso (anomalia). Ogni voce ha una spiegazione chiara in italiano, senza tecnicismi. Se hai dubbi, chiedi al chatbot AI integrato.",
    bgClass: "bg-gray-100/60 dark:bg-gray-800/30",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-widest text-brand-navy uppercase mb-3">
              Semplicissimo
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
              Come funziona? Facilissimo.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Tre passaggi, zero complicazioni. Non serve essere esperti di
              buste paga o diritto del lavoro &mdash; ci pensa LavoroChiaro.
              L&apos;analisi AI è accessibile a tutti, da smartphone o computer.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto mt-14">
          {/* Dashed connector line (hidden on mobile) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-0.5 border-t-2 border-dashed border-gray-300 dark:border-gray-600" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.2}>
                <div className="relative flex flex-col items-center group">
                  {/* Number circle */}
                  <div className="relative z-10 h-10 w-10 rounded-full bg-brand-navy text-white flex items-center justify-center text-sm font-bold mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>

                  {/* Card */}
                  <div
                    className={`${step.bgClass} rounded-2xl p-8 text-center w-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1.5`}
                  >
                    <div className="h-14 w-14 bg-white dark:bg-card rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
                      <step.icon className="h-7 w-7 text-brand-navy transition-colors duration-300 group-hover:text-brand-amber" />
                    </div>
                    <h3 className="font-bold text-lg text-brand-navy mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
