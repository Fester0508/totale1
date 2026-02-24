# LavoroChiaro

**Analisi intelligente di buste paga italiane, alimentata da AI e dati contrattuali reali.**

LavoroChiaro e' una web app che permette ai lavoratori italiani di caricare la propria busta paga e ottenere in pochi secondi un'analisi dettagliata con un sistema a **semaforo** (verde/giallo/rosso) che evidenzia anomalie, errori di calcolo e possibili violazioni contrattuali.

> **Perche' esiste**: In Italia, il 30% delle buste paga contiene errori. Molti lavoratori non hanno le competenze tecniche per verificare se lo stipendio ricevuto corrisponde a quanto previsto dal proprio CCNL. LavoroChiaro rende questa verifica accessibile a tutti.

---

## Come Funziona

Il cuore di LavoroChiaro e' una **pipeline AI a due fasi** che combina visione artificiale e analisi normativa:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
│   Upload     │────>│  GPT-4o      │────>│  GPT-4o              │────>│  Report      │
│  PDF/JPG/PNG │     │  Vision OCR  │     │  Analisi + Dati CCNL │     │  + Semaforo  │
└──────────────┘     └──────────────┘     └──────────────────────┘     └──────────────┘
```

### Fase 1: Estrazione dati (OCR)

Il documento caricato viene inviato a **GPT-4o Vision** che estrae in modo strutturato:

- **Dati anagrafici**: nome, azienda, CCNL applicato, livello di inquadramento, mese/anno
- **Competenze**: ogni singola voce retributiva con importo (paga base, superminimo, scatti, straordinari, indennita', ecc.)
- **Trattenute**: INPS, IRPEF, addizionali regionali/comunali, altre trattenute
- **Totali**: lordo, netto, trattenute totali, TFR accantonato
- **Ferie e permessi**: residui maturati

L'output e' validato con uno **schema Zod** per garantire la struttura corretta dei dati.

### Fase 2: Analisi normativa

I dati estratti vengono passati a **GPT-4o** insieme a un **contesto di riferimento** costruito dinamicamente che include:

- I **minimi tabellari** del CCNL rilevato dalla busta paga
- Le **aliquote IRPEF** dell'anno di riferimento
- Le **aliquote contributive INPS**
- Le regole per il calcolo del **TFR**
- Le **maggiorazioni per straordinario** previste dal CCNL

L'AI agisce come un consulente del lavoro esperto che verifica ogni voce della busta paga e per ciascuna assegna:

| Semaforo | Significato |
|----------|------------|
| **Verde** | Voce corretta secondo la normativa e il CCNL |
| **Giallo** | Possibile anomalia, servono piu' informazioni per confermare |
| **Rosso** | Errore chiaro o importo non conforme alla normativa |

---

## Dati di Riferimento: Fonti e Metodologia

Questo e' l'aspetto piu' critico del progetto. L'AI da sola non puo' verificare importi specifici perche' i suoi dati di addestramento sono generici e potenzialmente obsoleti. Per questo LavoroChiaro mantiene un **database strutturato di dati contrattuali e normativi** che viene iniettato nel prompt dell'AI.

### Dove sono i dati

Tutti i dati di riferimento sono in [`src/lib/dati-riferimento.ts`](src/lib/dati-riferimento.ts) — un singolo file TypeScript con tipi forti che contiene:

#### CCNL supportati (8 contratti)

| CCNL | Parti firmatarie | Ultimo rinnovo | Fonte primaria |
|------|-----------------|----------------|----------------|
| **Commercio — Terziario** | Confcommercio / Filcams, Fisascat, Uiltucs | 22 mar 2024 | [CNEL Archivio Contratti](https://www.cnel.it/Archivio-Contratti) |
| **Metalmeccanica Industria** | Federmeccanica, Assistal / Fim, Fiom, Uilm | 22 nov 2025 | [Federmeccanica](https://www.federmeccanica.it/) |
| **Turismo — Alberghi** | Federalberghi, Confcommercio / Filcams, Fisascat, Uiltucs | 5 lug 2024 | [Federalberghi](https://www.federalberghi.it/) |
| **Pubblici Esercizi (FIPE)** | FIPE-Confcommercio / Filcams, Fisascat, Uiltucs | 5 giu 2024 | [FIPE](https://www.fipe.it/) |
| **Edilizia Industria (ANCE)** | ANCE / Fillea, Filca, Feneal | 29 gen 2025 | [ANCE](https://www.ance.it/) |
| **Studi Professionali** | Confprofessioni / Filcams, Fisascat, Uiltucs | 16 feb 2024 | [Confprofessioni](https://www.confprofessioni.eu/) |
| **Logistica, Trasporto Merci** | Assologistica, Fedespedi, Confetra e altri / Filt, Fit, Uiltrasporti | 6 dic 2024 | [CNEL](https://www.cnel.it/) |
| **Cooperative Sociali** | AGCI, Confcooperative, Legacoopsociali / FP-CGIL, CISL-FP, UIL-FPL | feb 2024 | [Legacoopsociali](https://www.legacoopsociali.it/) |

Per ogni CCNL il database contiene:
- **Minimi tabellari lordi mensili** per ogni livello di inquadramento
- **Scatti di anzianita'** (importo, periodicita', numero massimo)
- **Maggiorazioni per straordinario** (feriale, festivo, notturno) con percentuali
- **Ore settimanali** e **mensilita'** previste
- **Note** su tranche future, welfare, particolarita'

#### Dati fiscali e previdenziali

| Dato | Fonte | Aggiornamento |
|------|-------|---------------|
| **Scaglioni IRPEF 2025-2026** | [Agenzia delle Entrate](https://www.agenziaentrate.gov.it/) | 23% fino a 28.000€, 33% fino a 50.000€ (2026), 43% oltre |
| **Contributi INPS** | [INPS](https://www.inps.it/) | Lavoratore privato: 9,19% · Pubblico: 8,80% · Apprendisti: 5,84% |
| **TFR** | [Codice Civile art. 2120](https://www.gazzettaufficiale.it/) | Retribuzione/13,5 (≈ 6,91% netto) + rivalutazione ISTAT |
| **Addizionali regionali** | [MEF](https://www.finanze.gov.it/) | Da 1,23% a 3,33% a seconda della regione |
| **Addizionali comunali** | [MEF](https://www.finanze.gov.it/) | Da 0% a 0,8% (Roma: 0,9%) |
| **No tax area** | Agenzia delle Entrate | 8.500€ per lavoratori dipendenti |

### Come viene usato il contesto

1. L'OCR estrae il nome del CCNL dalla busta paga (es. "Commercio — Terziario")
2. La funzione `trovaCCNL()` cerca un match nel database usando **alias fuzzy** (es. "commercio", "terziario", "confcommercio" portano tutti allo stesso contratto)
3. `generaContestoRiferimento()` costruisce un blocco di testo con i minimi tabellari, le aliquote e i dati rilevanti per quell'anno specifico
4. Questo contesto viene **iniettato nel system prompt** dell'AI, che lo usa come fonte primaria (piu' affidabile della sua conoscenza generica)

Se il CCNL non e' nel database, l'AI segnala esplicitamente che i valori non sono stati verificati e assegna **semaforo giallo** alle voci retributive.

### Aggiornamento dei dati

I dati vengono aggiornati **manualmente** ad ogni rinnovo contrattuale. L'ultimo aggiornamento e' di **febbraio 2026**.

Il campo `minimi_aggiornati_a` in ogni CCNL indica esattamente a quale tranche si riferiscono i minimi (es. "novembre 2025 (4ª tranche)" per il Commercio).

---

## Funzionalita'

- **Analisi busta paga** — Verifica voci retributive, trattenute, TFR e conformita' al CCNL
- **Sistema a semaforo** — Ogni voce analizzata riceve un giudizio: verde (OK), giallo (attenzione), rosso (anomalia)
- **Confronto retribuzioni EU** — Benchmark del salario rispetto a Germania, Francia, Spagna e Olanda
- **1 analisi gratuita** — Prima analisi senza registrazione, poi e' richiesto un account
- **Dashboard utente** — Storico delle analisi effettuate
- **Demo mode** — Funziona senza backend configurato, con dati di esempio
- **Pannello admin** — Dashboard con statistiche, lista analisi, monitoraggio costi AI
- **Privacy by design** — I documenti scadono dopo 30 giorni, consenso GDPR esplicito

---

## Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19, React Compiler) |
| Linguaggio | TypeScript (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| AI (OCR + Analisi) | GPT-4o / GPT-4o Vision via [Vercel AI SDK v6](https://sdk.vercel.ai/) |
| Validazione | [Zod v4](https://zod.dev/) (schema validation per output AI) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| Storage | Supabase Storage (bucket privato `documenti`) |
| Auth utenti | Supabase Auth (email/password) |
| Auth admin | JWT custom con [jose](https://github.com/panva/jose) |
| Animazioni | [Framer Motion](https://www.framer.com/motion/) |
| Image processing | [sharp](https://sharp.pixelplumbing.com/) + [heic-convert](https://github.com/nicolo-ribaudo/heic-convert) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Architettura

### Pipeline di elaborazione

```
Utente                   Server (API Routes)                    Servizi Esterni
──────                   ───────────────────                    ────────────────
  │                              │                                     │
  ├── POST /api/upload ─────────>│                                     │
  │   (file + sessionId)         ├── validateFile()                    │
  │                              ├── convertHeicToJpeg() (se HEIC)     │
  │                              ├── optimizeImage() (sharp, max 2048px)│
  │                              ├── Upload a Supabase Storage ────────>│
  │                              ├── INSERT analisi (stato=processing) >│
  │<── { id: analisiId } ────────┤                                     │
  │                              │                                     │
  ├── POST /api/analizza ───────>│                                     │
  │   (id, documentType)         ├── Download file da Storage ─────────>│
  │                              ├── estraiDatiDocumento() ────────────>│ GPT-4o Vision
  │                              │<── dati strutturati (Zod validated) ─┤
  │                              ├── trovaCCNL() + generaContesto()    │
  │                              ├── analizzaBustaPaga() ──────────────>│ GPT-4o
  │                              │<── risultato analisi (Zod validated) ┤
  │                              ├── UPDATE analisi (stato=completed) ─>│
  │                              ├── INSERT ai_usage (token + costi) ──>│
  │<── { risultato } ────────────┤                                     │
