"use client";

import { Star, Quote } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const testimonials = [
  {
    name: "Marco R.",
    role: "Impiegato, settore commercio",
    text: "Ho scoperto che mi mancava uno scatto di anzianità da 3 anni. LavoroChiaro l'ha trovato in 30 secondi. Ho recuperato quasi €1.700 di arretrati.",
    stars: 5,
    highlight: "€1.700 recuperati",
  },
  {
    name: "Laura B.",
    role: "Infermiera, sanità pubblica",
    text: "Non avevo mai controllato la busta paga perché mi sembrava impossibile da capire. Con LavoroChiaro è tutto chiaro: semafori, spiegazioni semplici. Consigliatissimo.",
    stars: 5,
    highlight: "Semplicissimo",
  },
  {
    name: "Giuseppe T.",
    role: "Operaio metalmeccanico",
    text: "Il mio datore di lavoro non mi pagava correttamente gli straordinari notturni. Grazie al report di LavoroChiaro ho potuto dimostrarlo e ottenere il rimborso.",
    stars: 5,
    highlight: "Straordinari corretti",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-brand-amber uppercase mb-3">
              Chi ci ha provato
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
              Storie di chi ha scoperto errori
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Migliaia di lavoratori italiani hanno già usato LavoroChiaro per
              controllare i propri documenti. Ecco cosa hanno scoperto.
            </p>

            {/* Aggregate rating */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-brand-amber text-brand-amber"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  4.8/5
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                su 2.400+ analisi completate
              </span>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.name} delay={i * 0.15}>
              <div className="group bg-muted/30 dark:bg-muted/10 rounded-2xl border border-border/30 p-7 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:border-brand-amber/20 cursor-default">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-brand-amber/30 mb-4 transition-all duration-300 group-hover:text-brand-amber/60 group-hover:scale-110" />

                {/* Text */}
                <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Highlight badge */}
                <div className="mb-4">
                  <span className="inline-flex text-xs font-semibold text-brand-amber bg-brand-amber-light dark:bg-brand-amber-light/20 px-3 py-1 rounded-full">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.stars)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-3.5 w-3.5 fill-brand-amber text-brand-amber"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
