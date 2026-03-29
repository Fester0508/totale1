import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/landing/footer";
import { ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy - LavoroInChiaro",
  description:
    "Informativa sulla privacy e sul trattamento dei dati personali di LavoroInChiaro, ai sensi del GDPR (Reg. UE 2016/679).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-8 w-8 text-brand-navy" />
            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy">
              Privacy Policy
            </h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Ultimo aggiornamento: Marzo 2026
          </p>

          <div className="space-y-8">
            {/* 1. Titolare */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Titolare del trattamento
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Il titolare del trattamento dei dati personali è LAERTE LTD, con
                sede operativa in Italia. Email:{" "}
                <a
                  href="mailto:privacy@lavoroinchiaro.it"
                  className="text-brand-navy underline"
                >
                  privacy@lavoroinchiaro.it
                </a>
                .
              </p>
            </section>

            <Separator />

            {/* 2. Dati raccolti */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Dati raccolti
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Raccogliamo esclusivamente i dati necessari per erogare il
                servizio di analisi documenti:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Dati di registrazione</strong> — indirizzo email e
                    password (criptata) per la creazione dell&apos;account.
                    Registriamo inoltre il timestamp dei consensi forniti
                    (privacy, termini, marketing)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Documento caricato</strong> (busta paga, 730,
                    cartella esattoriale, multa) in formato PDF, JPEG, PNG o HEIC
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Dati estratti tramite OCR</strong> dal documento
                    (nomi, importi, date, informazioni contrattuali)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Dati tecnici di navigazione</strong> (indirizzo IP,
                    tipo di browser, pagine visitate) raccolti automaticamente
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Non raccogliamo il nome o altri dati identificativi diretti
                oltre all&apos;email, in conformità al principio di
                minimizzazione dei dati (art. 5, par. 1, lett. c del GDPR).
              </p>
            </section>

            <Separator />

            {/* 3. Finalità */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Finalità del trattamento
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I dati personali sono trattati esclusivamente per le seguenti
                finalità:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mt-3">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Analisi AI del documento caricato per individuare anomalie,
                    errori o problematiche
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Generazione del report di analisi con suggerimenti e
                    riferimenti normativi
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Monitoraggio tecnico e miglioramento del servizio
                  </span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* 4. Base giuridica */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Base giuridica
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Il trattamento dei dati avviene sulla base del{" "}
                <strong>consenso esplicito</strong> dell&apos;utente (art. 6,
                par. 1, lett. a del GDPR), fornito attraverso la finestra di
                consenso visualizzata prima del caricamento del documento.
              </p>
            </section>

            <Separator />

            {/* 5. Modalità di trattamento */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Modalità di trattamento
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    I documenti sono trasmessi tramite connessione crittografata
                    (HTTPS/TLS) e archiviati in storage sicuro (Supabase Storage)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    L&apos;analisi viene effettuata tramite modelli di
                    intelligenza artificiale (OpenAI GPT-4o) via API
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    I dati inviati ai provider AI non vengono utilizzati per
                    l&apos;addestramento dei modelli (opt-out confermato)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Il trattamento avviene con strumenti informatici e
                    telematici, con logiche strettamente correlate alle finalità
                    indicate
                  </span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* 6. Agenti di Intelligenza Artificiale */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Agenti di Intelligenza Artificiale
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilizziamo agenti di intelligenza artificiale per fornire
                servizi di consulenza automatizzata (calcolo NASPI, maternità,
                redazione lettere, ecc.). Questi agenti non conservano
                conversazioni personali oltre la sessione corrente.
              </p>
            </section>

            <Separator />

            {/* 7. Hosting e conservazione dei dati */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Hosting e conservazione dei dati
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                I dati sono conservati su server Microsoft Azure in Europa
                (North Europe), conformi al GDPR.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I documenti caricati e i relativi risultati di analisi vengono{" "}
                <strong>eliminati automaticamente dopo 30 giorni</strong> dalla
                data di caricamento. I dati dell&apos;account (email, consensi)
                sono conservati fino alla cancellazione volontaria da parte
                dell&apos;utente. I dati tecnici di navigazione vengono
                conservati per un massimo di 12 mesi per finalità di sicurezza e
                monitoraggio.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                I documenti caricati vengono eliminati automaticamente dopo 30
                giorni. I dati dell&apos;account vengono eliminati su richiesta
                dell&apos;utente (diritto alla cancellazione art. 17 GDPR).
              </p>
            </section>

            <Separator />

            {/* 8. Condivisione */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Condivisione dei dati
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I dati personali <strong>non vengono ceduti a terzi</strong> per
                finalità di marketing o profilazione. I dati sono condivisi
                esclusivamente con:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mt-3">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>OpenAI</strong> — per il processamento AI
                    (elaborazione OCR e analisi), in qualità di responsabile del
                    trattamento
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Supabase</strong> — per lo storage sicuro dei
                    documenti e dei dati di analisi
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Microsoft Azure</strong> — per l&apos;hosting dei
                    servizi AI e dell&apos;infrastruttura applicativa
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Vercel</strong> — per l&apos;hosting
                    dell&apos;applicazione web
                  </span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* 9. Diritti */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Diritti dell&apos;interessato
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Ai sensi degli artt. 15-22 del GDPR, hai diritto di:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Accedere ai tuoi dati personali</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Richiedere la rettifica dei dati inesatti</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    Richiedere la cancellazione dei dati (diritto
                    all&apos;oblio)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Richiedere la limitazione del trattamento</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Richiedere la portabilità dei dati</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Opporsi al trattamento</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>Revocare il consenso in qualsiasi momento</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Se hai un account, puoi esercitare i diritti di accesso,
                portabilità ed eliminazione direttamente dalla pagina{" "}
                <Link
                  href="/impostazioni"
                  className="text-brand-navy underline"
                >
                  Impostazioni
                </Link>
                . Per altre richieste, scrivi a{" "}
                <a
                  href="mailto:privacy@lavoroinchiaro.it"
                  className="text-brand-navy underline"
                >
                  privacy@lavoroinchiaro.it
                </a>
                . Hai inoltre il diritto di presentare reclamo al{" "}
                <strong>Garante per la protezione dei dati personali</strong>{" "}
                (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-navy underline"
                >
                  www.garanteprivacy.it
                </a>
                ).
              </p>
            </section>

            <Separator />

            {/* 10. Cookie */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Cookie
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Questo sito utilizza esclusivamente{" "}
                <strong>cookie tecnici strettamente necessari</strong> al
                funzionamento del servizio:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mt-3">
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Preferenza tema</strong> (chiaro/scuro) — salvata
                    localmente nel browser
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Sessione utente</strong> — cookie httpOnly gestiti
                    da Supabase Auth per mantenere l&apos;autenticazione
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-navy font-bold">&bull;</span>
                  <span>
                    <strong>Sessione admin</strong> — cookie httpOnly per
                    l&apos;autenticazione del pannello di amministrazione
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Non utilizziamo cookie di profilazione, analytics di terze parti
                o strumenti di tracciamento pubblicitario.
              </p>
            </section>

            <Separator />

            {/* 11. Modifiche */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11. Modifiche alla Privacy Policy
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ci riserviamo il diritto di modificare questa informativa in
                qualsiasi momento. Le modifiche saranno pubblicate su questa
                pagina con indicazione della data di ultimo aggiornamento.
                L&apos;utilizzo continuato del servizio dopo la pubblicazione
                delle modifiche costituisce accettazione delle stesse.
              </p>
            </section>

            <Separator />

            {/* 12. Contatti */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                12. Contatti
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Per qualsiasi domanda relativa alla presente informativa o al
                trattamento dei tuoi dati personali, contattaci a{" "}
                <a
                  href="mailto:privacy@lavoroinchiaro.it"
                  className="text-brand-navy underline"
                >
                  privacy@lavoroinchiaro.it
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link
              href="/"
              className="text-sm text-brand-navy hover:underline"
            >
              &larr; Torna alla Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
