import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { UploadZone } from "@/components/upload-zone";
import { blogArticles } from "@/lib/blog-articles";
import {
  FileSearch,
  FileText,
  Calculator,
  Heart,
  Shield,
  Home as HomeIcon,
  Users,
  MessageCircle,
  Upload,
  Brain,
  CheckCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";

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
      "@type": "WebSite",
      name: "LavoroInChiaro",
      url: "https://lavoroinchiaro.it",
      description:
        "Analisi buste paga con intelligenza artificiale. Gratuita, senza registrazione.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://lavoroinchiaro.it/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
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
            "Prima analisi completa e gratuita, poi serve un piano a pagamento",
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
            text: "La prima analisi e' completa e gratuita: vedi tutto il referto, score, importi e anomalie. Dalla seconda analisi servono i piani a pagamento. Pay-Per-Error costa 3,99 euro a singola analisi. L'abbonamento parte da 0,99 euro/mese. Il piano Pro + Chatbot costa 9,99 euro/mese.",
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
const services = [
  {
    title: "Analisi Busta Paga",
    desc: "Il nostro servizio principale: carica il tuo cedolino e ricevi un report dettagliato con errori, anomalie e soldi da recuperare.",
    icon: FileSearch,
    color: "blue",
    href: "#analizza",
    flagship: true,
  },
  {
    title: "Redazione Lettere",
    desc: "Genera richieste formali al tuo datore di lavoro con l'aiuto dell'intelligenza artificiale.",
    icon: FileText,
    color: "emerald",
    href: "/servizi/redazione-lettere",
    flagship: false,
  },
  {
    title: "Calcolo NASPI",
    desc: "Simula la tua indennit\u00e0 di disoccupazione e scopri quanto ti spetta.",
    icon: Calculator,
    color: "amber",
    href: "/servizi/calcolo-naspi",
    flagship: false,
  },
  {
    title: "Consulenza Maternit\u00e0",
    desc: "Congedo, indennit\u00e0 e diritti per la maternit\u00e0: tutto ci\u00f2 che devi sapere.",
    icon: Heart,
    color: "pink",
    href: "/servizi/maternita",
    flagship: false,
  },
  {
    title: "Controllo Multe",
    desc: "Verifica la regolarit\u00e0 delle tue multe e scopri se puoi contestarle.",
    icon: Shield,
    color: "red",
    href: "/servizi/controllo-multe",
    flagship: false,
  },
  {
    title: "Contratti Colf",
    desc: "Assistenza completa per contratti di lavoro domestico e collaboratori.",
    icon: HomeIcon,
    color: "purple",
    href: "/servizi/contratti-colf",
    flagship: false,
  },
  {
    title: "Rete Professionisti",
    desc: "Collegati con commercialisti e consulenti del lavoro nella tua zona.",
    icon: Users,
    color: "teal",
    href: "/servizi/professionisti",
    flagship: false,
  },
  {
    title: "Assistente AI",
    desc: "Hai una domanda sul lavoro? Il nostro assistente AI \u00e8 pronto ad aiutarti 24/7.",
    icon: MessageCircle,
    color: "indigo",
    href: "/servizi/assistenza",
    flagship: false,
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", ring: "ring-blue-500/20" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", ring: "ring-emerald-500/20" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", ring: "ring-amber-500/20" },
  pink: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800", ring: "ring-pink-500/20" },
  red: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800", ring: "ring-red-500/20" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", ring: "ring-purple-500/20" },
  teal: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800", ring: "ring-teal-500/20" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", ring: "ring-indigo-500/20" },
};

const steps = [
  { num: "01", title: "Carica", desc: "Scatta una foto o carica il PDF della tua busta paga.", icon: Upload },
  { num: "02", title: "Analisi AI", desc: "La nostra AI legge ogni voce e la confronta con il tuo CCNL.", icon: Brain },
  { num: "03", title: "Referto", desc: "Ricevi un report chiaro con semaforo: verde, giallo o rosso.", icon: CheckCircle },
];

const stats = [
  { value: "10.000+", label: "buste paga analizzate" },
  { value: "97%", label: "anomalie rilevate" },
  { value: "100+", label: "CCNL supportati" },
  { value: "30s", label: "tempo medio di analisi" },
];