```

### Autenticazione (due livelli)

1. **Utenti** — Supabase Auth con email/password. Le API di upload e analisi supportano sia utenti autenticati che anonimi (free tier)
2. **Admin** — Password in variabile d'ambiente + JWT cookie (`jose`). Protetto da middleware su `/admin/*` e `/api/admin/*`

### Free Tier (utenti anonimi)

Gli utenti possono effettuare **1 analisi gratuita** senza registrarsi. Il tracking avviene tramite un **cookie JWT firmato** (`lc_free_tier`) che contiene il conteggio degli utilizzi e gli ID delle analisi create. Il cookie e' `httpOnly`, `secure` in produzione, e dura 30 giorni.

### Database

PostgreSQL su Supabase con due tabelle principali:

- **`analisi`** — Documento caricato, dati estratti, risultato analisi, semaforo, stato
- **`ai_usage`** — Log di ogni chiamata AI con token consumati, costo USD, durata

Row Level Security (RLS) attiva: gli utenti vedono solo le proprie analisi, il service role gestisce gli aggiornamenti.

---

## Struttura del Progetto

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/                      # Pagina login
│   ├── registrati/                 # Pagina registrazione
│   ├── dashboard/                  # Dashboard utente (storico analisi)
│   ├── analisi/[id]/               # Pagina risultati analisi
│   ├── api/
│   │   ├── upload/route.ts         # Upload file → Supabase Storage
│   │   ├── analizza/route.ts       # Pipeline AI (OCR + analisi)
│   │   └── admin/                  # API admin (stats, CRUD, ai-usage)
│   └── admin/
│       ├── (auth)/login/           # Login admin
│       └── (panel)/                # Dashboard, lista analisi, costi
├── components/
│   ├── landing/                    # 15 componenti landing page
│   ├── admin/                      # Componenti pannello admin
│   ├── header.tsx                  # Header con auth state
│   ├── upload-zone.tsx             # Drag & drop upload con free tier
│   ├── gdpr-consent.tsx            # Consenso GDPR pre-upload
│   └── free-limit-dialog.tsx       # Dialog limite gratuito raggiunto
├── hooks/
│   └── use-analysis.ts             # Hook gestione stato analisi (polling)
├── lib/
│   ├── ai/
│   │   ├── ocr.ts                  # OCR con GPT-4o Vision (generateObject)
│   │   ├── analisi.ts              # Analisi con GPT-4o (generateObject)
│   │   ├── prompts.ts              # System prompts OCR + analisi
│   │   └── pricing.ts              # Calcolo costi per modello
│   ├── dati-riferimento.ts         # ⭐ Database CCNL + IRPEF + INPS + TFR
│   ├── supabase/
│   │   ├── server.ts               # Client Supabase (Server Components)
│   │   ├── admin.ts                # Client Supabase (service role)
│   │   └── middleware.ts           # Refresh sessione auth
│   ├── types.ts                    # Tipi TS + schemi Zod
│   ├── free-tier.ts                # Tracking analisi gratuite (JWT cookie)
│   ├── auth.ts                     # Auth admin (JWT con jose)
│   ├── mock-data.ts                # Dati demo per ogni tipo documento
│   └── file-utils.ts               # Validazione, HEIC→JPEG, ottimizzazione
└── types/
    └── heic-convert.d.ts           # Dichiarazione tipi (no @types disponibile)

supabase/
└── migrations/
    ├── 001_initial.sql             # Tabella analisi + RLS
    ├── 002_ai_usage.sql            # Tabella tracking costi AI
    ├── 003_admin_functions.sql     # Funzioni SQL per aggregazioni
    └── 004_user_auth.sql           # Colonna user_id + RLS per utente
```

---

## Installazione

### Prerequisiti

- **Node.js** >= 18
- **npm** >= 9
- Un progetto [Supabase](https://supabase.com/) (opzionale — senza funziona in demo mode)
- Chiave API [OpenAI](https://platform.openai.com/) (per GPT-4o e GPT-4o Vision)

### Setup

```bash
# Clona il repository
git clone https://github.com/tuousername/lavorochiaro.git
cd lavorochiaro

# Installa le dipendenze
npm install
```

### Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
OPENAI_API_KEY=sk-...

# Admin
ADMIN_PASSWORD=la-tua-password-admin
ADMIN_JWT_SECRET=un-segreto-sicuro-di-almeno-32-caratteri
```

> **Demo mode**: se `NEXT_PUBLIC_SUPABASE_URL` non e' impostata, l'app funziona automaticamente con dati di esempio. L'upload restituisce un ID fittizio, l'analisi simula 4 secondi di attesa e restituisce un risultato mock. Nessun backend necessario.

### Setup Supabase

1. Crea un nuovo progetto su [supabase.com](https://supabase.com/)
2. Abilita **Supabase Auth** con provider Email/Password
3. Crea un bucket di storage chiamato `documenti` (**privato**)
4. Esegui le migration SQL nell'ordine dal SQL Editor:

```
supabase/migrations/001_initial.sql        # Tabella analisi + RLS base
supabase/migrations/002_ai_usage.sql       # Tabella tracking costi AI
supabase/migrations/003_admin_functions.sql # Funzioni per statistiche admin
supabase/migrations/004_user_auth.sql      # Colonna user_id + RLS per utente
```

---

## Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev
```

L'app sara' disponibile su [http://localhost:3000](http://localhost:3000).

```bash
# Build di produzione
npm run build

# Avvia in produzione
npm start

# Linting
npm run lint
```

---

## Deploy su Vercel

Il progetto e' ottimizzato per [Vercel](https://vercel.com/):

1. Collega il repository GitHub al tuo progetto Vercel
2. Configura le variabili d'ambiente in **Settings > Environment Variables**
3. Il deploy avviene automaticamente ad ogni push su `main`

Nota: la route `/api/analizza` ha `maxDuration = 60` secondi per gestire il tempo di elaborazione della pipeline AI.

---

## Pannello Admin

Accessibile su `/admin/login`, protetto da password (`ADMIN_PASSWORD`).

- **Dashboard** — Analisi totali, distribuzione semaforo, trend temporali
- **Lista analisi** — Tutte le analisi con filtri, semaforo e vista dettaglio
- **Costi AI** — Token utilizzati per fase (OCR/analisi), costi per modello, durate medie
- **Top CCNL** — CCNL piu' analizzati (funzione SQL `top_ccnl`)
- **Top anomalie** — Anomalie piu' frequenti (funzione SQL `top_anomalie`)

---

## Costi AI

Ogni analisi effettua **2 chiamate a GPT-4o**:

| Fase | Modello | Token medi | Costo medio |
|------|---------|-----------|-------------|
| OCR (Vision) | GPT-4o | ~2.000 input + ~800 output | ~$0.013 |
| Analisi | GPT-4o | ~3.000 input + ~1.500 output | ~$0.023 |
| **Totale per analisi** | | | **~$0.036** |

I costi sono tracciati nella tabella `ai_usage` e visibili nel pannello admin.

---

## Limiti e Disclaimer

- L'analisi e' generata da intelligenza artificiale e **non sostituisce il parere di un consulente del lavoro**
- I dati CCNL sono aggiornati manualmente — potrebbero non riflettere rinnovi recentissimi
- Solo 8 CCNL sono supportati con dati completi. Per CCNL non presenti, l'AI segnala l'assenza e riduce la certezza delle verifiche
- Le addizionali regionali e comunali variano per comune/regione — l'AI usa range generali
- I documenti caricati scadono automaticamente dopo 30 giorni

---

## Licenza

Tutti i diritti riservati.
