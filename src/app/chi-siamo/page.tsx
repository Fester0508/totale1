import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { Shield, Eye, Users, Scale } from "lucide-react";

export default function ChiSiamo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-brand-navy">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Chi siamo
            </h1>
            <div className="w-16 h-[2px] bg-brand-amber mx-auto" />
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                <strong className="text-brand-navy">LavoroInChiaro</strong> &egrave; il primo servizio
                italiano di analisi buste paga con intelligenza artificiale.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Controlliamo buste paga, dichiarazioni dei redditi, cartelle esattoriali e
                multe in pochi secondi, proteggendo i diritti e il portafoglio dei
                lavoratori italiani.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Verifichiamo stipendio, CCNL, trattenute INPS, contributi, TFR, ferie,
                straordinari, IRPEF e molto altro. Il tutto con tecnologia OCR e AI
                avanzata, conforme GDPR.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                La nostra missione &egrave; rendere accessibile a tutti il controllo della
                propria busta paga &mdash; gratuitamente. Quando servono approfondimenti,
                mettiamo in contatto i lavoratori con una rete di professionisti
                certificati: commercialisti, consulenti del lavoro e avvocati
                giuslavoristi.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              I nostri valori
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-brand-navy mb-12 text-balance">
              Cosa ci guida ogni giorno
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Protezione",
                  desc: "Difendiamo i diritti retributivi dei lavoratori con strumenti accessibili a tutti.",
                },
                {
                  icon: Eye,
                  title: "Trasparenza",
                  desc: "Ogni voce della busta paga viene analizzata e spiegata in modo chiaro e comprensibile.",
                },
                {
                  icon: Users,
                  title: "Rete di esperti",
                  desc: "Collaboriamo con commercialisti, consulenti del lavoro e avvocati giuslavoristi certificati.",
                },
                {
                  icon: Scale,
                  title: "Equit&agrave;",
                  desc: "Crediamo che ogni lavoratore meriti di essere pagato correttamente, senza eccezioni.",
                },
              ].map((val) => (
                <div key={val.title} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-amber/10 flex items-center justify-center mx-auto mb-4">
                    <val.icon className="w-7 h-7 text-brand-amber" />
                  </div>
                  <h3 className="font-bold text-brand-navy text-lg mb-2">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-brand-navy">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto a controllare la tua busta paga?
            </h2>
            <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />
            <p className="text-primary-foreground/60 max-w-md mx-auto mb-10 leading-relaxed text-lg">
              L&apos;analisi &egrave; sempre gratuita, senza limiti e senza registrazione.
            </p>
            <Link
              href="/#analizza"
              className="inline-flex items-center justify-center bg-brand-amber text-white font-bold text-lg px-14 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30"
            >
              Analizza la tua busta paga &mdash; &Egrave; gratis
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
