import type { Metadata } from "next";
import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { Footer } from "@/components/landing/footer";
import { FileText, CheckCircle, TrendingDown, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "LavoroChiaro - Analisi 730 / Dichiarazione dei Redditi",
  description:
    "Carica la tua dichiarazione 730 e scopri in 30 secondi se ci sono detrazioni mancanti, errori IRPEF o risparmi fiscali. Analisi AI gratuita.",
};

const features = [
  {
    icon: CheckCircle,
    text: "Verifica IRPEF e scaglioni",
  },
  {
    icon: TrendingDown,
    text: "Trova detrazioni dimenticate",
  },
  {
    icon: Receipt,
    text: "Controlla oneri deducibili",
  },
];

export default function Page730() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50/50 to-white dark:from-background dark:to-background py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-brand-amber-light dark:bg-brand-amber-light rounded-full px-4 py-1.5 text-sm font-medium text-brand-amber mb-6">
              <FileText className="h-4 w-4" />
              730 / Dichiarazione dei Redditi
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy leading-tight mb-5">
              Controlla la tua
              <br />
              dichiarazione dei redditi
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Verifica IRPEF, detrazioni dimenticate e scopri se puoi
              risparmiare sulle tasse. In 30 secondi, senza registrazione.
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
            <UploadZone documentType="730" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
