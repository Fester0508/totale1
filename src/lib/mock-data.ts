import type { RisultatoAnalisi } from "./types";

export type DocumentType = "busta-paga" | "730" | "cartella-esattoriale" | "multa";

export const MOCK_RISULTATO: RisultatoAnalisi = {
  semaforo_globale: "giallo",
  riepilogo:
    "Abbiamo trovato 2 errori confermati e 1 voce da verificare nella tua busta paga. Lo stipendio netto risulta corretto ma ci sono anomalie sugli straordinari e sul TFR.",
  score: 61,
  importo_recuperabile: 234,
  raccomandazioni: [
    "**Contatta HR per iscritto** entro 10 giorni riguardo agli straordinari notturni del 25–28 novembre.",
    "**Richiedi ricalcolo TFR** al consulente del lavoro aziendale.",
    "**Aggiorna il modello 730** con le nuove detrazioni figli 2024.",
  ],
  dati_anagrafici: {
    nome: "Laura Ferretti",
    azienda: "Industrie Meccaniche S.p.A.",
    mese_anno: "Novembre 2024",
    ccnl: "CCNL Metalmeccanici",
    livello: "4\u00b0",
    anzianita: "6 anni",
    tipo_contratto: "Tempo pieno",
    ore_settimanali: 40,
    paga_oraria: 14.15,
  },
  retribuzione: {
    lordo: 2450,
    netto: 1712,
    trattenute_totali: 738,
    irpef: 343,
    inps: 225,
    addizionali: 170,
  },
  ferie_permessi: {
    ferie_residue: 12,
    ferie_maturate: 22,
    ferie_godute: 10,
    permessi_residui: 16,
    rol_residui: 8,
    malattia_giorni: 3,
    note: "Visita medica periodica effettuata il 15/11/2024",
  },
  tfr: {
    accantonamento_mensile: 145,
    accantonamento_calcolato: 181.48,
    differenza: 36.48,
    destinazione: "Azienda",
    conforme: false,
    nota: "L'accantonamento mensile risulta inferiore al dovuto di \u20ac36,48. Il calcolo corretto \u00e8: \u20ac2.450 \u00d7 14 mensilit\u00e0 / 13,5 / 12 = \u20ac211,73 lordo, netto fondo garanzia \u2248 \u20ac181,48/mese.",
  },
  voci: [
    {
      nome: "Maggiorazione straordinario notturno assente",
      importo: 89,
      stato: "rosso",
      categoria: "STRAORDINARI",
      impatto_euro: -89,
      spiegazione:
        "Le 8 ore di straordinario notturno (25–28 nov) risultano pagate con la maggiorazione diurna del 25% anziché quella notturna del 50% prevista dall'art. 5 CCNL Metalmeccanici.",
      problema: "Maggiorazione notturna non applicata",
      riferimento_normativo: "Art. 5 CCNL Metalmeccanici",
    },
    {
      nome: "Accantonamento TFR non aggiornato",
      importo: 145,
      stato: "rosso",
      categoria: "TFR",
      impatto_euro: -145,
      spiegazione:
        "La quota TFR mensile accantonata risulta calcolata sull'imponibile dell'anno precedente e non su quello aggiornato, con differenza di €145 rispetto al dovuto.",
      problema: "TFR calcolato su imponibile non aggiornato",
      riferimento_normativo: "Art. 2120 Codice Civile",
    },
    {
      nome: "Detrazione per figli a carico da aggiornare",
      importo: 0,
      stato: "giallo",
      categoria: "IRPEF",
      impatto_euro: 0,
      spiegazione:
        "La detrazione per figlio a carico applicata corrisponde all'aliquota dell'anno precedente. A seguito della riforma fiscale 2024, potrebbe spettare un beneficio maggiore.",
      problema: "Detrazione potenzialmente non aggiornata alla riforma 2024",
      riferimento_normativo: "TUIR Art. 12",
    },
    {
      nome: "Aliquota INPS corretta",
      importo: 225,
      stato: "verde",
      categoria: "INPS",
      impatto_euro: null,
      spiegazione:
        "La trattenuta previdenziale del 9,19% è corretta per il tuo profilo contrattuale e categoriale.",
      problema: null,
      riferimento_normativo: "L. 335/1995",
    },
    {
      nome: "Residuo ferie calcolato correttamente",
      importo: 0,
      stato: "verde",
      categoria: "FERIE",
      impatto_euro: null,
      spiegazione:
        "Il contatore ferie maturate e godute risulta allineato con i dati di presenza. Nessuna irregolarità.",
      problema: null,
      riferimento_normativo: "D.Lgs. 66/2003 Art. 10",
    },
  ],
  anomalie: [
    {
      titolo: "Maggiorazione straordinario notturno assente",
      impatto_economico: "€89,00/mese",
      cosa_fare:
        "Contatta HR per iscritto entro 10 giorni riguardo agli straordinari notturni del 25–28 novembre.",
    },
    {
      titolo: "Accantonamento TFR non aggiornato",
      impatto_economico: "€145,00",
      cosa_fare:
        "Richiedi ricalcolo TFR al consulente del lavoro aziendale.",
    },
  ],
  confronto_eu: null,
};

