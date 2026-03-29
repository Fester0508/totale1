"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const specializzazioni = [
  "Buste paga",
  "Contenzioso",
  "Previdenza",
  "Fiscale",
  "CCNL",
];

export default function AccreditatiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  function toggleSpec(spec: string) {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 bg-brand-navy">
          <div className="container mx-auto flex flex-col items-center text-center gap-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-primary-foreground">Diventa consulente</span>
              <br />
              <span className="text-brand-amber">LavoroInChiaro</span>
            </h1>
            <div className="w-16 h-[2px] bg-brand-amber" />
            <p className="text-primary-foreground/70 max-w-xl leading-relaxed text-lg">
              Entra nella nostra rete di professionisti. Ricevi lead qualificati
              da migliaia di utenti che hanno bisogno di assistenza.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-2xl">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
                  Richiesta inviata con successo!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                  Grazie per il tuo interesse. Il nostro team verificherà il tuo
                  profilo e ti contatterà entro 48 ore lavorative.
                </p>
                <Button asChild className="bg-brand-navy hover:bg-brand-navy-light">
                  <Link href="/">Torna alla home</Link>
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2 text-center">
                  Richiedi l&apos;accreditamento
                </h2>
                <p className="text-muted-foreground text-center mb-10">
                  Compila il modulo per entrare nella nostra rete di
                  professionisti.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome e Cognome */}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome e Cognome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Mario Rossi"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionale</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="mario.rossi@studio.it"
                      required
                    />
                  </div>

                  {/* Telefono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="+39 333 1234567"
                      required
                    />
                  </div>

                  {/* Titolo professionale */}
                  <div className="space-y-2">
                    <Label htmlFor="titolo">Titolo professionale</Label>
                    <Select name="titolo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona il tuo titolo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercialista">
                          Commercialista
                        </SelectItem>
                        <SelectItem value="consulente-lavoro">
                          Consulente del Lavoro
                        </SelectItem>
                        <SelectItem value="avvocato-giuslavorista">
                          Avvocato Giuslavorista
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Numero iscrizione albo */}
                  <div className="space-y-2">
                    <Label htmlFor="albo">Numero iscrizione albo</Label>
                    <Input
                      id="albo"
                      name="albo"
                      placeholder="es. 12345"
                      required
                    />
                  </div>

                  {/* Provincia */}
                  <div className="space-y-2">
                    <Label htmlFor="provincia">Provincia</Label>
                    <Input
                      id="provincia"
                      name="provincia"
                      placeholder="es. Milano"
                      required
                    />
                  </div>

                  {/* Specializzazioni */}
                  <div className="space-y-3">
                    <Label>Specializzazioni</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {specializzazioni.map((spec) => (
                        <label
                          key={spec}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedSpecs.includes(spec)}
                            onCheckedChange={() => toggleSpec(spec)}
                          />
                          <span className="text-sm text-foreground">
                            {spec}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tariffa consulenza */}
                  <div className="space-y-2">
                    <Label htmlFor="tariffa">Tariffa consulenza</Label>
                    <Input
                      id="tariffa"
                      name="tariffa"
                      placeholder="es. €80/ora oppure €150 a pratica"
                    />
                  </div>

                  {/* Descrizione attività */}
                  <div className="space-y-2">
                    <Label htmlFor="descrizione">
                      Breve descrizione attività
                    </Label>
                    <textarea
                      id="descrizione"
                      name="descrizione"
                      rows={4}
                      placeholder="Descrivi brevemente la tua esperienza e i servizi che offri..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  {/* Privacy checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacy"
                      checked={privacy}
                      onCheckedChange={(checked) =>
                        setPrivacy(checked === true)
                      }
                      required
                    />
                    <Label
                      htmlFor="privacy"
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      Accetto la{" "}
                      <Link
                        href="/privacy"
                        className="text-brand-navy underline hover:text-brand-amber"
                      >
                        privacy policy
                      </Link>{" "}
                      e i{" "}
                      <Link
                        href="/termini"
                        className="text-brand-navy underline hover:text-brand-amber"
                      >
                        termini di servizio
                      </Link>
                    </Label>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={!privacy || loading}
                    className="w-full bg-brand-amber hover:bg-brand-amber-dark text-white font-bold text-base py-6 uppercase tracking-wider"
                  >
                    {loading
                      ? "Invio in corso..."
                      : "Invia richiesta di accreditamento"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Il tuo profilo sarà verificato dal team prima della
                    pubblicazione.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
