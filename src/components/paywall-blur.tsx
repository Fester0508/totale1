"use client";

import Link from "next/link";

interface PaywallBlurProps {
  children: React.ReactNode;
  locked: boolean;
}

export function PaywallBlur({ children, locked }: PaywallBlurProps) {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-sm text-center">
          <div className="w-12 h-12 bg-brand-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Report completo bloccato
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Hai esaurito le analisi gratuite. Scegli un piano per sbloccare il referto completo con errori, importi e raccomandazioni.
          </p>
          <Link
            href="/#prezzi"
            className="inline-flex items-center justify-center bg-brand-amber text-accent-foreground font-semibold text-sm px-6 py-3 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors"
          >
            Vedi i piani
          </Link>
        </div>
      </div>
    </div>
  );
}
