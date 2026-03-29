import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { UploadZone } from "@/components/upload-zone";
import { RotatingHeadline } from "@/components/rotating-headline";
import { FileSearch, AlertTriangle, Users, ArrowRight } from "lucide-react";

/* ── JSON-LD ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LavoroInChiaro",
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
      name: "LavoroInChiaro",
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
            "Analisi busta paga gratuita illimitata, senza registrazione",
        },
        {
          "@type": "Offer",
          name: "Consulenza",
          price: "9.90",
          priceCurrency: "EUR",
          description: "Consulenza professionale una tantum",
        },
        {
          "@type": "Offer",
          name: "Abbonamento",
          price: "0.99",
          priceCurrency: "EUR",
          description:
            "Revoca trattenute automatica, monitoraggio continuo busta paga",
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
          name: "Quanto costa usare LavoroInChiaro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'analisi della busta paga e' sempre gratuita e illimitata. Per consulenze professionali il costo parte da 9,90 euro. L'abbonamento associativo costa 0,99 euro/mese. Il piano Pro + Chatbot costa 9,99 euro/mese.",
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
            text: "No. LavoroInChiaro e uno strumento informativo che ti permette di arrivare dal consulente gia informato, con un referto dettagliato delle anomalie trovate.",
          },
        },
      ],
    },
  ],
};

/* ── Data ── */
const steps = [
  { num: "01", title: "Carica", desc: "Scatta una foto o carica il PDF della tua busta paga." },
  { num: "02", title: "Analisi AI", desc: "La nostra AI legge ogni voce e la confronta con il tuo CCNL." },
  { num: "03", title: "Referto", desc: "Ricevi un report chiaro con errori, anomalie e soldi da recuperare." },
];

