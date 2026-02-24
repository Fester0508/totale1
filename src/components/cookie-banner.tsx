"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
        <Cookie className="h-5 w-5 text-brand-amber shrink-0 hidden sm:block" />
        <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
          Questo sito utilizza solo cookie tecnici necessari al funzionamento del
          servizio. Non utilizziamo cookie di profilazione o tracciamento.{" "}
          <Link href="/privacy" className="text-brand-navy underline">
            Leggi la Privacy Policy
          </Link>
          .
        </p>
        <Button
          size="sm"
          onClick={handleAccept}
          className="shrink-0"
        >
          Ho capito
        </Button>
      </div>
    </div>
  );
}
