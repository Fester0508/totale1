import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { UploadZone } from "@/components/upload-zone";

/* ── JSON-LD ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LavoroChiaro",
      url: "https://lavoroinchiaro.it",
      description:
        "Il primo servizio italiano di analisi buste paga con intelligenza artificiale.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@lavoroinchiaro.it",
        contactType: "customer service",
        availableLanguage: "Italian",
      },
    },
    {
      "@type": "WebApplication",
      name: "LavoroChiaro",
      url: "https://lavoroinchiaro.it",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "EUR",
          description:
            "1 analisi/mese, referto parziale (titoli anomalie visibili, dettagli bloccati)",
        },
        {
          "@type": "Offer",
          name: "Pay-Per-Error",
          price: "3.99",
          priceCurrency: "EUR",
          description: "Analisi singola completa, paghi una tantum",
        },
        {
          "@type": "Offer",
          name: "Abbonamento",
          price: "0.99",
          priceCurrency: "EUR",
          description:
            "Analisi illimitate, storico 24 mesi, alert mensili. Bloccato 6 mesi poi 4,99/mese",
        },
        {
          "@type": "Offer",
          name: "Pro + Chatbot",
          price: "9.99",
          priceCurrency: "EUR",
          description:
            "Tutto incluso + chatbot AI diritto del lavoro disponibile 24/7",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quanto costa usare LavoroChiaro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Il piano Free offre 1 analisi al mese con referto parziale, gratis. Pay-Per-Error costa 3,99 euro a singola analisi. L'abbonamento parte da 0,99 euro/mese (bloccato 6 mesi, poi 4,99/mese). Il piano Pro + Chatbot costa 9,99 euro/mese.",
          },
        },
        {
          "@type": "Question",
          name: "I miei dati sono al sicuro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ogni documento viene crittografato con standard AES-256, trasmesso su connessione HTTPS e conservato su server europei conformi GDPR. Eliminazione automatica dopo 30 giorni.",
          },
        },
        {
          "@type": "Question",
          name: "Come funziona l'analisi della busta paga?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI estrae tutti i dati con OCR avanzato, poi confronta ogni voce con le tabelle CCNL, la normativa vigente e le aliquote fiscali aggiornate. Il referto arriva in circa 30 secondi.",
          },
        },
        {
          "@type": "Question",
          name: "Funziona con il mio contratto?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Supportiamo tutti i principali CCNL italiani: Commercio, Metalmeccanico, Pubblico Impiego, Sanita, Edilizia, Turismo e molti altri.",
          },
        },
        {
          "@type": "Question",
          name: "L'analisi sostituisce un consulente del lavoro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. LavoroChiaro e uno strumento informativo che ti permette di arrivare dal consulente gia informato, con un referto dettagliato delle anomalie trovate.",
          },
        },
      ],
    },
  ],
};

/* ── Data ── */
const editorialCards = [
  { id: "01", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01%3A27-4hhvjGvYVtn2ZV2yIGpxjLQYtFtqdk.png", alt: "Anche Cesare si fido." },
  { id: "02", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02%3A27-gNwJRfl1zEK5BdG62tmClIVz5AhVpq.png", alt: "Bruto tradi in silenzio." },
  { id: "03", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03%3A27-lril61lPTPSMmIpaoXdNRgKWgk0eor.png", alt: "Il cavallo di Troia era un regalo." },
  { id: "04", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04%3A27-UQJTFqEzKzZtnFc2Y6709neWpMe287.png", alt: "Giuda lo fece per soldi." },
  { id: "05", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05%3A27-1tApasQNO8drFjcipRz1o6qbNX1d8t.png", alt: "Il 15 marzo cambio tutto." },
  { id: "06", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06%3A27-bxw7DjzWQOxTqzPmB3qMosvxIZeUFz.png", alt: "Watergate era un documento." },
  { id: "07", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07%3A27-pkz4WJ6vEApF7VYc6t86wnhGJdktXr.png", alt: "Enrico VIII cambio le regole." },
  { id: "08", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08%3A27-t8DSwOBfIHQjmUDsTxEihMUCfGvEKR.png", alt: "Suarez morse Chiellini." },
  { id: "09", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/09%3A27-wDapLUXTPJl9FnPFQXJQ6QT735QKRc.png", alt: "Le telefonate cerano." },
  { id: "10", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10%3A27-bWbytmIT2IVy0d4jB2febj1wRIUfwf.png", alt: "7 Tour. Tutte bugie." },
  { id: "11", src: "/headlines/11.png", alt: "Il gol fantasma." },
  { id: "12", src: "/headlines/12.png", alt: "Lo fece in diretta." },
  { id: "13", src: "/headlines/13.png", alt: "Rossi scommise contro." },
  { id: "14", src: "/headlines/14.png", alt: "Calciopoli." },
  { id: "15", src: "/headlines/15.png", alt: "Totti non vide il cartellino." },
  { id: "16", src: "/headlines/16.png", alt: "Retrocessione." },
  { id: "17", src: "/headlines/17.png", alt: "Madoff pagava tutti. Coi soldi degli altri." },
  { id: "18", src: "/headlines/18.png", alt: "Enron valeva miliardi. Sulla carta." },
  { id: "19", src: "/headlines/19.png", alt: "Theranos analizzava il sangue. Con niente." },
  { id: "20", src: "/headlines/20.png", alt: "Fu assolto." },
  { id: "21", src: "/headlines/21.png", alt: "Nixon nego tutto." },
  { id: "22", src: "/headlines/22.png", alt: "Volkswagen truccava i motori." },
  { id: "23", src: "/headlines/23.png", alt: "Il Muro cadde in una notte." },
  { id: "24", src: "/headlines/24.png", alt: "Telefonava di notte." },
  { id: "25", src: "/headlines/25.png", alt: "Pandora apri il vaso." },
  { id: "26", src: "/headlines/26.png", alt: "Il lupo si vesti da agnello." },
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
    desc: "1 analisi al mese con referto parziale",
    features: [
      "1 analisi / mese",
      "Titoli anomalie visibili",
      "Dettagli bloccati",
      "Nessuna registrazione",
    ],
    highlight: false,
    badge: null as string | null,
    cta: "Inizia gratis",
    href: "#analizza",
  },
  {
    name: "Pay-Per-Error",
    price: "3,99",
    period: " una tantum",
    desc: "Analisi singola completa, provalo una volta",
    features: [
      "Analisi completa singola",
      "Referto dettagliato sbloccato",
      "Composizione retribuzione",
      "Raccomandazioni personalizzate",
    ],
    highlight: false,
    badge: "PROVALO",
    cta: "Sblocca analisi",
    href: "/registrati",
  },
  {
    name: "Abbonamento",
    price: "0,99",
    period: "/mese",
    desc: "Bloccato 6 mesi, poi 4,99/mese. Disdici quando vuoi.",
    features: [
      "Analisi illimitate",
      "Storico cedolini 24 mesi",
      "Alert mensili automatici",
      "Supporto email prioritario",
    ],
    highlight: true,
    badge: "CONSIGLIATO",
    cta: "Abbonati ora",
    href: "/registrati",
  },
  {
    name: "Pro + Chatbot",
    price: "9,99",
    period: "/mese",
    desc: "Tutto incluso + assistente AI diritto del lavoro",
    features: [
      "Tutto dell\u2019Abbonamento",
      "Chatbot AI 24/7",
      "Consulenza personalizzata",
      "Supporto prioritario",
    ],
    highlight: false,
    badge: "PREMIUM",
    cta: "Scegli Pro",
    href: "/registrati",
  },
];

const faqs = [
  {
    q: "Quanto costa usare LavoroChiaro?",
    a: "Il piano Free offre 1 analisi al mese con referto parziale, gratis e senza registrazione. Pay-Per-Error costa 3,99\u00a0\u20ac a singola analisi. L\u2019abbonamento parte da 0,99\u00a0\u20ac/mese (bloccato 6 mesi, poi 4,99\u00a0\u20ac/mese). Il piano Pro + Chatbot costa 9,99\u00a0\u20ac/mese.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "Ogni documento viene crittografato con standard AES-256, trasmesso su connessione HTTPS e conservato su server europei conformi GDPR. Eliminazione automatica dopo 30 giorni.",
  },
  {
    q: "Come funziona l\u2019analisi della busta paga?",
    a: "L\u2019AI estrae tutti i dati con OCR avanzato, poi confronta ogni voce con le tabelle CCNL, la normativa vigente e le aliquote fiscali aggiornate. Il referto arriva in circa 30 secondi.",
  },
  {
    q: "Funziona con il mio contratto?",
    a: "Supportiamo tutti i principali CCNL italiani: Commercio, Metalmeccanico, Pubblico Impiego, Sanit\u00e0, Edilizia, Turismo e molti altri.",
  },
  {
    q: "L\u2019analisi sostituisce un consulente del lavoro?",
    a: "No. LavoroChiaro \u00e8 uno strumento informativo che ti permette di arrivare dal consulente gi\u00e0 informato, con un referto dettagliato delle anomalie trovate.",
  },
  {
    q: "Cosa significa referto parziale nel piano Free?",
    a: "Nel piano Free vedi i titoli delle anomalie trovate (es. \u201CMaggiorazione straordinario notturno assente\u201D) ma i dettagli, gli importi e le raccomandazioni sono sfocati. Per sbloccarli puoi usare Pay-Per-Error o abbonarti.",
  },
];

/* ── Mini Report Preview Data ── */
const reportVoci = [
  { codice: "ERR-001", cat: "STRAORDINARI", titolo: "Maggiorazione straordinario notturno assente", importo: "\u2212 \u20ac89,00", tipo: "errore" as const },
  { codice: "AVV-001", cat: "IRPEF", titolo: "Detrazione figli a carico da aggiornare", importo: "~ \u20ac0", tipo: "avviso" as const },
  { codice: "OK-001", cat: "INPS", titolo: "Aliquota INPS corretta", importo: "", tipo: "ok" as const },
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
        <section className="relative px-6 pt-24 pb-16 md:pt-36 md:pb-24 bg-brand-navy">
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: copy */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm tracking-[0.25em] uppercase text-primary-foreground/50 mb-6">
                [lavoroinchiaro.it]
              </p>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-balance">
                <span className="text-primary-foreground">La tua busta paga</span>
                <br />
                <span className="text-brand-amber">ti mente?</span>
              </h1>

              <div className="w-24 h-[2px] bg-brand-amber my-8 mx-auto lg:mx-0" />

              <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl leading-relaxed mx-auto lg:mx-0">
                Il 67% dei lavoratori italiani ha almeno un errore in busta paga.
                <br className="hidden md:block" />
                Scoprilo in 30 secondi. Gratis.
              </p>

              <Link
                href="#analizza"
                className="mt-10 inline-flex items-center justify-center bg-brand-amber text-white font-bold text-lg px-14 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30"
              >
                Analizza la tua busta paga
              </Link>

              <p className="mt-4 text-xs text-primary-foreground/50">
                Nessuna registrazione richiesta &middot; Conforme GDPR &middot; 30 secondi
              </p>
            </div>

            {/* Right: Mini Report Preview */}
            <div className="flex-1 max-w-md w-full">
              <div className="bg-card rounded-xl border shadow-2xl shadow-black/20 overflow-hidden">
                {/* Report header */}
                <div className="p-5 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Intestatario cedolino</p>
                      <p className="text-lg font-bold text-foreground">Laura Ferretti</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-md border border-amber-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Anomalie Rilevate
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CCNL Metalmeccanici &middot; Livello 4&deg; &middot; Novembre 2024
                  </p>
                </div>

                {/* Score bar */}
                <div className="px-5 py-4 flex items-center gap-4 border-b bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-medium">Score</span>
                      <span className="text-sm font-bold text-brand-navy">61/100</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500" style={{ width: "61%" }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground">Recuperabile</p>
                    <p className="text-lg font-bold text-brand-amber">&euro;234/mese</p>
                  </div>
                </div>

                {/* Risultanze */}
                <div className="p-5 space-y-3">
                  {reportVoci.map((v) => {
                    const border = v.tipo === "errore" ? "border-l-red-500" : v.tipo === "avviso" ? "border-l-amber-500" : "border-l-green-500";
                    const badge = v.tipo === "errore" ? "bg-red-100 text-red-700" : v.tipo === "avviso" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
                    const badgeLabel = v.tipo === "errore" ? "ERRORE" : v.tipo === "avviso" ? "VERIFICA" : "CORRETTO";
                    return (
                      <div key={v.codice} className={`border-l-4 ${border} rounded-r-lg bg-muted/20 p-3`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground font-mono">{v.codice} &middot; {v.cat}</p>
                            <p className="text-sm font-semibold text-foreground leading-snug">{v.titolo}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {v.importo && <p className="text-sm font-bold text-foreground">{v.importo}</p>}
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badge}`}>{badgeLabel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Blur overlay + CTA */}
                <div className="relative">
                  <div className="p-5 space-y-3 blur-[6px] select-none pointer-events-none" aria-hidden="true">
                    <div className="border-l-4 border-l-red-500 rounded-r-lg bg-muted/20 p-3">
                      <p className="text-[10px] text-muted-foreground font-mono">ERR-002 &middot; TFR</p>
                      <p className="text-sm font-semibold text-foreground">Accantonamento TFR non aggiornato</p>
                    </div>
                    <div className="border-l-4 border-l-green-500 rounded-r-lg bg-muted/20 p-3">
                      <p className="text-[10px] text-muted-foreground font-mono">OK-002 &middot; FERIE</p>
                      <p className="text-sm font-semibold text-foreground">Residuo ferie calcolato correttamente</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
                    <Link
                      href="#analizza"
                      className="inline-flex items-center justify-center bg-brand-amber text-accent-foreground font-bold text-sm px-8 py-3 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-md"
                    >
                      Sblocca dettagli
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full max-w-4xl mx-auto h-px bg-brand-amber/30" />

        {/* ── STATS ── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { value: "67%", label: "dei cedolini ha errori" },
                { value: "30s", label: "tempo medio di analisi" },
                { value: "\u20ac234", label: "euro medi recuperabili" },
                { value: "50+", label: "CCNL supportati" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl md:text-5xl font-bold text-brand-navy">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
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
            <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              {steps.map((step) => (
                <div key={step.num} className="text-center md:text-left">
                  <p className="text-5xl font-bold text-brand-amber mb-3">{step.num}</p>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── UPLOAD SECTION ── */}
        <section id="analizza" className="py-20 md:py-28 scroll-mt-16 bg-brand-navy">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                Carica il tuo cedolino.
              </h2>
              <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />
              <p className="text-primary-foreground/70 leading-relaxed">
                PDF, foto o scansione. L&apos;analisi parte in automatico e il referto arriva in 30 secondi.
              </p>
              <p className="text-sm font-bold text-brand-amber mt-3">
                1 analisi gratuita &mdash; senza registrazione
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <UploadZone />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-foreground/40">
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
          <div
            className="flex gap-6 px-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {editorialCards.map((card) => (
              <div
                key={card.id}
                className="shrink-0 snap-center rounded-lg overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow w-[280px] md:w-[320px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt={card.alt}
                  width={320}
                  height={320}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="prezzi" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              Prezzi trasparenti
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-brand-navy mb-12 text-balance">
              Scegli come vuoi controllare la tua busta paga
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-brand-amber border-2 bg-card shadow-xl ring-2 ring-brand-amber/30 scale-[1.03]"
                      : "border-border bg-card shadow-sm"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                        plan.highlight
                          ? "bg-brand-amber text-accent-foreground"
                          : plan.badge === "PREMIUM"
                          ? "bg-brand-navy text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="font-bold text-foreground text-lg mt-1">{plan.name}</h3>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-bold text-brand-navy">
                      &euro;{plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{plan.desc}</p>

                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3 font-medium">
                    Cosa include
                  </p>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`mt-6 block text-center py-3 rounded-sm font-semibold text-sm uppercase tracking-wider transition-colors ${
                      plan.highlight
                        ? "bg-brand-amber text-accent-foreground hover:bg-brand-amber-dark"
                        : "bg-brand-navy text-primary-foreground hover:bg-brand-navy-light"
                    }`}
                  >
                    {plan.cta}
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
            <div className="space-y-0">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-border/50 py-5">
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
        <section className="py-20 md:py-28 bg-brand-navy">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Controlla prima di fidarti.
            </h2>
            <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />
            <p className="text-primary-foreground/60 max-w-md mx-auto mb-10 leading-relaxed text-lg">
              La tua busta paga potrebbe nascondere errori che ti costano centinaia di euro ogni anno.
            </p>
            <Link
              href="#analizza"
              className="inline-flex items-center justify-center bg-brand-amber text-white font-bold text-lg px-14 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30"
            >
              Analizza ora
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
