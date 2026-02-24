"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "./animated-section";

const faqs = [
  {
    question: "Quanto costa usare LavoroChiaro?",
    answer:
      "Il piano Free ti permette di analizzare fino a 3 documenti al mese, completamente gratis e senza registrazione. Se hai bisogno di analisi illimitate, consigli personalizzati e report PDF completi, il piano Pro costa solo €4,99 — un pagamento unico, senza abbonamenti né rinnovi automatici. Meno di un caffè al bar per proteggere il tuo stipendio per sempre.",
  },
  {
    question: "I miei dati sono al sicuro?",
    answer:
      "Assolutamente sì. La sicurezza dei tuoi dati è la nostra priorità assoluta. Ogni documento caricato viene crittografato con standard AES-256 (lo stesso usato dalle banche), trasmesso su connessione HTTPS sicura e conservato su server europei conformi GDPR. I file vengono eliminati automaticamente dopo 30 giorni. Non li usiamo per addestrare modelli AI, non li condividiamo con terze parti e non li vendiamo. Mai.",
  },
  {
    question: "Come funziona l'analisi della busta paga?",
    answer:
      "Il processo è completamente automatico e dura circa 30 secondi. Prima, la nostra AI con tecnologia OCR avanzata estrae tutti i dati dal tuo documento — stipendio base, trattenute, contributi INPS/INAIL, TFR, ferie e permessi. Poi confronta ogni voce con le tabelle retributive del tuo CCNL, la normativa vigente e le aliquote fiscali aggiornate. Il risultato è un report dettagliato con un sistema a semafori: verde (tutto ok), giallo (da verificare), rosso (anomalia rilevata). Ogni anomalia include una spiegazione chiara e un consiglio su cosa fare.",
  },
  {
    question: "Funziona con il mio contratto di lavoro?",
    answer:
      "Sì, LavoroChiaro supporta tutti i principali CCNL italiani: Commercio e Terziario, Metalmeccanico e Industria, Pubblico Impiego, Sanità, Edilizia, Turismo e Ristorazione, Trasporti, Telecomunicazioni, Chimico-Farmaceutico e molti altri. La nostra AI viene aggiornata costantemente con le ultime tabelle retributive. Se il tuo specifico CCNL non è ancora completamente supportato, te lo segnaliamo chiaramente nel report.",
  },
  {
    question: "Posso usarlo da smartphone?",
    answer:
      "Certo! LavoroChiaro è progettato mobile-first: basta aprire il sito dal browser del telefono, scattare una foto alla busta paga con la fotocamera e caricarla con un tap. La nostra AI legge anche foto mosse, scansioni inclinate e documenti piegati. Funziona perfettamente su iPhone, Android e qualsiasi tablet.",
  },
  {
    question: "Quali documenti posso analizzare oltre alla busta paga?",
    answer:
      "Oltre alla busta paga (cedolino), puoi analizzare: il modello 730 o la dichiarazione dei redditi per verificare IRPEF, detrazioni dimenticate e possibili risparmi fiscali; le cartelle esattoriali per controllare importi, sanzioni, interessi di mora e verificare eventuali prescrizioni; e le multe o contravvenzioni per verificare importo, notifica, prescrizione e scoprire se puoi contestarle. Ogni tipo di documento ha un'analisi AI specializzata.",
  },
  {
    question: "Cosa faccio se l'analisi trova un errore?",
    answer:
      "Se l'analisi rileva un'anomalia, il report ti spiega in modo chiaro di cosa si tratta, quanto ti costa e cosa puoi fare. Per errori semplici (come uno scatto di anzianità mancante), puoi segnalarlo direttamente al tuo ufficio risorse umane mostrando il report. Per situazioni più complesse, ti consigliamo di rivolgerti a un consulente del lavoro o a un sindacato — il report di LavoroChiaro è un ottimo punto di partenza per la discussione.",
  },
  {
    question: "L'analisi sostituisce un consulente del lavoro?",
    answer:
      "No, LavoroChiaro è uno strumento informativo che ti aiuta a capire la tua busta paga e individuare potenziali anomalie. Non sostituisce il parere di un professionista abilitato. Tuttavia, ti permette di arrivare dal consulente già informato, risparmiando tempo e denaro. Molti utenti scoprono errori che non avrebbero mai notato senza la nostra analisi AI.",
  },
  {
    question: "In quanto tempo ottengo il risultato?",
    answer:
      "L'analisi completa richiede in media 30 secondi. Carichi il documento, la nostra AI lo elabora in tempo reale e ricevi immediatamente il report con tutti i dettagli. Non devi aspettare email, non devi prenotare appuntamenti. Risultato istantaneo, 24 ore su 24, 7 giorni su 7.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-brand-amber uppercase mb-3">
              Domande frequenti
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy">
              Hai dubbi? Rispondiamo noi
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
              Tutto quello che devi sapere su LavoroChiaro, la sicurezza dei
              tuoi dati e come funziona l&apos;analisi AI dei documenti.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-muted/30 dark:bg-muted/10 border border-border/30 rounded-xl px-6 data-[state=open]:shadow-md data-[state=open]:border-brand-navy/20 transition-all duration-300 hover:bg-muted/50 dark:hover:bg-muted/20 hover:border-border/50"
              >
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5 [&[data-state=open]]:text-brand-navy">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}
