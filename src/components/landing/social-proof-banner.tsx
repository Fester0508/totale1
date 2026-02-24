"use client";

import { Star, FileCheck, Euro, ThumbsUp } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/hooks/use-count-up";
import { AnimatedSection } from "./animated-section";

function AnimatedStat({
  end,
  suffix,
  prefix,
  label,
  icon: Icon,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: typeof Star;
  decimals?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const value = useCountUp(isInView ? end : 0, 2000);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals).replace(".", ",")
      : Math.round(value).toLocaleString("it-IT");

  return (
    <div ref={ref} className="group flex items-center gap-3 md:gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 cursor-default">
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-brand-amber transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div>
        <p className="text-xl md:text-2xl font-bold text-white">
          {prefix}
          {formatted}
          {suffix}
        </p>
        <p className="text-xs md:text-sm text-white/60">{label}</p>
      </div>
    </div>
  );
}

export function SocialProofBanner() {
  return (
    <section className="py-12 md:py-16 bg-brand-navy dark:bg-brand-navy/95">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 max-w-5xl mx-auto">
            <AnimatedStat
              end={4.8}
              suffix="/5"
              label="Valutazione media"
              icon={Star}
              decimals={1}
            />
            <AnimatedStat
              end={12500}
              suffix="+"
              label="Documenti analizzati"
              icon={FileCheck}
            />
            <AnimatedStat
              end={850}
              suffix="k+"
              prefix="€"
              label="Recuperati dagli utenti"
              icon={Euro}
            />
            <AnimatedStat
              end={98}
              suffix="%"
              label="Utenti soddisfatti"
              icon={ThumbsUp}
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
