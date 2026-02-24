import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Termini di Servizio - LavoroChiaro",
  description:
    "Termini e condizioni di utilizzo del servizio LavoroChiaro per l'analisi AI di documenti di lavoro e fiscali.",
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-brand-navy" />
            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">
              Termini di Servizio
            </h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Ultimo aggiornamento: Febbraio 2026
          </p>

          <div className="space-y-8">
            {/* 1. Accettazione */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Accettazione dei termini
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilizzando il servizio LavoroChiaro, l&apos;utente accetta
                integralmente i presenti Termini di Servizio. Se non sei
                d&apos;accordo con uno qualsiasi dei termini, ti invitiamo a non
                utilizzare il servizio.
              </p>
            </section>

            <Separator />

            {/* 2. Descrizione del servizio */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Descrizione del servizio
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                LavoroChiaro è un servizio di analisi automatizzata di documenti
                di lavoro e fiscali (buste paga, dichiarazioni 730, cartelle
                esattoriali, multe) basato su intelligenza artificiale.
                Il servizio estrae i dati dal documento caricato tramite OCR e li
                analizza per individuare potenziali anomalie, errori o
                difformità rispetto alla normativa vigente.
              </p>
            </section>

            <Separator />

            {/* 3. Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Disclaimer professionale
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                LavoroChiaro non sostituisce un consulente del lavoro, un
                commercialista o un avvocato. Le analisi generate hanno valore
                puramente informativo e non costituiscono parere professionale.
                In caso di anomalie rilevanti, contenziosi o decisioni
                importanti, rivolgiti sempre a un professionista abilitato.
              </p>
            </section>

            <Separator />

            {/* 4. Obblighi dell'utente */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Obblighi dell&apos;utente
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                L&apos;utente si impegna a:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Caricare esclusivamente documenti di propria pertinenza o per
                    i quali ha ottenuto il consenso del titolare
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non utilizzare il servizio per scopi illeciti, fraudolenti o
                    contrari alla legge
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non tentare di compromettere la sicurezza, l&apos;integrità o
                    la disponibilità del servizio
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non utilizzare sistemi automatizzati per accedere al servizio
                    in modo massivo
                  </span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* 5. Limitazione di responsabilità */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Limitazione di responsabilità
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                LavoroChiaro è fornito &quot;così com&apos;è&quot; (as-is) senza
                garanzie di alcun tipo, espresse o implicite. In particolare:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non garantiamo la completezza, l&apos;accuratezza o
                    l&apos;aggiornamento delle analisi generate dall&apos;AI
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non siamo responsabili per decisioni prese sulla base dei
                    risultati dell&apos;analisi
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non siamo responsabili per eventuali danni diretti,
                    indiretti, incidentali o consequenziali derivanti
                    dall&apos;utilizzo del servizio
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Non garantiamo la disponibilità ininterrotta del servizio
                  </span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* 6. Proprietà intellettuale */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Proprietà intellettuale
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Il marchio LavoroChiaro, il design, il codice sorgente e tutti i
                contenuti del sito sono di proprietà esclusiva del titolare.
                I documenti caricati dall&apos;utente rimangono di sua esclusiva
                proprietà. L&apos;utente concede a LavoroChiaro una licenza
                temporanea e limitata al solo fine di erogare il servizio di
                analisi.
              </p>
            </section>

            <Separator />

            {/* 7. Modifiche */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Modifiche ai termini
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ci riserviamo il diritto di modificare i presenti Termini di
                Servizio in qualsiasi momento. Le modifiche saranno pubblicate su
                questa pagina con indicazione della data di ultimo aggiornamento.
                L&apos;utilizzo continuato del servizio dopo la pubblicazione
                delle modifiche costituisce accettazione delle stesse.
              </p>
            </section>

            <Separator />

            {/* 8. Legge applicabile */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Legge applicabile e foro competente
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I presenti Termini di Servizio sono regolati dalla legge
                italiana. Per qualsiasi controversia derivante
                dall&apos;interpretazione o dall&apos;esecuzione dei presenti
                termini, sarà competente in via esclusiva il Foro del luogo di
                residenza del consumatore, ai sensi dell&apos;art. 66-bis del
                Codice del Consumo.
              </p>
            </section>

            <Separator />

            {/* 9. Contatti */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Contatti
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Per domande relative ai presenti termini, contattaci a{" "}
                <a
                  href="mailto:info@lavorochiaro.it"
                  className="text-brand-navy underline"
                >
                  info@lavorochiaro.it
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t flex gap-6">
            <Link
              href="/"
              className="text-sm text-brand-navy hover:underline"
            >
              &larr; Torna alla Home
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-brand-navy hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
