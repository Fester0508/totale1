import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LavoroChiaro",
      url: "https://lavorochiaro.it",
      description:
        "Il primo servizio italiano di analisi buste paga con intelligenza artificiale.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@lavorochiaro.it",
        contactType: "customer service",
        availableLanguage: "Italian",
      },
    },
    {
      "@type": "WebApplication",
      name: "LavoroChiaro",
      url: "https://lavorochiaro.it",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "EUR",
          description: "Analisi base senza upload dati sensibili",
        },
        {
          "@type": "Offer",
          name: "Pay-Per-Error",
          price: "3.99",
          priceCurrency: "EUR",
          description: "Paghi solo quando trovi anomalie",
        },
        {
          "@type": "Offer",
          name: "Abbonamento Ultra-Low",
          price: "0.99",
          priceCurrency: "EUR",
          description:
            "Analisi illimitata, meno di 1 euro al mese",
        },
        {
          "@type": "Offer",
          name: "Pro + Chatbot",
          price: "9.99",
          priceCurrency: "EUR",
          description:
            "Chatbot specializzato in diritto del lavoro",
        },
      ],
    },
  ],
};

const editorialCards = [
  {
    id: "01",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01%3A27-4hhvjGvYVtn2ZV2yIGpxjLQYtFtqdk.png",
    alt: "Anche Cesare si fido'.",
  },
  {
    id: "02",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02%3A27-gNwJRfl1zEK5BdG62tmClIVz5AhVpq.png",
    alt: "Bruto tradi' in silenzio.",
  },
  {
    id: "03",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03%3A27-lril61lPTPSMmIpaoXdNRgKWgk0eor.png",
    alt: "Il cavallo di Troia era un regalo.",
  },
  {
    id: "04",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04%3A27-UQJTFqEzKzZtnFc2Y6709neWpMe287.png",
    alt: "Giuda lo fece per soldi.",
  },
  {
    id: "05",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05%3A27-1tApasQNO8drFjcipRz1o6qbNX1d8t.png",
    alt: "Il 15 marzo cambio' tutto.",
  },
  {
    id: "19",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DC7BC352-63EF-419F-9BA9-91C3F713BE78-oxeVbSwDqjm9xMfbRhcSz6jRQCSTob.png",
    alt: "La mano di Dio.",
    wide: true,
  },
];

const steps = [
  { num: "01", title: "Carica", desc: "Scatta una foto o carica il PDF della tua busta paga." },
  { num: "02", title: "Analisi AI", desc: "La nostra AI legge ogni voce e la confronta con il tuo CCNL." },
  { num: "03", title: "Referto", desc: "Ricevi un report chiaro con errori, anomalie e soldi da recuperare." },
];

const plans = [
  {
    name: "Free",
    price: "0",
    period: "",
    desc: "Analisi base senza upload dati sensibili",
    features: ["Verifica cedolino base", "Rilevamento anomalie comuni", "Report semplice", "Nessun dato salvato"],
    highlight: false,
  },
  {
    name: "Pay-Per-Error",
    price: "3,99",
    period: "",
    desc: "Paghi solo quando trovi anomalie",
    features: ["Analisi completa", "Rilevamento anomalie avanzate", "Report dettagliato", "Storico cedolini"],
    highlight: true,
  },
  {
    name: "Ultra-Low",
    price: "0,99",
    period: "/mese",
    desc: "Illimitato, meno di 1 euro al mese",
    features: ["Analisi illimitata", "Alert automatici", "Storico completo", "Supporto email"],
    highlight: false,
  },
  {
    name: "Pro + Chatbot",
    price: "9,99",
    period: "/mese",
    desc: "Chatbot specializzato in diritto del lavoro",
    features: ["Tutto di Ultra-Low", "Chatbot 24/7", "Consulenza personalizzata", "Priorita' support"],
    highlight: false,
  },
];

