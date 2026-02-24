import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 dark:bg-muted/5 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span className="text-lg font-bold uppercase tracking-wider">
                <span className="text-brand-navy">LAVORO</span>
                <span className="text-brand-gray mx-1 text-base font-normal">IN</span>
                <span className="text-brand-amber">CHIARO</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              LavoroChiaro è il primo servizio italiano di analisi documenti con
              intelligenza artificiale. Controlliamo buste paga, dichiarazioni
              dei redditi, cartelle esattoriali e multe in pochi secondi,
              proteggendo i diritti e il portafoglio dei lavoratori italiani.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mt-3">
              Verifichiamo stipendio, CCNL, trattenute INPS, contributi, TFR,
              ferie, straordinari, IRPEF e molto altro. Il tutto con tecnologia
              OCR e AI avanzata, conforme GDPR, senza registrazione.
            </p>
          </div>

          {/* Servizi */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Servizi
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#analizza"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analisi Busta Paga
                </Link>
              </li>
              <li>
                <Link
                  href="/730"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Verifica 730
                </Link>
              </li>
              <li>
                <Link
                  href="/cartella-esattoriale"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cartella Esattoriale
                </Link>
              </li>
              <li>
                <Link
                  href="/multa"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Verifica Multa
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Informazioni
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#come-funziona"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Come funziona
                </Link>
              </li>
              <li>
                <Link
                  href="#prezzi"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prezzi
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/termini"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@lavorochiaro.it"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contattaci
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LavoroChiaro &mdash; Analisi AI
              dei tuoi documenti di lavoro e fiscali
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/termini"
                className="hover:text-foreground transition-colors"
              >
                Termini
              </Link>
              <a
                href="mailto:info@lavorochiaro.it"
                className="hover:text-foreground transition-colors"
              >
                Contatti
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-4 max-w-2xl mx-auto text-center leading-relaxed">
            LavoroChiaro non sostituisce un consulente del lavoro, un
            commercialista o un avvocato. Le analisi hanno valore puramente
            informativo e non costituiscono parere professionale. In caso di
            anomalie rilevanti o contenziosi, rivolgiti sempre a un
            professionista abilitato. I dati caricati sono crittografati e
            trattati nel rispetto del GDPR.
          </p>
        </div>
      </div>
    </footer>
  );
}