const services = [
  {
    title: "Consulenza errori busta paga",
    desc: "Hai trovato anomalie? Un consulente del lavoro della nostra rete ti aiuta a capire come recuperare il dovuto.",
    price: "da \u20ac9,90",
    bigPrice: "\u20ac9,90",
    bigPriceColor: "text-brand-amber",
    href: "/richiesta-consulenza",
    cta: "Prenota una consulenza",
  },
  {
    title: "730 Fiscalisti",
    desc: "Dichiarazione dei redditi senza stress. Collegati con commercialisti e consulenti certificati.",
    price: "da \u20ac9,90",
    bigPrice: "\u20ac9,90",
    bigPriceColor: "text-brand-amber",
    href: "/richiesta-consulenza",
    cta: "Trova il tuo fiscalista",
  },
  {
    title: "Recupero differenze retributive",
    desc: "Analizziamo le tue buste paga degli ultimi 5 anni. Se ci sono differenze retributive, ti aiutiamo a recuperarle.",
    price: "fino a 5 anni \u00b7 media \u20ac2.400",
    bigPrice: "\u20ac2.400",
    bigPriceColor: "text-brand-amber",
    bigPriceLabel: "recupero medio",
    href: "/richiesta-consulenza",
    cta: "Verifica ora",
  },
  {
    title: "Dimissioni Online",
    desc: "Fatti assistere da un consulente del lavoro. Carica carta d\u2019identit\u00e0, codice fiscale e ultima busta paga \u2014 al resto pensiamo noi.",
    price: "da \u20ac9,90",
    bigPrice: "\u20ac9,90",
    bigPriceColor: "text-brand-amber",
    href: "/richiesta-consulenza",
    cta: "Inizia la pratica",
  },
  {
    title: "Calcolo NASPI",
    desc: "Scopri quanto ti spetta di indennit\u00e0 di disoccupazione e per quanto tempo. Simulazione gratuita.",
    price: "gratuito",
    bigPrice: "GRATIS",
    bigPriceColor: "text-emerald-500",
    href: "/richiesta-consulenza",
    cta: "Calcola la tua NASPI",
  },
  {
    title: "Maternit\u00e0",
    desc: "Congedo, indennit\u00e0 INPS, permessi allattamento. Il nostro agente AI ti guida passo passo.",
    price: "gratuito",
    bigPrice: "GRATIS",
    bigPriceColor: "text-emerald-500",
    href: "/richiesta-consulenza",
    cta: "Scopri i tuoi diritti",
  },
  {
    title: "Controllo Multe",
    desc: "Analisi automatica della tua multa: termini di notifica, vizi di forma, prescrizione.",
    price: "gratuito",
    bigPrice: "GRATIS",
    bigPriceColor: "text-emerald-500",
    href: "/richiesta-consulenza",
    cta: "Controlla la tua multa",
  },
  {
    title: "Colf e Badanti",
    desc: "Assistenza completa per contratti di lavoro domestico: assunzione, retribuzione, contributi INPS, TFR.",
    price: "Presto disponibile",
    bigPrice: "",
    bigPriceColor: "",
    href: "#",
    cta: "In arrivo",
    comingSoon: true,
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    period: "",
    desc: "Analisi busta paga gratuita, illimitata, senza registrazione",
    features: [
      "Analisi illimitate",
      "Score e anomalie",
      "Referto completo",
      "Nessuna registrazione",
    ],
    highlight: false,
    badge: "GRATUITO" as string | null,
    cta: "Analizza gratis",
    href: "#analizza",
  },
  {
    name: "Consulenza",
    price: "9,90",
    period: " una tantum",
    desc: "Consulenza professionale con un esperto della nostra rete",
    features: [
      "Consulente dedicato",
      "Analisi anomalie approfondita",
      "Piano d\u2019azione personalizzato",
      "Supporto email",
    ],
    highlight: false,
    badge: null as string | null,
    cta: "Prenota consulenza",
    href: "/servizi/professionisti",
  },
  {
    name: "Abbonamento",
    price: "0,99",
    period: "/mese",
    desc: "Revoca trattenute automatica + monitoraggio continuo",
    features: [
      "Revoca trattenute non dovute",
      "Monitoraggio busta paga",
      "Report mensile anomalie",
      "Accesso prioritario consulenti",
    ],
    highlight: true,
    badge: "CONSIGLIATO" as string | null,
    cta: "Associati ora",
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
    badge: "PREMIUM" as string | null,
    cta: "Scegli Pro",
    href: "/registrati",
  },
];