export const MOCK_RISULTATO_730: RisultatoAnalisi = {
  semaforo_globale: "rosso",
  riepilogo:
    "Abbiamo trovato 3 anomalie nella tua dichiarazione dei redditi. Ci sono detrazioni non applicate e possibili risparmi fiscali significativi.",
  score: 42,
  importo_recuperabile: 730,
  raccomandazioni: [
    "**Raccogli tutte le ricevute** di spese mediche, farmaci e visite specialistiche dell'anno 2024.",
    "**Verifica le fatture** di eventuali lavori edilizi per la detrazione ristrutturazione.",
    "**Controlla l'aliquota regionale** della tua regione di residenza al 1° gennaio 2024.",
  ],
  dati_anagrafici: {
    nome: "Laura Bianchi",
    azienda: null,
    mese_anno: "Anno fiscale 2024",
    ccnl: "Dichiarazione 730/2025",
    livello: null,
    anzianita: null,
    tipo_contratto: null,
    ore_settimanali: null,
    paga_oraria: null,
  },
  ferie_permessi: null,
  tfr: null,
  retribuzione: {
    lordo: 32500,
    netto: 24180,
    trattenute_totali: 8320,
    irpef: 6020,
    inps: 1585,
    addizionali: 715,
  },
  voci: [
    {
      nome: "Reddito da lavoro dipendente",
      importo: 32500,
      stato: "verde",
      categoria: "REDDITI",
      impatto_euro: null,
      spiegazione:
        "Il reddito complessivo dichiarato corrisponde ai CU ricevuti dal datore di lavoro.",
      problema: null,
      riferimento_normativo: "TUIR Art. 49 - Redditi di lavoro dipendente",
    },
    {
      nome: "IRPEF lorda",
      importo: 7900,
      stato: "verde",
      categoria: "IRPEF",
      impatto_euro: null,
      spiegazione:
        "L'IRPEF lorda è calcolata correttamente secondo gli scaglioni vigenti.",
      problema: null,
      riferimento_normativo: "TUIR Art. 11 - Scaglioni IRPEF 2025",
    },
    {
      nome: "Detrazioni lavoro dipendente",
      importo: -1880,
      stato: "verde",
      categoria: "DETRAZIONI",
      impatto_euro: null,
      spiegazione:
        "Le detrazioni per lavoro dipendente risultano applicate correttamente.",
      problema: null,
      riferimento_normativo: "TUIR Art. 13",
    },
    {
      nome: "Spese mediche",
      importo: 0,
      stato: "rosso",
      categoria: "DETRAZIONI",
      impatto_euro: -350,
      spiegazione:
        "Non risultano spese mediche detratte nella dichiarazione. Le spese sanitarie superiori a 129,11€ sono detraibili al 19%.",
      problema:
        "Hai sostenuto spese mediche durante l'anno? Anche ticket, farmaci e visite specialistiche sono detraibili.",
      riferimento_normativo: "TUIR Art. 15, comma 1, lett. c)",
    },
    {
      nome: "Bonus ristrutturazione",
      importo: 0,
      stato: "rosso",
      categoria: "DETRAZIONI",
      impatto_euro: -300,
      spiegazione:
        "Non risulta alcuna detrazione per ristrutturazione edilizia. Se hai effettuato lavori nel 2024, potresti avere diritto a una detrazione del 50%.",
      problema:
        "Verifica le fatture dei lavori di ristrutturazione o manutenzione straordinaria.",
      riferimento_normativo: "Art. 16-bis TUIR",
    },
    {
      nome: "Addizionale regionale",
      importo: 455,
      stato: "giallo",
      categoria: "ADDIZIONALI",
      impatto_euro: -80,
      spiegazione:
        "L'addizionale regionale calcolata all'1,4% potrebbe non essere corretta per la tua regione.",
      problema:
        "Verifica con la tabella regionale aggiornata.",
      riferimento_normativo: "D.Lgs. 446/1997",
    },
    {
      nome: "Addizionale comunale",
      importo: 260,
      stato: "verde",
      categoria: "ADDIZIONALI",
      impatto_euro: null,
      spiegazione:
        "L'addizionale comunale risulta calcolata correttamente in base al comune di residenza.",
      problema: null,
      riferimento_normativo: "D.Lgs. 360/1998",
    },
  ],
  anomalie: [
    {
      titolo: "Detrazioni spese mediche non richieste",
      impatto_economico: "Potenziale risparmio di €200-500/anno",
      cosa_fare:
        "Raccogli tutte le ricevute di spese mediche dell'anno 2024. Puoi presentare un 730 integrativo.",
    },
    {
      titolo: "Possibile detrazione ristrutturazione mancante",
      impatto_economico: "Fino a €48.000 di detrazione in 10 anni",
      cosa_fare:
        "Verifica di avere fatture e bonifici parlanti per lavori edilizi.",
    },
    {
      titolo: "Addizionale regionale da verificare",
      impatto_economico: "Potenziale differenza di €30-80",
      cosa_fare:
        "Controlla l'aliquota della tua regione di residenza al 1° gennaio 2024.",
    },
  ],
  confronto_eu: null,
};

