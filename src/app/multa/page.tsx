import type { Metadata } from "next";
import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { Footer } from "@/components/landing/footer";
import { Car, Timer, FileWarning, BadgeEuro } from "lucide-react";

export const metadata: Metadata = {
  title: "LavoroChiaro - Analisi Multa / Contravvenzione",
  description:
    "Carica la tua multa e verifica importo, notifica, prescrizione e scopri se puoi contestarla. Analisi AI in 30 secondi.",
};

const features = [
  {
    icon: BadgeEuro,
    text: "Verifica importo sanzione",
  },
  {
    icon: Timer,
    text: "Controlla tempi notifica",
  },
  {
    icon: FileWarning,
    text: "Verifica prescrizione",
  },
];

export default function MultaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50/50 to-white dark:from-background dark:to-background py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-brand-amber-light dark:bg-brand-amber-light rounded-full px-4 py-1.5 text-sm font-medium text-brand-amber mb-6">
              <Car className="h-4 w-4" />
              Multa / Contravvenzione
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy leading-tight mb-5">
              Controlla la tua
              <br />
              multa
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Verifica importo, notifica, prescrizione e scopri se puoi
              contestarla. In 30 secondi, senza registrazione.
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
            <UploadZone documentType="multa" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
