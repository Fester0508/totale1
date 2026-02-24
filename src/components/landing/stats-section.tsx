"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { AnimatedSection } from "./animated-section";

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("it-IT")}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 1200,
    prefix: "\u20AC",
    suffix: "",
    label: "persi in media ogni anno per errori non rilevati in busta paga",
    color: "text-brand-amber",
  },
  {
    value: 67,
    prefix: "",
    suffix: "%",
    label: "dei lavoratori italiani non ha mai controllato il proprio cedolino",
    color: "text-brand-navy",
  },
  {
    value: 30,
    prefix: "",
    suffix: "s",
    label: "per un report completo con analisi AI e consigli personalizzati",
    color: "text-foreground",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
              I numeri parlano chiaro
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
              Errori in busta paga? Sono più comuni di quanto pensi. Ecco
              perché migliaia di lavoratori si affidano a LavoroChiaro.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.15}>
              <div className="group cursor-default p-6 rounded-2xl transition-all duration-300 hover:bg-muted/30 dark:hover:bg-muted/10 hover:shadow-sm">
                <p
                  className={`text-5xl md:text-6xl font-bold ${stat.color} transition-all duration-300 group-hover:scale-110`}
                >
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <div className="h-1 w-12 bg-brand-amber/30 rounded-full mx-auto mt-4 mb-3 transition-all duration-500 group-hover:w-20 group-hover:bg-brand-amber/60" />
                <p className="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
