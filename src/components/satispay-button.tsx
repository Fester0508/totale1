"use client";

import { useState } from "react";

interface SatispayButtonProps {
  productId: string;
  label: string;
  highlight?: boolean;
}

export function SatispayButton({
  productId,
  label,
  highlight,
}: SatispayButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || "Errore nella creazione del pagamento");
      }
    } catch {
      alert("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`mt-6 block w-full text-center py-3 rounded-sm font-semibold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 ${
        highlight
          ? "bg-brand-amber text-accent-foreground hover:bg-brand-amber-dark"
          : "bg-brand-navy text-primary-foreground hover:bg-brand-navy-light"
      }`}
    >
      {loading ? "Elaborazione..." : label}
    </button>
  );
}
