"use client";

import Link from "next/link";

/* 3 paywall patterns:
   1. blur   - CSS blur(4px) + overlay + CTA  (descriptions, donut)
   2. lock   - lock icon + "--- ???" placeholder (score, importo, impatto)
   3. hidden - not rendered, banner instead     (recommendations, PDF)
*/

interface PaywallBlurProps {
  children: React.ReactNode;
  locked: boolean;
}

export function PaywallBlur({ children, locked }: PaywallBlurProps) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative">
      <div className="blur-[4px] pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 bg-card/60 flex items-center justify-center z-10">
        <Link
          href="/#prezzi"
          className="inline-flex items-center gap-2 bg-brand-amber text-white font-semibold text-sm px-5 py-2.5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-md"
        >
          <LockIcon />
          Sblocca dettagli
        </Link>
      </div>
    </div>
  );
}

export function PaywallLock({ placeholder }: { placeholder?: string }) {
  return (
    <Link href="/#prezzi" className="inline-flex items-center gap-1.5 group">
      <LockIcon />
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
        {placeholder ?? "\u20ac ???,??"}
      </span>
    </Link>
  );
}

export function PaywallHidden() {
  return (
    <div className="border border-dashed border-border rounded-lg p-6 text-center">
      <LockIcon className="mx-auto mb-2" />
      <p className="text-sm text-muted-foreground mb-3">
        Disponibile con analisi completa
      </p>
      <Link
        href="/#prezzi"
        className="inline-flex items-center gap-2 bg-brand-navy text-primary-foreground font-semibold text-xs px-4 py-2 rounded-sm uppercase tracking-wider hover:bg-brand-navy-light transition-colors"
      >
        Vedi i piani
      </Link>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 text-muted-foreground ${className ?? ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}