export const MOCK_RISULTATO_CARTELLA: RisultatoAnalisi = {
  semaforo_globale: "rosso",
  riepilogo:
    "Abbiamo trovato 2 problemi seri nella tua cartella esattoriale. Ci sono possibili vizi di notifica e importi prescritti che potresti contestare.",
  score: 35,
  importo_recuperabile: 970,
  raccomandazioni: [
    "**Verifica la data** dell'ultimo atto notificato per la prescrizione delle sanzioni.",
    "**Richiedi l'estratto di ruolo** per confrontare il calcolo degli interessi.",
    "**Rivolgiti a un avvocato tributarista** per presentare eventuale ricorso.",
  ],
  dati_anagrafici: {
    nome: "Giuseppe Verdi",
    azienda: "Agenzia delle Entrate-Riscossione",
    mese_anno: "Cartella n. 097 2024 00123456 78",
    ccnl: null,
    livello: null,
    anzianita: null,
    tipo_contratto: null,
    ore_settimanali: null,
    paga_oraria: null,
  },
  ferie_permessi: null,
  tfr: null,
  retribuzione: {
    lordo: 4250,
    trattenute_totali: 1380,
    netto: 5630,
    irpef: null,
    inps: null,
    addizionali: null,
  },
  voci: [
    {
      nome: "Importo iscritto a ruolo",
      importo: 4250,
      stato: "giallo",
      categoria: "IMPOSTA",
      impatto_euro: null,
      spiegazione:
        "L'importo principale iscritto a ruolo riguarda IRPEF non versata per l'anno 2019. Verifica che corrisponda effettivamente a quanto dovuto.",
      problema:
        "Richiedi l'estratto di ruolo per un confronto dettagliato.",
      riferimento_normativo: "D.P.R. 602/1973",
    },
    {
      nome: "Sanzioni",
      importo: 850,
      stato: "verde",
      categoria: "SANZIONI",
      impatto_euro: null,
      spiegazione:
        "Le sanzioni applicate (20% dell'importo) sono conformi alla normativa per omesso versamento.",
      problema: null,
      riferimento_normativo: "D.Lgs. 471/1997 Art. 13",
    },
    {
      nome: "Interessi di mora",
      importo: 530,
      stato: "rosso",
      categoria: "INTERESSI",
      impatto_euro: -120,
      spiegazione:
        "Il calcolo degli interessi sembra includere un periodo successivo alla notifica della cartella. Possibile sovrapprezzo di circa €120.",
      problema:
        "Gli interessi dovrebbero decorrere solo fino alla data di notifica.",
      riferimento_normativo: "Art. 30 D.P.R. 602/1973",
    },
    {
      nome: "Aggio di riscossione",
      importo: 0,
      stato: "verde",
      categoria: "COSTI",
      impatto_euro: null,
      spiegazione:
        "Dal 2022 l'aggio di riscossione è stato abolito. Nessun costo aggiuntivo applicato.",
      problema: null,
      riferimento_normativo: "L. 234/2021 Art. 1, comma 15",
    },
    {
      nome: "Prescrizione",
      importo: 0,
      stato: "rosso",
      categoria: "PRESCRIZIONE",
      impatto_euro: -850,
      spiegazione:
        "Le sanzioni tributarie si prescrivono in 5 anni. Se non hai ricevuto atti interruttivi, le sanzioni della cartella 2019 potrebbero essere prescritte.",
      problema:
        "Verifica la data dell'ultimo atto interruttivo ricevuto.",
      riferimento_normativo: "Art. 2946 c.c. e Cass. SS.UU. n. 23397/2016",
    },
  ],
  anomalie: [
    {
      titolo: "Possibile prescrizione delle sanzioni",
      impatto_economico: "Risparmio potenziale di €850",
      cosa_fare:
        "Verifica la data dell'ultimo atto notificato. Se sono passati più di 5 anni, presenta ricorso.",
    },
    {
      titolo: "Interessi di mora probabilmente errati",
      impatto_economico: "Possibile sovrapprezzo di circa €120",
      cosa_fare:
        "Richiedi il dettaglio del calcolo interessi tramite l'estratto di ruolo.",
    },
  ],
  confronto_eu: null,
};

