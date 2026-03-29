"use client";

import { useState, FormEvent } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";

export default function RichiestaConsulenza() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-3 text-center">
            Richiedi una consulenza
          </h1>
          <p className="text-center text-muted-foreground mb-10 text-lg leading-relaxed">
            Compila il form e un nostro esperto ti contatter&agrave; entro 24 ore.
          </p>

          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
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
              <h2 className="text-2xl font-bold text-brand-navy mb-3">
                Richiesta inviata!
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Grazie per averci contattato. Un nostro esperto ti contatter&agrave;
                entro 24 ore all&apos;indirizzo email che hai indicato.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                    placeholder="Mario"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cognome"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Cognome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                    placeholder="Rossi"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                    placeholder="mario.rossi@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Telefono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                    placeholder="+39 333 1234567"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="servizio"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Hai bisogno di un esperto in:
                </label>
                <select
                  id="servizio"
                  name="servizio"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors"
                >
                  <option value="">Seleziona un servizio</option>
                  <option value="analisi-busta-paga">Analisi busta paga</option>
                  <option value="recupero-differenze">
                    Recupero differenze retributive
                  </option>
                  <option value="730">Dichiarazione 730</option>
                  <option value="dimissioni">Dimissioni online</option>
                  <option value="naspi">Calcolo NASPI</option>
                  <option value="maternita">Maternit&agrave; e congedi</option>
                  <option value="multe">Controllo multe</option>
                  <option value="colf-badanti">Contratti colf e badanti</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="messaggio"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Messaggio
                </label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-colors resize-y"
                  placeholder="Descrivi brevemente la tua situazione..."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-border text-brand-amber focus:ring-brand-amber/50"
                />
                <label
                  htmlFor="privacy"
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  Accetto la{" "}
                  <a
                    href="/privacy"
                    className="text-brand-amber hover:underline"
                  >
                    privacy policy
                  </a>{" "}
                  e acconsento al trattamento dei miei dati personali.{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center bg-brand-amber text-white font-bold text-base px-10 py-4 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Invio in corso..." : "Invia richiesta"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