const faqs = [
  {
    q: "Quanto costa usare LavoroChiaro?",
    a: "Il piano Free ti permette di fare analisi base gratis. I piani a pagamento partono da 0,99 euro al mese.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "Ogni documento viene crittografato con standard AES-256, trasmesso su connessione HTTPS e conservato su server europei conformi GDPR.",
  },
  {
    q: "Come funziona l'analisi della busta paga?",
    a: "L'AI estrae tutti i dati con OCR avanzato, poi confronta ogni voce con le tabelle CCNL, la normativa vigente e le aliquote fiscali aggiornate.",
  },
  {
    q: "Funziona con il mio contratto?",
    a: "Supportiamo tutti i principali CCNL italiani: Commercio, Metalmeccanico, Pubblico Impiego, Sanita', Edilizia, Turismo e molti altri.",
  },
  {
    q: "L'analisi sostituisce un consulente del lavoro?",
    a: "No. LavoroChiaro e' uno strumento informativo che ti permette di arrivare dal consulente gia' informato.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <p className="text-sm tracking-[0.25em] uppercase text-brand-gray mb-6">
            [lavoroinchiaro.it]
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] max-w-4xl text-balance">
            <span className="text-brand-navy">La tua busta paga</span>
            <br />
            <span className="text-brand-amber">dice la verita'?</span>
          </h1>

          <div className="w-24 h-[2px] bg-brand-amber mx-auto my-8" />

          <p className="text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed">
            Il 67% dei lavoratori italiani ha almeno un errore in busta paga.
            <br className="hidden md:block" />
            Scoprilo in 30 secondi. Gratis.
          </p>

          <Link
            href="#analizza"
            className="mt-10 inline-flex items-center justify-center bg-brand-navy text-primary-foreground font-bold text-lg px-12 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-navy-light transition-colors active:scale-[0.97]"
          >
            Analizza la tua busta paga
          </Link>

          <p className="mt-4 text-xs text-muted-foreground">
            Nessuna registrazione richiesta &middot; Conforme GDPR &middot; 30 secondi
          </p>
        </section>

        {/* ── DIVIDER LINE ── */}
        <div className="w-full max-w-4xl mx-auto h-[1px] bg-brand-amber/30" />

        {/* ── STATS BAR ── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { value: "67%", label: "dei cedolini ha errori" },
                { value: "30s", label: "tempo medio di analisi" },
                { value: "234", label: "euro medi recuperabili" },
                { value: "50+", label: "CCNL supportati" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-brand-navy">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COME FUNZIONA ── */}
        <section id="come-funziona" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-12">
              Come funziona
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step) => (
                <div key={step.num} className="text-center md:text-left">
                  <p className="text-4xl font-bold text-brand-amber/30 mb-2">{step.num}</p>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── UPLOAD CTA ── */}
        <section id="analizza" className="py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-brand-navy mb-4">
              Carica il tuo cedolino.
            </h2>
            <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />
            <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
              PDF, foto o scansione. L&apos;analisi parte in automatico
              e il referto arriva in 30 secondi.
            </p>

            <Link
              href="/registrati"
              className="inline-flex items-center justify-center bg-brand-amber text-accent-foreground font-bold text-lg px-14 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors active:scale-[0.97]"
            >
              Inizia ora
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>AES-256 encryption</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Server EU / GDPR</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Eliminazione automatica 30gg</span>
            </div>
          </div>
        </section>

        {/* ── EDITORIAL CAROUSEL ── */}
        <section className="py-16 md:py-20 bg-card overflow-hidden">
          <div className="container mx-auto px-6 mb-10">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center">
              La campagna
            </h2>
          </div>
          <div className="flex gap-6 px-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {editorialCards.map((card) => (
              <div
                key={card.id}
                className={`shrink-0 snap-center rounded-lg overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow ${
                  card.wide ? "w-[400px] md:w-[560px]" : "w-[280px] md:w-[320px]"
                }`}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={card.wide ? 560 : 320}
                  height={card.wide ? 320 : 320}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="prezzi" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              Prezzi
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-brand-navy mb-12">
              Scegli il tuo piano
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg border p-6 flex flex-col ${
                    plan.highlight
                      ? "border-brand-amber border-2 bg-card shadow-lg"
                      : "border-border bg-card"
                  }`}
                >
                  <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
                  <div className="mt-2 mb-1">
                    <span className="text-3xl font-bold text-brand-navy">
                      &euro;{plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                    Features
                  </p>
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-green-600 mt-0.5 shrink-0">&check;</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/registrati"
                    className={`mt-6 block text-center py-3 rounded-sm font-semibold text-sm uppercase tracking-wider transition-colors ${
                      plan.highlight
                        ? "bg-brand-amber text-accent-foreground hover:bg-brand-amber-dark"
                        : "bg-brand-navy text-primary-foreground hover:bg-brand-navy-light"
                    }`}
                  >
                    {plan.price === "0" ? "Inizia gratis" : "Scegli piano"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-12">
              Domande frequenti
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-border/50 pb-6">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-foreground hover:text-brand-navy transition-colors">
                    {faq.q}
                    <span className="text-brand-amber ml-4 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-brand-navy rounded-lg p-10 md:p-16 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4 text-balance">
                Controlla prima di fidarti.
              </h2>
              <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />
              <p className="text-primary-foreground/70 max-w-md mx-auto mb-8 leading-relaxed">
                La tua busta paga potrebbe nascondere errori che ti costano centinaia di euro ogni anno.
              </p>
              <Link
                href="#analizza"
                className="inline-flex items-center justify-center bg-background text-brand-navy font-bold text-lg px-12 py-5 rounded-sm uppercase tracking-wider hover:bg-background/90 transition-colors active:scale-[0.97]"
              >
                Analizza ora
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