export const MOCK_RISULTATO_MULTA: RisultatoAnalisi = {
  semaforo_globale: "giallo",
  riepilogo:
    "La multa presenta alcune irregolarità nella notifica che potrebbero renderla contestabile. Ecco i dettagli della nostra analisi.",
  score: 55,
  importo_recuperabile: 190.75,
  raccomandazioni: [
    "**Verifica le date** di accertamento e notifica sulla busta della raccomandata.",
    "**Presenta ricorso** al Giudice di Pace entro 30 giorni se la notifica è tardiva.",
    "**Controlla i termini** per il pagamento ridotto del 30%.",
  ],
  dati_anagrafici: {
    nome: "Anna Esposito",
    azienda: "Polizia Municipale di Milano",
    mese_anno: "Verbale n. 2024/MIL/045678",
    ccnl: null,
    livello: null,
    anzianita: null,
    tipo_contratto: null,
    ore_settimanali: null,
    paga_oraria: null,
  },
  ferie_permessi: null,
  tfr: null,
  retribuzione: {
    lordo: 148.0,
    trattenute_totali: 42.75,
    netto: 190.75,
    irpef: null,
    inps: null,
    addizionali: null,
  },
  voci: [
    {
      nome: "Importo base sanzione",
      importo: 148.0,
      stato: "verde",
      categoria: "SANZIONE",
      impatto_euro: null,
      spiegazione:
        "L'importo della sanzione per violazione del limite di velocità rientra nella fascia corretta per un superamento di 12 km/h.",
      problema: null,
      riferimento_normativo: "Art. 142, comma 7 CdS",
    },
    {
      nome: "Spese di notifica",
      importo: 12.75,
      stato: "verde",
      categoria: "SPESE",
      impatto_euro: null,
      spiegazione:
        "Le spese di notifica tramite raccomandata sono conformi alle tariffe postali vigenti.",
      problema: null,
      riferimento_normativo: "Art. 201 CdS",
    },
    {
      nome: "Maggiorazione semestrale",
      importo: 30.0,
      stato: "giallo",
      categoria: "SOVRAPPREZZI",
      impatto_euro: -30,
      spiegazione:
        "Risulta applicata una maggiorazione del 10% per ritardato pagamento. Se il verbale è stato notificato meno di 60 giorni fa, non dovrebbe essere applicata.",
      problema:
        "Verifica la data di notifica: hai 60 giorni per pagare senza sovrapprezzi.",
      riferimento_normativo: "Art. 203 CdS",
    },
    {
      nome: "Tempi di notifica",
      importo: 0,
      stato: "rosso",
      categoria: "NOTIFICA",
      impatto_euro: -190.75,
      spiegazione:
        "La violazione risulta accertata il 15/03/2024 e il verbale notificato il 28/06/2024, ovvero 105 giorni dopo. La notifica sarebbe tardiva e il verbale potrebbe essere annullato.",
      problema:
        "Notifica oltre il termine di 90 giorni dall'accertamento.",
      riferimento_normativo: "Art. 201 CdS",
    },
    {
      nome: "Decurtazione punti",
      importo: 0,
      stato: "verde",
      categoria: "PATENTE",
      impatto_euro: null,
      spiegazione:
        "Per questa violazione sono previsti 3 punti di decurtazione dalla patente, conforme alla tabella.",
      problema: null,
      riferimento_normativo: "Art. 126-bis CdS",
    },
    {
      nome: "Pagamento ridotto",
      importo: -44.40,
      stato: "giallo",
      categoria: "SCONTO",
      impatto_euro: -44.4,
      spiegazione:
        "Se paghi entro 5 giorni dalla notifica hai diritto a uno sconto del 30%. L'importo ridotto sarebbe di €103,60.",
      problema:
        "Verifica se sei ancora nei tempi per il pagamento ridotto.",
      riferimento_normativo: "Art. 202, comma 1 CdS",
    },
  ],
  anomalie: [
    {
      titolo: "Possibile notifica tardiva del verbale",
      impatto_economico: "Annullamento completo della multa (€190,75)",
      cosa_fare:
        "Verifica la data esatta di accertamento e notifica. Se sono passati più di 90 giorni, presenta ricorso.",
    },
    {
      titolo: "Maggiorazione potenzialmente non dovuta",
      impatto_economico: "Risparmio di €30,00",
      cosa_fare:
        "Controlla la data di notifica. Se hai ricevuto la multa meno di 60 giorni fa, la maggiorazione non è applicabile.",
    },
  ],
  confronto_eu: null,
};

export const MOCK_DATA_MAP: Record<DocumentType, RisultatoAnalisi> = {
  "busta-paga": MOCK_RISULTATO,
  "730": MOCK_RISULTATO_730,
  "cartella-esattoriale": MOCK_RISULTATO_CARTELLA,
  "multa": MOCK_RISULTATO_MULTA,
};
