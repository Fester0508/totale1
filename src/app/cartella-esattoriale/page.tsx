import type { Metadata } from "next";
import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { Footer } from "@/components/landing/footer";
import { Scale, Clock, AlertTriangle, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "LavoroChiaro - Analisi Cartella Esattoriale",
  description:
    "Carica la tua cartella esattoriale e verifica importi, sanzioni, interessi e prescrizioni. Scopri se ci sono errori o se puoi contestarla.",
};

const features = [
  {
    icon: Search,
    text: "Verifica importi e sanzioni",
  },
  {
    icon: Clock,
    text: "Controlla prescrizioni",
  },
  {
    icon: AlertTriangle,
    text: "Trova errori di calcolo",
  },
];

export default function CartellaEsattorialePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50/50 to-white dark:from-background dark:to-background py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-brand-amber-light dark:bg-brand-amber-light rounded-full px-4 py-1.5 text-sm font-medium text-brand-amber mb-6">
              <Scale className="h-4 w-4" />
              Cartella Esattoriale
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy leading-tight mb-5">
              Analizza la tua
              <br />
              cartella esattoriale
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Verifica importi, sanzioni, interessi di mora e scopri se ci sono
              errori o prescrizioni. In 30 secondi, senza registrazione.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {features.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <f.icon className="h-4 w-4 text-brand-navy" />
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <UploadZone documentType="cartella-esattoriale" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
