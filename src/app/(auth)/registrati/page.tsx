"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          privacy_accepted_at: now,
          terms_accepted_at: now,
          marketing_consent: marketingConsent,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="text-lg font-semibold">Controlla la tua email</h2>
          <p className="text-sm text-muted-foreground">
            Ti abbiamo inviato un&apos;email di conferma a{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Clicca sul link per attivare il tuo account.
          </p>
          <Link
            href="/login"
            className="text-sm text-brand-navy hover:underline font-medium inline-block mt-2"
          >
            Torna al login
          </Link>
        </CardContent>
      </Card>
    );
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
