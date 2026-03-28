import Link from "next/link";
import { Header } from "@/components/header";
import {
  FileSearch,
  Calculator,
  Heart,
  Shield,
  Home as HomeIcon,
  Users,
  ArrowRight,
  CheckCircle,
  Mail,
  TrendingUp,
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
      name: "LavoroInChiaro",
      url: "https://lavoroinchiaro.it",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        name: "Controllo Busta Paga Gratuito",
        price: "0",
        priceCurrency: "EUR",
        description:
          "Analisi busta paga gratuita per sempre, senza registrazione.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="scroll-smooth">
        {/* ═══════════════════════════════════════════════
            BLOCK 1 — Hero: Controllo Busta Paga GRATUITO
        ═══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.4),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.25),transparent_60%)]" />

          <div className="relative w-full px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
              {/* FREE badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30 border-2 border-emerald-300/40">
                SEMPRE GRATUITO
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
                Controlla la tua busta paga.{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Gratis, per sempre.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                Carica la tua busta paga e scopri in 30 secondi se è tutto
                regolare. Nessun costo, nessuna registrazione.
              </p>

              <Link
                href="#analizza"
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg px-12 py-5 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                Analizza ora — È gratis
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>

              <p className="text-sm text-white/50">
                Conforme GDPR · 30 secondi · Nessuna registrazione
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 2 — Errori nella busta paga? Consulenza
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-white dark:bg-background py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-blue-50 dark:bg-blue-950/30">
              <Users className="w-16 h-16 md:w-20 md:h-20 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Hai trovato errori? Parla con un nostro consulente.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                Il controllo è gratuito. Se emergono anomalie, prenota un
                incontro con un consulente del lavoro della nostra rete per
                capire come recuperare il dovuto.
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8">
                A partire da €9,90
              </p>
              <Link
                href="/servizi/professionisti"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Prenota una consulenza
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 3 — 730 Fiscalisti
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-gray-50 dark:bg-muted/10 py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30">
              <Calculator className="w-16 h-16 md:w-20 md:h-20 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Dichiarazione 730? Ci pensano i nostri fiscalisti.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                Collegati con commercialisti e consulenti del lavoro certificati.
                Consulenza personalizzata a partire da €9,90.
              </p>
              <Link
                href="/servizi/professionisti"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Trova il tuo fiscalista
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 4 — Errori retribuzione (5 anni)
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="relative max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/20 backdrop-blur-sm">
              <TrendingUp className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Retribuzione sbagliata? Puoi recuperare fino a 5 anni di
                differenze.
              </h2>
              <p className="text-lg text-white/85 leading-relaxed mb-6 max-w-2xl">
                Con LavoroInChiaro analizziamo le tue buste paga degli ultimi 5
                anni. Se ci sono differenze retributive, ti aiutiamo a
                recuperarle.
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 mb-8">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  In media i lavoratori recuperano{" "}
                  <span className="text-yellow-200">€2.400</span>
                </p>
              </div>
              <div className="block">
                <Link
                  href="/servizi/redazione-lettere"
                  className="inline-flex items-center justify-center bg-white text-amber-700 font-bold text-base px-8 py-4 rounded-xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Verifica ora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 5 — Calcolo NASPI
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-white dark:bg-background py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-amber-50 dark:bg-amber-950/30">
              <Calculator className="w-16 h-16 md:w-20 md:h-20 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Licenziato? Calcola subito la tua NASPI.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                Scopri quanto ti spetta di indennità di disoccupazione e per
                quanto tempo. Simulazione gratuita basata sulla normativa
                vigente.
              </p>
              <Link
                href="/servizi/calcolo-naspi"
                className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Calcola la tua NASPI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 6 — Maternità
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 dark:from-pink-950/30 dark:via-rose-950/20 dark:to-pink-950/30" />

          <div className="relative max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-pink-200/60 dark:bg-pink-900/30">
              <Heart className="w-16 h-16 md:w-20 md:h-20 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                In maternità? Conosci i tuoi diritti.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                Congedo, indennità INPS, permessi allattamento. Il nostro agente
                AI ti guida passo passo.
              </p>
              <Link
                href="/servizi/maternita"
                className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Scopri i tuoi diritti
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 7 — Controllo Multe
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-gray-50 dark:bg-muted/10 py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-red-50 dark:bg-red-950/30">
              <Shield className="w-16 h-16 md:w-20 md:h-20 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Multa ingiusta? Verifica la regolarità.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                Analisi automatica della tua multa: termini di notifica, vizi di
                forma, prescrizione. Scopri se puoi fare ricorso.
              </p>
              <Link
                href="/servizi/controllo-multe"
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Controlla la tua multa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 8 — Colf e Badanti (Coming Soon)
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-white dark:bg-background py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-purple-50/60 dark:bg-purple-950/20 opacity-70">
              <HomeIcon className="w-16 h-16 md:w-20 md:h-20 text-purple-400 dark:text-purple-600" />
            </div>
            <div className="flex-1 text-center md:text-left opacity-80">
              <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full mb-6">
                PRESTO DISPONIBILE
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground/70 leading-tight mb-6">
                Contratti Colf e Badanti
              </h2>
              <p className="text-lg text-muted-foreground/70 leading-relaxed mb-8 max-w-2xl">
                Assistenza completa per contratti di lavoro domestico:
                assunzione, retribuzione, contributi INPS, TFR. In arrivo.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="La tua email"
                  className="w-full sm:flex-1 px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Mail className="h-4 w-4" />
                  Avvisami
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 9 — Associati a LavoroInChiaro
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_60%)]" />

          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Ti sei trovato bene?{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Associati.
                </span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-4">
                Alla quota simbolica di €0,99 predisponiamo in automatico la
                revoca alle trattenute in busta che potresti avere. Proteggi il
                tuo stipendio ogni mese.
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white mt-8 mb-10">
                Solo{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  €0,99
                </span>
                /mese
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-12">
              {[
                "Revoca automatica trattenute non dovute",
                "Monitoraggio continuo della busta paga",
                "Accesso prioritario ai consulenti",
                "Report mensile anomalie",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white text-sm font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/registrati"
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold text-lg px-12 py-5 rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                Associati ora — €0,99/mese
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCK 10 — Footer
        ═══════════════════════════════════════════════ */}
        <footer className="w-full bg-gray-900 dark:bg-gray-950 text-gray-300 py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
              {/* Brand */}
              <div className="sm:col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-1 mb-4">
                  <span className="text-lg font-bold uppercase tracking-wider text-white">
                    LAVORO
                    <span className="text-gray-500 mx-1 text-base font-normal">
                      IN
                    </span>
                    <span className="text-amber-400">CHIARO</span>
                  </span>
                </Link>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Il primo servizio italiano di analisi buste paga con
                  intelligenza artificiale.
                </p>
              </div>

              {/* Servizi */}
              <div>
                <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                  Servizi
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { href: "#analizza", label: "Analisi Busta Paga" },
                    {
                      href: "/servizi/professionisti",
                      label: "Rete Professionisti",
                    },
                    { href: "/servizi/calcolo-naspi", label: "Calcolo NASPI" },
                    { href: "/servizi/maternita", label: "Maternità" },
                    {
                      href: "/servizi/controllo-multe",
                      label: "Controllo Multe",
                    },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                  Informazioni
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { href: "/blog", label: "Blog" },
                    { href: "/privacy", label: "Privacy" },
                    { href: "/termini", label: "Termini" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contatti */}
              <div>
                <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                  Contatti
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <a
                      href="mailto:info@lavoroinchiaro.it"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      info@lavoroinchiaro.it
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-sm text-gray-500 text-center">
                © 2026 LavoroInChiaro.it — Tutti i diritti riservati
              </p>
              <p className="text-xs text-gray-600 mt-4 max-w-2xl mx-auto text-center leading-relaxed">
                LavoroInChiaro non sostituisce un consulente del lavoro, un
                commercialista o un avvocato. Le analisi hanno valore puramente
                informativo e non costituiscono parere professionale.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
