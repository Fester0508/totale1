import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const services = [
  {
    emoji: "\uD83D\uDCB0",
    title: "Busta Paga",
    description:
      "Verifica stipendio base, scatti di anzianità, contributi INPS/INAIL, trattenute IRPEF, TFR, ferie e permessi. Confronto automatico con il tuo CCNL e benchmark retributivo con lo stesso ruolo in 5 paesi europei.",
    stat: "Il 67% dei cedolini ha almeno un errore",
    href: "/#analizza",
    highlight: true,
  },
  {
    emoji: "\uD83D\uDCC4",
    title: "730 / Dichiarazione Redditi",
    description:
      "Verifica il calcolo IRPEF, individua detrazioni dimenticate (spese mediche, mutuo, figli a carico) e scopri se puoi risparmiare sulle tasse. L'AI confronta il tuo 730 con le ultime agevolazioni fiscali.",
    stat: "In media €340 di detrazioni non richieste",
    href: "/730",
    highlight: false,
  },
  {
    emoji: "\u2696\uFE0F",
    title: "Cartella Esattoriale",
    description:
      "Controlla importi, sanzioni, interessi di mora e verifica eventuali prescrizioni o decadenze. L'AI analizza la legittimità della cartella e ti segnala se puoi presentare ricorso o chiedere una rateizzazione.",
    stat: "1 cartella su 3 contiene errori di calcolo",
    href: "/cartella-esattoriale",
    highlight: false,
  },
  {
    emoji: "\uD83D\uDE97",
    title: "Multa / Contravvenzione",
    description:
      "Verifica importo, data di notifica, termini di prescrizione e scopri se hai motivi validi per contestare. L'AI controlla la conformità con il Codice della Strada e ti indica le opzioni disponibili.",
    stat: "Il 25% delle multe è contestabile",
    href: "/multa",
    highlight: false,
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 dark:bg-muted/5">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-widest text-brand-amber uppercase mb-3">
              4 servizi, un&apos;unica app
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
              Tutto quello che i documenti non ti spiegano
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Busta paga, 730, cartelle esattoriali e multe: documenti che
              riguardano i tuoi soldi ma scritti in un linguaggio
              incomprensibile. LavoroChiaro li traduce per te in pochi secondi,
              con un&apos;analisi AI chiara e completa.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto mt-14">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <Link href={service.href} className="block group h-full">
                <div
                  className={`bg-white dark:bg-card rounded-2xl border p-7 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    service.highlight
                      ? "border-brand-amber/40 shadow-md shadow-brand-amber/5"
                      : "border-border/50 hover:border-brand-navy/20"
                  }`}
                >
                  <span className="text-3xl mb-4 block transition-transform duration-300 group-hover:scale-125 inline-block">{service.emoji}</span>
                  <h3 className="font-bold text-lg text-brand-navy mb-2">
                    {service.title}
                    {service.highlight && (
                      <span className="ml-2 text-xs font-semibold text-brand-amber bg-brand-amber-light dark:bg-brand-amber-light/20 px-2 py-0.5 rounded-full">
                        Più usato
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <p className="text-xs font-medium text-brand-navy/70 dark:text-brand-amber/70 mb-4 transition-colors duration-300 group-hover:text-brand-amber">
                    {service.stat}
                  </p>
                  <span className="text-sm font-semibold text-brand-navy flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    Analisi ora
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
