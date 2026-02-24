"use client";

import {
  Banknote,
  FileText,
  CalendarDays,
  Clock,
  PiggyBank,
  Scale,
} from "lucide-react";
import { AnimatedSection } from "./animated-section";

const articles = [
  {
    icon: Banknote,
    title: "Errori in busta paga: quanto costano davvero?",
    content:
      "Secondo le stime, il 67% dei lavoratori italiani non ha mai controllato il proprio cedolino. Eppure, gli errori più comuni — scatti di anzianità dimenticati, straordinari calcolati male, trattenute INPS errate — possono costare in media €1.200 all'anno. Moltiplicato per una carriera di 30 anni, parliamo di decine di migliaia di euro persi senza saperlo. Il problema non è la malafede del datore di lavoro, ma la complessità del sistema retributivo italiano. Con oltre 900 CCNL attivi e aggiornamenti normativi continui, anche un piccolo errore di calcolo può passare inosservato per anni.",
  },
  {
    icon: FileText,
    title: "Cos'è il CCNL e perché è fondamentale",
    content:
      "Il Contratto Collettivo Nazionale di Lavoro (CCNL) è l'accordo che stabilisce stipendio minimo, scatti di anzianità, ferie, permessi, straordinari e indennità per il tuo settore. In Italia esistono oltre 900 CCNL diversi — dal Commercio e Terziario al Metalmeccanico, dalla Sanità all'Edilizia. Ogni contratto ha le sue tabelle retributive, aggiornate periodicamente. Se il tuo datore di lavoro applica il CCNL sbagliato, o non aggiorna le tabelle dopo un rinnovo contrattuale, il tuo stipendio potrebbe essere inferiore a quanto ti spetta. LavoroChiaro confronta automaticamente la tua busta paga con le tabelle CCNL corrette e aggiornate.",
  },
  {
    icon: CalendarDays,
    title: "Ferie non godute: quanto ti devono davvero?",
    content:
      "Per legge, ogni lavoratore ha diritto ad almeno 4 settimane di ferie retribuite all'anno (D.Lgs. 66/2003). Le ferie maturate e non godute non possono essere monetizzate durante il rapporto di lavoro, ma devono risultare correttamente in busta paga. Errori comuni includono: maturazione inferiore al dovuto, calcolo errato dei giorni residui e mancato riporto delle ferie dell'anno precedente. Alla cessazione del rapporto, le ferie non godute devono essere liquidate nell'ultima busta paga. Controllare regolarmente il saldo ferie è essenziale per proteggere un tuo diritto fondamentale.",
  },
  {
    icon: Clock,
    title: "Straordinari: come verificare il calcolo",
    content:
      "Gli straordinari sono tra le voci più soggette a errori in busta paga. La maggiorazione varia in base al CCNL applicato e al tipo di straordinario: feriale (di solito +15/25%), notturno (+30/50%), festivo (+30/50%), notturno festivo (+50/75%). Molti lavoratori non sanno che il calcolo della base oraria deve includere tutti gli elementi retributivi fissi e continuativi — non solo lo stipendio base. Se il tuo datore di lavoro calcola gli straordinari solo sullo stipendio tabellare, senza includere superminimi o indennità fisse, stai perdendo denaro ogni mese. LavoroChiaro verifica il calcolo completo.",
  },
  {
    icon: PiggyBank,
    title: "TFR: il salvadanaio nascosto in busta paga",
    content:
      "Il Trattamento di Fine Rapporto (TFR) è una quota della retribuzione accantonata ogni mese dal datore di lavoro, pari a circa il 6,91% della retribuzione annua lorda. Alla fine del rapporto di lavoro, il TFR ti viene liquidato in un'unica soluzione (o tramite fondo pensione se hai scelto la previdenza complementare). Gli errori più frequenti riguardano la base di calcolo: il TFR deve essere calcolato su tutti gli elementi retributivi, inclusi superminimi, indennità e premi fissi. Controllare mensilmente che l'accantonamento sia corretto è fondamentale, perché gli errori si accumulano nel tempo.",
  },
  {
    icon: Scale,
    title: "Contributi INPS: cosa controllare ogni mese",
    content:
      "I contributi previdenziali INPS sono la garanzia della tua futura pensione. L'aliquota contributiva standard è del 33% della retribuzione imponibile (di cui circa il 9,19% a carico del lavoratore e il resto a carico del datore di lavoro). Errori nei contributi sono particolarmente gravi perché impattano direttamente sul calcolo della pensione futura. Le anomalie più comuni includono: imponibile contributivo inferiore al reale, mancata applicazione di contributi aggiuntivi previsti dal CCNL e errori nell'aliquota applicata. LavoroChiaro verifica che i contributi siano calcolati correttamente e confronta l'imponibile con la retribuzione lorda.",
  },
];

export function EducationalSection() {
  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-brand-amber uppercase mb-3">
              Guida per i lavoratori
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
              Lo sapevi che...?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Tutto quello che dovresti sapere sulla tua busta paga ma che
              nessuno ti ha mai spiegato. Informazioni utili per proteggere il
              tuo stipendio.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {articles.map((article, i) => (
            <AnimatedSection key={article.title} delay={i * 0.1}>
              <article className="group bg-background rounded-2xl border border-border/30 p-7 h-full transition-all duration-300 hover:shadow-lg hover:border-brand-navy/15 hover:-translate-y-1 cursor-default">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-amber/10">
                    <article.icon className="h-5 w-5 text-brand-navy transition-colors duration-300 group-hover:text-brand-amber" />
                  </div>
                  <h3 className="font-bold text-base text-brand-navy leading-tight">
                    {article.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.content}
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
