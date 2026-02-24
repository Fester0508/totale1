"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";

type PaymentStatus = "loading" | "accepted" | "pending" | "canceled" | "error";

export default function PaymentCompletedPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card rounded-xl border p-8 text-center">
              <div className="w-16 h-16 border-4 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-xl font-bold text-brand-navy mb-2">Caricamento...</h1>
            </div>
          </main>
        </>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [status, setStatus] = useState<PaymentStatus>("loading");

  useEffect(() => {
    if (!paymentId) {
      setStatus("error");
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(
          `/api/payments/callback?payment_id=${paymentId}`
        );
        const data = await res.json();

        if (data.status === "ACCEPTED") {
          setStatus("accepted");
        } else if (data.status === "CANCELED") {
          setStatus("canceled");
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("error");
      }
    }

    checkStatus();
    // Poll every 3 seconds if pending
    const interval = setInterval(() => {
      if (status === "pending" || status === "loading") {
        checkStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentId, status]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-xl border p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-xl font-bold text-brand-navy mb-2">
                Verifica pagamento...
              </h1>
              <p className="text-muted-foreground">
                Stiamo verificando il tuo pagamento Satispay.
              </p>
            </>
          )}

          {status === "accepted" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-brand-navy mb-2">
                Pagamento completato
              </h1>
              <p className="text-muted-foreground mb-6">
                Grazie! Il tuo piano e' stato attivato con successo.
              </p>
              <Link
                href="/#analizza"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-primary-foreground font-semibold rounded-lg hover:bg-brand-navy-light transition-colors"
              >
                Analizza la tua busta paga
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="w-16 h-16 border-4 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-xl font-bold text-brand-navy mb-2">
                In attesa di conferma
              </h1>
              <p className="text-muted-foreground mb-4">
                Completa il pagamento nell{"'"}app Satispay. La pagina si
                aggiornera' automaticamente.
              </p>
            </>
          )}

          {status === "canceled" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-brand-navy mb-2">
                Pagamento annullato
              </h1>
              <p className="text-muted-foreground mb-6">
                Il pagamento e' stato annullato. Puoi riprovare quando vuoi.
              </p>
              <Link
                href="/#prezzi"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-primary-foreground font-semibold rounded-lg hover:bg-brand-navy-light transition-colors"
              >
                Torna ai piani
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-brand-navy mb-2">
                Errore
              </h1>
              <p className="text-muted-foreground mb-6">
                Si e' verificato un errore. Contattaci a info@lavoroinchiaro.it
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-primary-foreground font-semibold rounded-lg hover:bg-brand-navy-light transition-colors"
              >
                Torna alla home
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
