"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!privacyAccepted) {
      setError("Devi accettare la Privacy Policy e i Termini di Servizio");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    if (password.length < 6) {
      setError("La password deve avere almeno 6 caratteri");
      return;
    }

    setLoading(true);

    const now = new Date().toISOString();

    // Register user via API
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        privacyAcceptedAt: now,
        termsAcceptedAt: now,
        marketingConsent,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Errore durante la registrazione");
      setLoading(false);
      return;
    }

    // Auto-login after registration
    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error) {
      setError("Account creato. Effettua il login.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Registrati</CardTitle>
        <CardDescription>Crea il tuo account gratuito</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.it"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Almeno 6 caratteri"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ripeti la password"
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) =>
                  setPrivacyAccepted(checked === true)
                }
              />
              <label
                htmlFor="privacy"
                className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
              >
                Ho letto e accetto la{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-brand-navy hover:underline font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                e i{" "}
                <Link
                  href="/termini"
                  target="_blank"
                  className="text-brand-navy hover:underline font-medium"
                >
                  Termini di Servizio
                </Link>{" "}
                *
              </label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="marketing"
                checked={marketingConsent}
                onCheckedChange={(checked) =>
                  setMarketingConsent(checked === true)
                }
              />
              <label
                htmlFor="marketing"
                className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
              >
                Acconsento a ricevere comunicazioni su novit&agrave; e
                aggiornamenti del servizio (facoltativo)
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !privacyAccepted}
          >
            {loading ? "Registrazione in corso..." : "Crea account"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Hai gi&agrave; un account?{" "}
          <Link
            href="/login"
            className="text-brand-navy hover:underline font-medium"
          >
            Accedi
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
