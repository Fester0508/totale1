"use client";

import type { SemaforoColore } from "@/lib/types";

interface SemaforoProps {
  colore: SemaforoColore;
  size?: "sm" | "md" | "lg";
  label?: string;
  variant?: "default" | "hero";
}

const colorMap = {
  verde: {
    bg: "bg-green-100",
    ring: "ring-green-500",
    dot: "bg-green-500",
    text: "text-green-700",
    heroText: "text-green-200",
    heroBg: "bg-green-500/20",
    heroRing: "ring-green-400/50",
    glow: "animate-glow-green",
    label: "Tutto OK",
  },
  giallo: {
    bg: "bg-yellow-100",
    ring: "ring-yellow-500",
    dot: "bg-yellow-500",
    text: "text-yellow-700",
    heroText: "text-yellow-200",
    heroBg: "bg-yellow-500/20",
    heroRing: "ring-yellow-400/50",
    glow: "animate-glow-yellow",
    label: "Attenzione",
  },
  rosso: {
    bg: "bg-red-100",
    ring: "ring-red-500",
    dot: "bg-red-500",
    text: "text-red-700",
    heroText: "text-red-200",
    heroBg: "bg-red-500/20",
    heroRing: "ring-red-400/50",
    glow: "animate-glow-red",
    label: "Problemi trovati",
  },
};

const sizeMap = {
  sm: { container: "h-6 w-6", dot: "h-3 w-3" },
  md: { container: "h-10 w-10", dot: "h-5 w-5" },
  lg: { container: "h-24 w-24", dot: "h-12 w-12" },
};

export function Semaforo({ colore, size = "md", label, variant = "default" }: SemaforoProps) {
  const colors = colorMap[colore];
  const sizes = sizeMap[size];
  const isHero = variant === "hero";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizes.container} rounded-full flex items-center justify-center ring-2 ${
          isHero
            ? `${colors.heroBg} ${colors.heroRing}`
            : `${colors.bg} ${colors.ring}`
        } ${size === "lg" ? colors.glow : ""}`}
      >
        <div className={`${sizes.dot} ${colors.dot} rounded-full animate-pulse`} />
      </div>
      {(label || size === "lg") && (
        <span
          className={`text-sm font-medium ${
            isHero ? colors.heroText : colors.text
          }`}
        >
          {label || colors.label}
        </span>
      )}
    </div>
  );
}

/* ── TrafficLight: semaforo classico a 3 luci ── */

const trafficSizes = {
  sm: { container: "w-7 py-1 gap-0.5", dot: "h-1.5 w-1.5" },
  md: { container: "w-10 py-1.5 gap-1", dot: "h-2.5 w-2.5" },
  lg: { container: "w-12 py-2 gap-1.5", dot: "h-3 w-3" },
};

export function TrafficLight({
  colore,
  size = "md",
}: {
  colore: SemaforoColore;
  size?: "sm" | "md" | "lg";
}) {
  const s = trafficSizes[size];
  return (
    <div
      className={`${s.container} flex flex-col items-center bg-gray-800 dark:bg-gray-900 rounded-full`}
    >
      <div
        className={`${s.dot} rounded-full transition-all duration-300 ${
          colore === "rosso"
            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
            : "bg-red-900/30"
        }`}
      />
      <div
        className={`${s.dot} rounded-full transition-all duration-300 ${
          colore === "giallo"
            ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]"
            : "bg-amber-900/30"
        }`}
      />
      <div
        className={`${s.dot} rounded-full transition-all duration-300 ${
          colore === "verde"
            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]"
            : "bg-green-900/30"
        }`}
      />
    </div>
  );
}

export function SemaforoInline({ colore }: { colore: SemaforoColore }) {
  const colors = colorMap[colore];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
      {colors.label}
    </span>
  );
}
