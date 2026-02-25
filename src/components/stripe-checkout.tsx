"use client";

import { useCallback, useState } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { startCheckoutSession } from "@/app/actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutProps {
  productId: string;
}

export function StripeCheckout({ productId }: StripeCheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startCheckoutSession(productId),
    [productId]
  );

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret: fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

/**
 * A button that opens the Stripe checkout in a dialog/modal.
 */
interface StripeButtonProps {
  productId: string;
  label: string;
  highlight?: boolean;
}

export function StripeButton({
  productId,
  label,
  highlight,
}: StripeButtonProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="relative w-full max-w-lg bg-card rounded-xl border overflow-hidden">
          <button
            onClick={() => setShowCheckout(false)}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-foreground"
            aria-label="Chiudi"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <StripeCheckout productId={productId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowCheckout(true)}
      className={`mt-6 block w-full text-center py-3 rounded-sm font-semibold text-sm uppercase tracking-wider transition-colors ${
        highlight
          ? "bg-brand-amber text-accent-foreground hover:bg-brand-amber-dark"
          : "bg-brand-navy text-primary-foreground hover:bg-brand-navy-light"
      }`}
    >
      {label}
    </button>
  );
}