const faqs = [
  {
    q: "Quanto costa analizzare la busta paga?",
    a: "L\u2019analisi della busta paga \u00e8 sempre gratuita e illimitata. Non serve registrazione. Puoi caricare quante buste paga vuoi, quando vuoi.",
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
    a: "No. LavoroInChiaro \u00e8 uno strumento informativo che ti permette di arrivare dal consulente gi\u00e0 informato, con un referto dettagliato delle anomalie trovate.",
  },
  {
    q: "Cosa succede se trovo errori nella busta paga?",
    a: "Puoi prenotare una consulenza con un esperto della nostra rete a partire da \u20ac9,90. Il consulente analizzer\u00e0 le anomalie e ti guider\u00e0 nel recupero del dovuto.",
  },
  {
    q: "Come funziona il recupero delle differenze retributive?",
    a: "Analizziamo le tue buste paga degli ultimi 5 anni confrontandole con il CCNL applicato. Se emergono differenze, ti mettiamo in contatto con un consulente per avviare il recupero. In media i lavoratori recuperano \u20ac2.400.",
  },
  {
    q: "Cos\u2019\u00e8 l\u2019abbonamento da \u20ac0,99/mese?",
    a: "Con l\u2019abbonamento associativo predisponiamo in automatico la revoca alle trattenute in busta paga che potresti avere. Inoltre ricevi monitoraggio continuo e report mensili sulle anomalie.",
  },
  {
    q: "Come funzionano le dimissioni online?",
    a: "Le dimissioni oggi si danno esclusivamente online. Carichi carta d\u2019identit\u00e0, codice fiscale e ultima busta paga, e un nostro consulente del lavoro si occupa dell\u2019intera pratica.",
  },
  {
    q: "Il calcolo NASPI \u00e8 gratuito?",
    a: "S\u00ec, la simulazione del calcolo NASPI \u00e8 completamente gratuita. Basata sulla normativa vigente, ti dice quanto ti spetta e per quanto tempo.",
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
        {/* ── 1. HERO ── */}
        <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 bg-brand-navy">
          <div className="container mx-auto flex flex-col items-center text-center gap-8 md:gap-10">

            {/* SEMPRE GRATUITO badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 tracking-wide uppercase">
              SEMPRE GRATUITO
            </div>

            {/* TITOLO GIGANTE */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
              <span className="text-primary-foreground">La tua busta paga</span>
              <br />
              <span className="text-brand-amber">ti mente?</span>
            </h1>

            {/* LINEA */}
            <div className="w-20 h-[2px] bg-brand-amber" />

            {/* 3-STEP VALUE PROP */}
            <div className="max-w-2xl mx-auto space-y-3 text-left">
              <p className="text-primary-foreground/90 text-base md:text-lg">
                <span className="font-bold text-emerald-400">1. Analizza gratis</span>{" "}
                <span className="text-primary-foreground/70">&mdash; Carica la tua busta paga, è sempre gratuito</span>
              </p>
              <p className="text-primary-foreground/90 text-base md:text-lg">
                <span className="font-bold text-brand-amber">2. Errori trovati?</span>{" "}
                <span className="text-primary-foreground/70">&mdash; Scopri quali per soli &euro;3,99</span>
              </p>
              <p className="text-primary-foreground/90 text-base md:text-lg">
                <span className="font-bold text-brand-amber">3. Errori significativi?</span>{" "}
                <span className="text-primary-foreground/70">&mdash; Fatti aiutare da un nostro consulente a recuperare i crediti</span>
              </p>
            </div>

            {/* CTA BUTTON */}
            <Link
              href="#analizza"
              className="inline-flex items-center justify-center bg-brand-amber text-white font-bold text-base md:text-lg px-10 md:px-14 py-4 md:py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Analizza ora — È gratis
            </Link>

            {/* TRUST BADGES */}
            <p className="text-xs text-primary-foreground/40">
              Analisi sempre gratuita &middot; Conforme GDPR &middot; 30 secondi
            </p>

          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="w-full max-w-4xl mx-auto h-px bg-brand-amber/30" />

        {/* ── 2. STATS ── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { value: "10.000+", label: "buste analizzate" },
                { value: "30s", label: "tempo medio di analisi" },
                { value: "\u20ac2.400", label: "recupero medio" },
                { value: "100+", label: "CCNL supportati" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl md:text-5xl font-bold text-brand-navy">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. COME FUNZIONA ── */}
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

        {/* ── 4. REPORT PREVIEW ── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              Ecco cosa ottieni
            </h2>
            <p className="text-center text-xl md:text-2xl font-bold text-brand-navy mb-10 text-balance">
              Un referto chiaro, in 30 secondi
            </p>

            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-xl border shadow-xl overflow-hidden">
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
                      Analizza la tua busta paga
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FLUSSO — 3 Step Visual Flow ── */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              Come ti aiutiamo
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-brand-navy mb-14 text-balance">
              Tre passi per proteggere il tuo stipendio
            </p>

            <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-6 md:gap-0">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <FileSearch className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-emerald-500 text-white mb-3">
                  GRATUITO
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">Analizza gratis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Carica la tua busta paga. L&apos;analisi è sempre gratuita, senza limiti.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex items-center justify-center pt-8">
                <ArrowRight className="w-6 h-6 text-brand-amber" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-brand-amber text-white mb-3">
                  €3,99
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">Scopri gli errori</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se troviamo anomalie, sblocca il report completo con tutti i dettagli per soli &euro;3,99.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex items-center justify-center pt-8">
                <ArrowRight className="w-6 h-6 text-brand-amber" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center px-4">
                <Link href="#servizi" className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-brand-navy/10 flex items-center justify-center mb-4 group-hover:bg-brand-navy/20 transition-colors">
                    <Users className="w-8 h-8 text-brand-navy" />
                  </div>
                  <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-brand-navy text-white mb-3">
                    CONSULENTE
                  </span>
                  <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-amber transition-colors">Recupera i tuoi crediti</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Se gli errori sono significativi, un nostro consulente ti aiuta a recuperare fino a 5 anni di differenze retributive.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. UPLOAD SECTION ── */}
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
                Analisi SEMPRE GRATUITA &mdash; senza registrazione
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

        {/* ── 6. SERVIZI ── */}
        <section id="servizi" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-brand-gray text-center mb-4">
              Oltre l&apos;analisi
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-brand-navy mb-12 text-balance">
              I nostri servizi
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {services.map((svc) => (
                <div
                  key={svc.title}
                  className={`relative rounded-lg border p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 ${
                    svc.comingSoon
                      ? "border-border bg-card/60 opacity-75"
                      : "border-border bg-card shadow-sm"
                  }`}
                >
                  {svc.comingSoon && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      PRESTO DISPONIBILE
                    </span>
                  )}
                  {svc.bigPrice && (
                    <div className="mb-3 text-center">
                      <p className={`text-4xl lg:text-5xl font-bold font-accent ${svc.bigPriceColor}`}>
                        {svc.bigPrice}
                      </p>
                      {svc.bigPriceLabel && (
                        <p className="text-xs text-muted-foreground mt-1">{svc.bigPriceLabel}</p>
                      )}
                    </div>
                  )}
                  <h3 className="font-bold text-foreground text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{svc.desc}</p>
                  {!svc.comingSoon ? (
                    <Link
                      href={svc.href}
                      className="block text-center py-2.5 rounded-sm font-semibold text-sm uppercase tracking-wider transition-colors bg-brand-navy text-primary-foreground hover:bg-brand-navy-light"
                    >
                      {svc.cta}
                    </Link>
                  ) : (
                    <span className="block text-center py-2.5 rounded-sm font-semibold text-sm uppercase tracking-wider bg-muted text-muted-foreground cursor-not-allowed">
                      {svc.cta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. ASSOCIATI ── */}
        <section id="associati" className="py-20 md:py-28 bg-brand-navy scroll-mt-16">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Ti sei trovato bene?{" "}
              <span className="text-brand-amber">Associati.</span>
            </h2>
            <div className="w-16 h-[2px] bg-brand-amber mx-auto mb-6" />

            <p className="text-5xl md:text-6xl font-bold font-accent text-brand-amber mb-4">
              &euro;0,99<span className="text-2xl md:text-3xl text-primary-foreground/70">/mese</span>
            </p>

            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-4 leading-relaxed text-lg">
              Alla quota simbolica di &euro;0,99/mese predisponiamo in automatico la revoca alle trattenute in busta che potresti avere. Proteggi il tuo stipendio ogni mese.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto my-10 text-left">
              {[
                "Revoca automatica trattenute non dovute",
                "Monitoraggio continuo della busta paga",
                "Accesso prioritario ai consulenti",
                "Report mensile anomalie",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2.5 bg-white/10 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-foreground text-sm">{b}</span>
                </div>
              ))}
            </div>

            <Link
              href="/richiesta-consulenza"
              className="inline-flex items-center justify-center bg-brand-amber text-white font-bold text-lg px-14 py-5 rounded-sm uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow-lg shadow-brand-amber/30"
            >
              Associati ora
            </Link>
          </div>
        </section>

        {/* ── 8. PRICING ── */}
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
                          : "bg-emerald-500 text-white"
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

        {/* ── 9. FAQ ── */}
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

        {/* ── 10. FINAL CTA ── */}
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

      {/* ── 11. FOOTER ── */}
      <Footer />
    </div>
  );
}