const faqs = [
  {
    q: "Quanto costa usare LavoroChiaro?",
    a: "La prima analisi \u00e8 completa e gratuita: vedi score, importi, anomalie e raccomandazioni. Dalla seconda analisi servono i piani a pagamento. Pay-Per-Error costa 3,99\u00a0\u20ac a singola analisi. L\u2019abbonamento parte da 0,99\u00a0\u20ac/mese. Il piano Pro + Chatbot costa 9,99\u00a0\u20ac/mese.",
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
    q: "Cosa succede dopo la prima analisi gratuita?",
    a: "La prima analisi \u00e8 completa e gratuita: vedi score, importi, anomalie e raccomandazioni. Dalla seconda analisi in poi vedi i titoli e gli importi delle anomalie, ma le spiegazioni dettagliate e le raccomandazioni sono bloccate. Per sbloccarle puoi usare Pay-Per-Error (3,99\u00a0\u20ac) o abbonarti.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    period: "",
    desc: "Prima analisi completa e gratuita, poi paywall",
    features: [
      "1 analisi / mese",
      "Titoli anomalie visibili",
      "Dettagli bloccati",
      "Nessuna registrazione",
    ],
    highlight: false,
    badge: null as string | null,
    cta: "Analisi completa gratis",
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
        <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-36 md:pb-32">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.2),transparent_50%)]" />

          <div className="relative container mx-auto flex flex-col items-center text-center gap-8">
            {/* FREE badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30 border-2 border-emerald-300/40 animate-pulse">
              &#10024; ANALISI BUSTA PAGA SEMPRE GRATUITA &#10024;
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full border border-white/20">
              <Brain className="h-4 w-4" />
              Alimentato da intelligenza artificiale
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white max-w-4xl">
              Il tuo consulente del lavoro{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                digitale
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Carica la tua busta paga e scopri in 30 secondi se &egrave; tutto regolare. Nessun costo, nessuna registrazione.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link
                href="#analizza"
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg px-10 py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] border-2 border-emerald-300/30"
              >
                Analizza GRATIS la tua busta paga
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/servizi"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-base px-8 py-4 rounded-xl transition-all border border-white/20"
              >
                Scopri i servizi
              </Link>
            </div>

            <p className="text-xs text-white/50 mt-2">
              Sempre gratuita &middot; Conforme GDPR &middot; 30 secondi
            </p>
          </div>
        </section>

        {/* ── SERVICES GRID ── */}
        <section id="servizi" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Piattaforma completa
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                I nostri servizi
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Otto servizi alimentati da intelligenza artificiale per proteggere i tuoi diritti e il tuo portafoglio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {services.map((service) => {
                const Icon = service.icon;
                const colors = colorMap[service.color];
                const trackClick = () => {
                  if (typeof window !== "undefined" && window.umami) {
                    window.umami.track("service-click", { service: service.title });
                  }
                };

                if (service.flagship) {
                  return (
                    <Link
                      key={service.title}
                      href={service.href}
                      onClick={trackClick}
                      className="sm:col-span-2 lg:col-span-2 group"
                    >
                      <div className={`relative h-full rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 transition-all hover:shadow-xl hover:-translate-y-1 ring-1 ${colors.ring}`}>
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Servizio principale
                          </span>
                        </div>
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.bg} ${colors.text} mb-5`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${colors.text} group-hover:gap-2 transition-all`}>
                          Scopri di pi&ugrave;
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={service.title}
                    href={service.href}
                    onClick={trackClick}
                    className="group"
                  >
                    <div className={`h-full rounded-2xl border ${colors.border} bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1`}>
                      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${colors.bg} ${colors.text} mb-4`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.desc}</p>
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${colors.text} group-hover:gap-2 transition-all`}>
                        Scopri di pi&ugrave;
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COME FUNZIONA ── */}
        <section id="come-funziona" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Semplice e veloce
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Come funziona
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.num} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 shadow-lg shadow-blue-500/25">
                      <StepIcon className="h-7 w-7" />
                    </div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                      Passo {step.num}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Connector lines on desktop */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-12">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-blue-300 dark:to-blue-700 rounded-full" />
              <div className="h-[2px] w-32 bg-blue-300 dark:bg-blue-700 rounded-full" />
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="h-[2px] w-32 bg-blue-300 dark:bg-blue-700 rounded-full" />
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-blue-300 dark:to-blue-700 rounded-full" />
            </div>
          </div>
        </section>

        {/* ── TRUST / SOCIAL PROOF ── */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="relative container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Numeri che parlano
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl md:text-5xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── UPLOAD SECTION ── */}
        <section id="analizza" className="py-20 md:py-28 scroll-mt-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Inizia subito
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Prova gratis la tua prima analisi
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                PDF, foto o scansione. L&apos;analisi parte in automatico e il referto arriva in 30 secondi.
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-3">
                Prima analisi completa e gratuita &mdash; senza registrazione
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <UploadZone />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>AES-256 encryption</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Server EU / GDPR</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Eliminazione automatica 30gg</span>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="prezzi" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Prezzi trasparenti
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Scegli come vuoi controllare la tua busta paga
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-blue-500 border-2 bg-card shadow-xl ring-2 ring-blue-500/20 scale-[1.03]"
                      : "border-border bg-card shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                        plan.highlight
                          ? "bg-blue-600 text-white"
                          : plan.badge === "PREMIUM"
                          ? "bg-indigo-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="font-bold text-foreground text-lg mt-1">{plan.name}</h3>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-bold text-foreground">
                      &euro;{plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{plan.desc}</p>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`mt-6 block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/25"
                        : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BLOG ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Risorse gratuite
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Leggi il blog
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Guide pratiche su busta paga, contratti, diritti dei lavoratori e molto altro.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {blogArticles.slice(0, 3).map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                  <article className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(article.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.metaDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                      Leggi l&apos;articolo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold text-sm px-8 py-3 rounded-xl transition-all"
              >
                Tutti gli articoli
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
                Hai domande?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Domande frequenti
              </h2>
            </div>
            <div className="space-y-0">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-border/50 py-5">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {faq.q}
                    <span className="text-blue-600 dark:text-blue-400 ml-4 text-xl group-open:rotate-45 transition-transform">+</span>
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
        <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
              Prova gratis la tua prima analisi
            </h2>
            <p className="text-white/70 max-w-md mx-auto mb-10 leading-relaxed text-lg">
              La tua busta paga potrebbe nascondere errori che ti costano centinaia di euro ogni anno.
            </p>
            <Link
              href="#analizza"
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-12 py-5 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Analizza ora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
