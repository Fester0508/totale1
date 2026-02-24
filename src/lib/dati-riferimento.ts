/**
 * Dati di riferimento per la verifica delle buste paga italiane.
 *
 * Fonti: CNEL, Confcommercio, Federmeccanica, FIPE, ANCE,
 *        Confprofessioni, Agenzia delle Entrate, INPS, ISTAT
 *
 * Ultimo aggiornamento: Febbraio 2026
 */

// ─── IRPEF ──────────────────────────────────────────────────────

export interface ScaglioneIRPEF {
  /** Limite superiore in EUR (null = illimitato) */
  fino_a: number | null;
  aliquota: number;
}

/** Scaglioni IRPEF 2025 */
export const IRPEF_2025: ScaglioneIRPEF[] = [
  { fino_a: 28_000, aliquota: 0.23 },
  { fino_a: 50_000, aliquota: 0.35 },
  { fino_a: null, aliquota: 0.43 },
];

/** Scaglioni IRPEF 2026 (Legge di Bilancio 2026 — aliquota intermedia ridotta al 33%) */
export const IRPEF_2026: ScaglioneIRPEF[] = [
  { fino_a: 28_000, aliquota: 0.23 },
  { fino_a: 50_000, aliquota: 0.33 },
  { fino_a: null, aliquota: 0.43 },
];

export function getScaglioniIRPEF(anno: number): ScaglioneIRPEF[] {
  return anno >= 2026 ? IRPEF_2026 : IRPEF_2025;
}

/** No tax area lavoratori dipendenti */
export const NO_TAX_AREA_DIPENDENTI = 8_500;

/** Detrazione massima per lavoro dipendente (redditi fino a 15.000€) */
export const DETRAZIONE_LAVORO_DIP_MAX = 1_955;

// ─── INPS ───────────────────────────────────────────────────────

export const INPS = {
  /** Aliquota IVS totale (datore + lavoratore) */
  aliquota_totale: 0.33,
  /** Aliquota a carico del lavoratore dipendente privato */
  aliquota_lavoratore: 0.0919,
  /** Aliquota a carico del lavoratore pubblico */
  aliquota_lavoratore_pubblico: 0.088,
  /** Aliquota ridotta per apprendisti */
  aliquota_apprendisti: 0.0584,
} as const;

// ─── TFR ────────────────────────────────────────────────────────

export const TFR = {
  /** Divisore per accantonamento annuo (retribuzione / 13.5) */
  divisore: 13.5,
  /** Percentuale accantonamento lordo (1/13.5 ≈ 7.41%) */
  percentuale_lorda: 0.0741,
  /** Quota destinata al Fondo di Garanzia INPS */
  quota_fondo_garanzia: 0.005,
  /** Percentuale accantonamento netto (≈ 6.91%) */
  percentuale_netta: 0.0691,
  /** Tasso fisso annuo per rivalutazione */
  tasso_fisso_rivalutazione: 0.015,
  /** Percentuale della variazione ISTAT FOI applicata */
  percentuale_istat: 0.75,
  /** Coefficiente rivalutazione anno 2025 (intero) */
  coefficiente_2025: 1.02311148,
} as const;

// ─── Addizionali regionali/comunali ─────────────────────────────

export const ADDIZIONALI = {
  regionale: {
    minima: 0.0123,
    massima: 0.0333,
    esempi: {
      lombardia: 0.0123,
      veneto: 0.0123,
      lazio_max: 0.0333,
      campania_max: 0.0333,
      emilia_romagna_max: 0.0203,
      piemonte_max: 0.0333,
    },
  },
  comunale: {
    minima: 0,
    massima: 0.008,
    eccezione_roma: 0.009,
  },
} as const;

// ─── CCNL ───────────────────────────────────────────────────────

export interface LivelloRetributivo {
  livello: string;
  minimo_tabellare: number;
  scatto_anzianita: number;
}

export interface MaggiorazioneStraordinario {
  tipo: string;
  percentuale: number;
}

export interface DatiCCNL {
  codice: string;
  nome: string;
  parti_firmatarie: string;
  ultimo_rinnovo: string;
  validita: string;
  ore_settimanali: number;
  mensilita: number;
  /** Data di riferimento dei minimi tabellari */
  minimi_aggiornati_a: string;
  livelli: LivelloRetributivo[];
  scatti: {
    periodicita: string;
    numero_massimo: number;
  };
  maggiorazioni_straordinario: MaggiorazioneStraordinario[];
  note: string[];
}

// ─── 1. CCNL Commercio (Confcommercio) ─────────────────────────

const COMMERCIO: DatiCCNL = {
  codice: "commercio-confcommercio",
  nome: "Commercio — Terziario, Distribuzione e Servizi",
  parti_firmatarie: "Confcommercio / Filcams-CGIL, Fisascat-CISL, Uiltucs-UIL",
  ultimo_rinnovo: "22 marzo 2024",
  validita: "1 aprile 2024 – 31 marzo 2027",
  ore_settimanali: 40,
  mensilita: 14,
  minimi_aggiornati_a: "novembre 2025 (4ª tranche)",
  livelli: [
    { livello: "Quadri", minimo_tabellare: 2788.78, scatto_anzianita: 25.46 },
    { livello: "I", minimo_tabellare: 2359.17, scatto_anzianita: 24.84 },
    { livello: "II", minimo_tabellare: 2111.89, scatto_anzianita: 22.83 },
    { livello: "III", minimo_tabellare: 1881.70, scatto_anzianita: 21.95 },
    { livello: "IV", minimo_tabellare: 1698.73, scatto_anzianita: 20.66 },
    { livello: "V", minimo_tabellare: 1585.68, scatto_anzianita: 20.30 },
    { livello: "VI", minimo_tabellare: 1477.53, scatto_anzianita: 19.73 },
    { livello: "VII", minimo_tabellare: 1346.80, scatto_anzianita: 19.47 },
  ],
  scatti: { periodicita: "triennale", numero_massimo: 10 },
  maggiorazioni_straordinario: [
    { tipo: "Feriale (41ª–48ª ora)", percentuale: 15 },
    { tipo: "Eccedente 48ª ora", percentuale: 20 },
    { tipo: "Festivo / domenicale", percentuale: 30 },
    { tipo: "Notturno (22:00–06:00)", percentuale: 50 },
    { tipo: "Ordinario notturno", percentuale: 15 },
  ],
  note: [
    "Le maggiorazioni NON sono cumulabili (la maggiore assorbe la minore)",
    "Tranche future: nov 2026 (+35€ al IV), feb 2027 (+40€ al IV)",
  ],
};

// ─── 2. CCNL Metalmeccanica Industria (Federmeccanica) ──────────

const METALMECCANICA: DatiCCNL = {
  codice: "metalmeccanica-industria",
  nome: "Metalmeccanica Industria",
  parti_firmatarie: "Federmeccanica, Assistal / Fim-CISL, Fiom-CGIL, Uilm-UIL",
  ultimo_rinnovo: "22 novembre 2025",
  validita: "fino al 30 giugno 2028",
  ore_settimanali: 40,
  mensilita: 13,
  minimi_aggiornati_a: "giugno 2025",
  livelli: [
    { livello: "D1", minimo_tabellare: 1742.03, scatto_anzianita: 18.44 },
    { livello: "D2", minimo_tabellare: 1931.78, scatto_anzianita: 20.14 },
    { livello: "C1", minimo_tabellare: 1973.51, scatto_anzianita: 22.26 },
    { livello: "C2", minimo_tabellare: 2015.24, scatto_anzianita: 24.33 },
    { livello: "C3", minimo_tabellare: 2158.26, scatto_anzianita: 26.18 },
    { livello: "B1", minimo_tabellare: 2313.34, scatto_anzianita: 28.51 },
    { livello: "B2", minimo_tabellare: 2481.84, scatto_anzianita: 32.28 },
    { livello: "B3", minimo_tabellare: 2770.74, scatto_anzianita: 40.96 },
    { livello: "A1", minimo_tabellare: 2837.12, scatto_anzianita: 40.96 },
  ],
  scatti: { periodicita: "biennale", numero_massimo: 5 },
  maggiorazioni_straordinario: [
    { tipo: "Feriale diurno (prime 2 ore)", percentuale: 25 },
    { tipo: "Feriale diurno (ore successive)", percentuale: 30 },
    { tipo: "Festivo", percentuale: 55 },
    { tipo: "Festivo con riposo compensativo", percentuale: 35 },
    { tipo: "Notturno", percentuale: 50 },
    { tipo: "Notturno festivo", percentuale: 75 },
  ],
  note: [
    "Minimi aggiornati annualmente a giugno (adeguamento IPCA)",
    "Welfare aziendale obbligatorio: 250€/anno dal 2026",
    "Tranche future: giu 2026, giu 2027, giu 2028",
  ],
};

// ─── 3. CCNL Turismo (Confcommercio) ───────────────────────────

const TURISMO: DatiCCNL = {
  codice: "turismo-confcommercio",
  nome: "Turismo — Alberghi (Confcommercio/Federalberghi)",
  parti_firmatarie: "Federalberghi, Confcommercio / Filcams-CGIL, Fisascat-CISL, Uiltucs-UIL",
  ultimo_rinnovo: "5 luglio 2024",
  validita: "1 luglio 2024 – 31 dicembre 2027",
  ore_settimanali: 40,
  mensilita: 14,
  minimi_aggiornati_a: "giugno 2025",
  livelli: [
    { livello: "QA", minimo_tabellare: 2366.94, scatto_anzianita: 40.80 },
    { livello: "QB", minimo_tabellare: 2191.35, scatto_anzianita: 39.25 },
    { livello: "I", minimo_tabellare: 2041.68, scatto_anzianita: 37.70 },
    { livello: "II", minimo_tabellare: 1866.07, scatto_anzianita: 36.15 },
    { livello: "III", minimo_tabellare: 1759.94, scatto_anzianita: 34.86 },
    { livello: "IV", minimo_tabellare: 1660.69, scatto_anzianita: 33.05 },
    { livello: "V", minimo_tabellare: 1557.44, scatto_anzianita: 32.54 },
    { livello: "VI S", minimo_tabellare: 1497.57, scatto_anzianita: 31.25 },
    { livello: "VI", minimo_tabellare: 1476.34, scatto_anzianita: 30.99 },
    { livello: "VII", minimo_tabellare: 1383.45, scatto_anzianita: 30.47 },
  ],
  scatti: { periodicita: "triennale", numero_massimo: 6 },
  maggiorazioni_straordinario: [
    { tipo: "Diurno", percentuale: 30 },
    { tipo: "Notturno", percentuale: 60 },
  ],
  note: [
    "Per Quadri QA e QB si aggiunge indennità di funzione (75€ e 70€)",
  ],
};

// ─── 4. CCNL Pubblici Esercizi (FIPE) ──────────────────────────

const PUBBLICI_ESERCIZI: DatiCCNL = {
  codice: "pubblici-esercizi-fipe",
  nome: "Pubblici Esercizi, Ristorazione e Turismo (FIPE)",
  parti_firmatarie: "FIPE-Confcommercio / Filcams-CGIL, Fisascat-CISL, Uiltucs-UIL",
  ultimo_rinnovo: "5 giugno 2024",
  validita: "1 giugno 2024 – 31 dicembre 2027",
  ore_settimanali: 40,
  mensilita: 14,
  minimi_aggiornati_a: "giugno 2025",
  livelli: [
    { livello: "QA", minimo_tabellare: 1854.49, scatto_anzianita: 40.80 },
    { livello: "QB", minimo_tabellare: 1674.63, scatto_anzianita: 39.25 },
    { livello: "I", minimo_tabellare: 1517.16, scatto_anzianita: 37.70 },
    { livello: "II", minimo_tabellare: 1337.33, scatto_anzianita: 36.15 },
    { livello: "III", minimo_tabellare: 1228.88, scatto_anzianita: 34.86 },
    { livello: "IV", minimo_tabellare: 1127.75, scatto_anzianita: 33.05 },
    { livello: "V", minimo_tabellare: 1021.49, scatto_anzianita: 32.54 },
    { livello: "VI S", minimo_tabellare: 960.13, scatto_anzianita: 31.25 },
    { livello: "VI", minimo_tabellare: 937.80, scatto_anzianita: 30.99 },
    { livello: "VII", minimo_tabellare: 841.89, scatto_anzianita: 30.47 },
  ],
  scatti: { periodicita: "quadriennale", numero_massimo: 6 },
  maggiorazioni_straordinario: [
    { tipo: "Notturno", percentuale: 60 },
    { tipo: "Festivo", percentuale: 30 },
  ],
  note: [
    "I minimi sopra sono la sola paga base tabellare",
    "Si aggiungono contingenza (518–543€), indennità di funzione (Quadri) e EDR",
    "Il totale retributivo è significativamente più alto dei soli minimi tabellari",
  ],
};

// ─── 5. CCNL Edilizia Industria (ANCE) ─────────────────────────

const EDILIZIA: DatiCCNL = {
  codice: "edilizia-industria",
  nome: "Edilizia Industria (ANCE)",
  parti_firmatarie: "ANCE / Fillea-CGIL, Filca-CISL, Feneal-UIL",
  ultimo_rinnovo: "29 gennaio 2025",
  validita: "1 febbraio 2025 – 30 giugno 2028",
  ore_settimanali: 40,
  mensilita: 13, // Operai: 13ª gestita da Cassa Edile; Impiegati: 13ª + 14ª
  minimi_aggiornati_a: "febbraio 2025",
  livelli: [
    // Impiegati — totale (paga base + contingenza + EDR)
    { livello: "VIII (Quadri)", minimo_tabellare: 2658.86, scatto_anzianita: 13.94 },
    { livello: "VII", minimo_tabellare: 2518.86, scatto_anzianita: 13.94 },
    { livello: "VI", minimo_tabellare: 2317.19, scatto_anzianita: 12.53 },
    { livello: "V", minimo_tabellare: 2014.70, scatto_anzianita: 10.85 },
    { livello: "IV", minimo_tabellare: 1913.89, scatto_anzianita: 10.09 },
    { livello: "III", minimo_tabellare: 1813.05, scatto_anzianita: 9.56 },
    { livello: "II", minimo_tabellare: 1681.97, scatto_anzianita: 8.80 },
    { livello: "I", minimo_tabellare: 1510.56, scatto_anzianita: 8.20 },
  ],
  scatti: { periodicita: "biennale", numero_massimo: 5 },
  maggiorazioni_straordinario: [
    { tipo: "Diurno", percentuale: 35 },
    { tipo: "Festivo", percentuale: 45 },
    { tipo: "Straordinario festivo", percentuale: 55 },
    { tipo: "Notturno", percentuale: 28 },
    { tipo: "Notturno straordinario", percentuale: 40 },
  ],
  note: [
    "Tabella riferita a impiegati (totale = paga base + contingenza + EDR)",
    "Per gli operai la 13ª è gestita tramite Cassa Edile",
    "Per gli impiegati sono previste 13ª + 14ª mensilità",
    "Tranche future: mar 2026 (+50€), mar 2027 (+50€) al parametro 100",
  ],
};

// ─── 6. CCNL Studi Professionali (Confprofessioni) ─────────────

const STUDI_PROFESSIONALI: DatiCCNL = {
  codice: "studi-professionali",
  nome: "Studi Professionali (Confprofessioni)",
  parti_firmatarie: "Confprofessioni / Filcams-CGIL, Fisascat-CISL, Uiltucs-UIL",
  ultimo_rinnovo: "16 febbraio 2024",
  validita: "16 febbraio 2024 – 15 febbraio 2027",
  ore_settimanali: 40,
  mensilita: 14,
  minimi_aggiornati_a: "ottobre 2025 (3ª tranche)",
  livelli: [
    { livello: "Quadri", minimo_tabellare: 2408.53, scatto_anzianita: 30.00 },
    { livello: "I", minimo_tabellare: 2131.39, scatto_anzianita: 26.00 },
    { livello: "II", minimo_tabellare: 1856.50, scatto_anzianita: 23.00 },
    { livello: "III S", minimo_tabellare: 1722.11, scatto_anzianita: 22.00 },
    { livello: "III", minimo_tabellare: 1706.37, scatto_anzianita: 22.00 },
    { livello: "IV S", minimo_tabellare: 1654.70, scatto_anzianita: 20.00 },
    { livello: "IV", minimo_tabellare: 1595.42, scatto_anzianita: 20.00 },
    { livello: "V", minimo_tabellare: 1484.78, scatto_anzianita: 20.00 },
  ],
  scatti: { periodicita: "triennale", numero_massimo: 8 },
  maggiorazioni_straordinario: [
    { tipo: "Feriale", percentuale: 15 },
    { tipo: "Festivo / notturno", percentuale: 30 },
    { tipo: "Notturno festivo", percentuale: 50 },
  ],
  note: [
    "Per i livelli I, II e III S esiste anche l'ENAC (Elemento Nazionale di Allineamento Contrattuale)",
    "Tranche futura: dic 2026 (+20€ al III livello)",
  ],
};

// ─── 7. CCNL Logistica, Trasporto Merci e Spedizione ───────────

const LOGISTICA: DatiCCNL = {
  codice: "logistica-trasporto-merci",
  nome: "Logistica, Trasporto Merci e Spedizione",
  parti_firmatarie:
    "Assologistica, Fedespedi, Fedit, Confetra, Anita, Aite, FAI, FISI, Assoespressi, Federtraslochi / Filt-CGIL, Fit-CISL, Uiltrasporti",
  ultimo_rinnovo: "6 dicembre 2024",
  validita: "1 aprile 2024 – 31 dicembre 2027",
  ore_settimanali: 39,
  mensilita: 14,
  minimi_aggiornati_a: "2025",
  livelli: [
    { livello: "Quadri", minimo_tabellare: 2361.89, scatto_anzianita: 59.05 },
    { livello: "1", minimo_tabellare: 2218.21, scatto_anzianita: 55.46 },
    { livello: "2", minimo_tabellare: 2037.77, scatto_anzianita: 50.94 },
    { livello: "3 Super", minimo_tabellare: 1840.37, scatto_anzianita: 46.01 },
    { livello: "3", minimo_tabellare: 1790.78, scatto_anzianita: 44.77 },
    { livello: "4", minimo_tabellare: 1703.42, scatto_anzianita: 42.59 },
    { livello: "4 Junior", minimo_tabellare: 1659.07, scatto_anzianita: 41.48 },
    { livello: "5", minimo_tabellare: 1624.06, scatto_anzianita: 40.60 },
    { livello: "6", minimo_tabellare: 1518.05, scatto_anzianita: 37.95 },
  ],
  scatti: { periodicita: "biennale", numero_massimo: 6 },
  maggiorazioni_straordinario: [
    { tipo: "Feriale diurno", percentuale: 30 },
    { tipo: "Feriale notturno", percentuale: 50 },
    { tipo: "Festivo diurno", percentuale: 65 },
    { tipo: "Festivo notturno", percentuale: 75 },
  ],
  note: [
    "Scatto di anzianità pari al 2,5% del minimo tabellare",
    "Il livello 6 Junior è stato eliminato dal 31 dicembre 2025",
    "Limite annuo straordinario: 250 ore pro capite",
  ],
};

// ─── 8. CCNL Cooperative Sociali ────────────────────────────────

const COOPERATIVE_SOCIALI: DatiCCNL = {
  codice: "cooperative-sociali",
  nome: "Cooperative Sociali",
  parti_firmatarie:
    "AGCI Solidarietà, Confcooperative Federsolidarietà, Legacoopsociali / FP-CGIL, CISL-FP, Fisascat-CISL, UIL-FPL",
  ultimo_rinnovo: "febbraio 2024",
  validita: "2023 – 2025 (in attesa di rinnovo)",
  ore_settimanali: 38,
  mensilita: 14,
  minimi_aggiornati_a: "ottobre 2025",
  livelli: [
    { livello: "A1", minimo_tabellare: 1359.87, scatto_anzianita: 11.62 },
    { livello: "A2", minimo_tabellare: 1373.55, scatto_anzianita: 13.43 },
    { livello: "B1", minimo_tabellare: 1439.09, scatto_anzianita: 16.27 },
    { livello: "C1", minimo_tabellare: 1545.21, scatto_anzianita: 18.59 },
    { livello: "C2", minimo_tabellare: 1591.18, scatto_anzianita: 19.63 },
    { livello: "C3/D1", minimo_tabellare: 1637.84, scatto_anzianita: 20.66 },
    { livello: "D2", minimo_tabellare: 1727.95, scatto_anzianita: 23.24 },
    { livello: "D3/E1", minimo_tabellare: 1839.35, scatto_anzianita: 26.86 },
    { livello: "E2", minimo_tabellare: 1985.31, scatto_anzianita: 31.50 },
    { livello: "F1", minimo_tabellare: 2193.39, scatto_anzianita: 39.51 },
    { livello: "F2", minimo_tabellare: 2504.10, scatto_anzianita: 46.48 },
  ],
  scatti: { periodicita: "biennale", numero_massimo: 5 },
  maggiorazioni_straordinario: [
    { tipo: "Diurno", percentuale: 15 },
    { tipo: "Notturno / festivo diurno", percentuale: 30 },
    { tipo: "Notturno festivo", percentuale: 50 },
  ],
  note: [
    "14ª mensilità introdotta dal 1 gennaio 2025 (pari a metà mensilità, intera dal 2° anno)",
    "Limite annuo straordinario: 100 ore pro capite",
    "Per livelli E2, F1, F2 si aggiunge indennità professionale aggiuntiva",
  ],
};

// ─── Registro CCNL ─────────────────────────────────────────────

export const CCNL_DATABASE: DatiCCNL[] = [
  COMMERCIO,
  METALMECCANICA,
  TURISMO,
  PUBBLICI_ESERCIZI,
  EDILIZIA,
  STUDI_PROFESSIONALI,
  LOGISTICA,
  COOPERATIVE_SOCIALI,
];

/**
 * Alias per facilitare il matching con i nomi CCNL che appaiono in busta paga.
 * Chiave: pattern normalizzato → codice CCNL.
 */
const CCNL_ALIASES: Record<string, string> = {
  // Commercio
  commercio: "commercio-confcommercio",
  "terziario": "commercio-confcommercio",
  "terziario distribuzione servizi": "commercio-confcommercio",
  confcommercio: "commercio-confcommercio",
  // Metalmeccanica
  metalmeccanica: "metalmeccanica-industria",
  metalmeccanici: "metalmeccanica-industria",
  metalmeccanico: "metalmeccanica-industria",
  federmeccanica: "metalmeccanica-industria",
  // Turismo
  turismo: "turismo-confcommercio",
  alberghi: "turismo-confcommercio",
  federalberghi: "turismo-confcommercio",
  // Pubblici esercizi
  "pubblici esercizi": "pubblici-esercizi-fipe",
  ristorazione: "pubblici-esercizi-fipe",
  fipe: "pubblici-esercizi-fipe",
  bar: "pubblici-esercizi-fipe",
  ristoranti: "pubblici-esercizi-fipe",
  // Edilizia
  edilizia: "edilizia-industria",
  ance: "edilizia-industria",
  costruzioni: "edilizia-industria",
  // Studi professionali
  "studi professionali": "studi-professionali",
  confprofessioni: "studi-professionali",
  // Logistica
  logistica: "logistica-trasporto-merci",
  trasporto: "logistica-trasporto-merci",
  "trasporto merci": "logistica-trasporto-merci",
  spedizione: "logistica-trasporto-merci",
  spedizioni: "logistica-trasporto-merci",
  // Cooperative sociali
  "cooperative sociali": "cooperative-sociali",
  cooperative: "cooperative-sociali",
  coop: "cooperative-sociali",
};

/**
 * Cerca un CCNL nel database a partire da una stringa libera
 * (come quella che appare nelle buste paga).
 */
export function trovaCCNL(nome: string): DatiCCNL | null {
  if (!nome) return null;
  const normalizzato = nome.toLowerCase().trim();

  // Match diretto per codice
  const diretto = CCNL_DATABASE.find((c) => c.codice === normalizzato);
  if (diretto) return diretto;

  // Match per alias
  for (const [alias, codice] of Object.entries(CCNL_ALIASES)) {
    if (normalizzato.includes(alias)) {
      return CCNL_DATABASE.find((c) => c.codice === codice) ?? null;
    }
  }

  // Match parziale sul nome completo
  for (const ccnl of CCNL_DATABASE) {
    if (ccnl.nome.toLowerCase().includes(normalizzato) || normalizzato.includes(ccnl.nome.toLowerCase())) {
      return ccnl;
    }
  }

  return null;
}

// ─── Identificazione CCNL dalla paga ─────────────────────────────

export interface MatchCCNL {
  ccnl: DatiCCNL;
  livello: LivelloRetributivo;
  differenza: number;
  percentuale_scarto: number;
  paga_oraria: number;
}

/**
 * Cerca tra tutti i CCNL e livelli quelli la cui paga base è vicina
 * all'importo fornito. Utile per identificare/confermare il CCNL
 * quando il nome non è chiaro o per cross-reference.
 */
export function identificaCCNLDaPaga(
  pagaBase: number,
  tolleranza: number = 0.15
): MatchCCNL[] {
  const matches: MatchCCNL[] = [];

  for (const ccnl of CCNL_DATABASE) {
    for (const livello of ccnl.livelli) {
      const differenza = Math.abs(pagaBase - livello.minimo_tabellare);
      const percentuale_scarto = differenza / livello.minimo_tabellare;

      if (percentuale_scarto <= tolleranza) {
        const ore_mensili = ccnl.ore_settimanali * 4.33;
        matches.push({
          ccnl,
          livello,
          differenza,
          percentuale_scarto,
          paga_oraria: +(livello.minimo_tabellare / ore_mensili).toFixed(2),
        });
      }
    }
  }

  return matches.sort((a, b) => a.differenza - b.differenza);
}

/**
 * Genera un blocco di testo con i dati di riferimento da iniettare nel prompt AI.
 * Contiene solo il CCNL rilevante (se trovato) + dati fiscali/previdenziali.
 */
export function generaContestoRiferimento(
  ccnlNome: string | null | undefined,
  anno: number = new Date().getFullYear(),
  candidatiDaPaga?: MatchCCNL[]
): string {
  const sezioni: string[] = [];

  // CCNL specifico
  const ccnl = ccnlNome ? trovaCCNL(ccnlNome) : null;
  if (ccnl) {
    sezioni.push(`## DATI CCNL: ${ccnl.nome}`);
    sezioni.push(`Ultimo rinnovo: ${ccnl.ultimo_rinnovo} | Validità: ${ccnl.validita}`);
    sezioni.push(`Ore settimanali: ${ccnl.ore_settimanali} | Mensilità: ${ccnl.mensilita}`);
    sezioni.push(`Minimi aggiornati a: ${ccnl.minimi_aggiornati_a}`);
    sezioni.push("");
    sezioni.push("### Minimi tabellari lordi mensili");
    sezioni.push("| Livello | Minimo (€) | Scatto anzianità (€) |");
    sezioni.push("|---------|-----------|---------------------|");
    for (const l of ccnl.livelli) {
      sezioni.push(
        `| ${l.livello} | ${l.minimo_tabellare.toFixed(2)} | ${l.scatto_anzianita.toFixed(2)} |`
      );
    }
    sezioni.push("");
    sezioni.push(
      `Scatti: ${ccnl.scatti.periodicita}, max ${ccnl.scatti.numero_massimo}`
    );
    sezioni.push("");
    sezioni.push("### Maggiorazioni straordinario");
    for (const m of ccnl.maggiorazioni_straordinario) {
      sezioni.push(`- ${m.tipo}: ${m.percentuale}%`);
    }
    if (ccnl.note.length > 0) {
      sezioni.push("");
      sezioni.push("### Note");
      for (const n of ccnl.note) {
        sezioni.push(`- ${n}`);
      }
    }
  } else if (ccnlNome) {
    sezioni.push(`## CCNL: "${ccnlNome}" — NON PRESENTE NEL DATABASE`);
    sezioni.push(
      "Non disponiamo dei minimi tabellari per questo CCNL. " +
        "Verifica i dati usando la tua conoscenza ma segnala esplicitamente " +
        "che i valori di riferimento non sono stati verificati con dati aggiornati (semaforo GIALLO)."
    );
  }

  // Candidati CCNL identificati dalla paga
  if (candidatiDaPaga && candidatiDaPaga.length > 0) {
    sezioni.push("");
    sezioni.push("## POSSIBILI CCNL IDENTIFICATI DALLA PAGA BASE");
    sezioni.push(
      "Basandoci sull'importo della paga, i seguenti contratti/livelli corrispondono:"
    );
    for (const m of candidatiDaPaga.slice(0, 8)) {
      sezioni.push(
        `- **${m.ccnl.nome}** — Livello ${m.livello.livello}: €${m.livello.minimo_tabellare.toFixed(2)} ` +
          `(scarto ${(m.percentuale_scarto * 100).toFixed(1)}%, paga oraria €${m.paga_oraria}/h, ${m.ccnl.ore_settimanali}h/sett.)`
      );
    }
    sezioni.push("");
    sezioni.push(
      "USA QUESTI DATI per CONFERMARE o IDENTIFICARE il CCNL effettivo. " +
        "Se la paga non corrisponde a nessun minimo tabellare, potrebbe trattarsi di part-time o di superminimi assorbibili."
    );
  }

  // CCNL disponibili (elenco per riferimento)
  sezioni.push("");
  sezioni.push("## CCNL DISPONIBILI NEL DATABASE");
  sezioni.push(CCNL_DATABASE.map((c) => `- ${c.nome} (${c.codice})`).join("\n"));

  // IRPEF
  const scaglioni = getScaglioniIRPEF(anno);
  sezioni.push("");
  sezioni.push(`## IRPEF ${anno}`);
  for (const s of scaglioni) {
    const limite = s.fino_a ? `fino a ${s.fino_a.toLocaleString("it-IT")}€` : "oltre";
    sezioni.push(`- ${limite}: ${(s.aliquota * 100).toFixed(0)}%`);
  }
  sezioni.push(`- No tax area dipendenti: ${NO_TAX_AREA_DIPENDENTI.toLocaleString("it-IT")}€`);
  sezioni.push(`- Detrazione massima lavoro dipendente: ${DETRAZIONE_LAVORO_DIP_MAX}€`);

  // INPS
  sezioni.push("");
  sezioni.push("## CONTRIBUTI INPS");
  sezioni.push(`- Aliquota a carico del lavoratore (privato): ${(INPS.aliquota_lavoratore * 100).toFixed(2)}%`);
  sezioni.push(`- Aliquota a carico del lavoratore (pubblico): ${(INPS.aliquota_lavoratore_pubblico * 100).toFixed(2)}%`);
  sezioni.push(`- Apprendisti: ${(INPS.aliquota_apprendisti * 100).toFixed(2)}%`);
  sezioni.push(`- Aliquota IVS totale: ${(INPS.aliquota_totale * 100).toFixed(0)}%`);

  // TFR
  sezioni.push("");
  sezioni.push("## TFR");
  sezioni.push(`- Accantonamento: retribuzione annua / ${TFR.divisore} (≈ ${(TFR.percentuale_lorda * 100).toFixed(2)}%)`);
  sezioni.push(`- Netto (dopo fondo garanzia INPS 0,50%): ≈ ${(TFR.percentuale_netta * 100).toFixed(2)}%`);
  sezioni.push(
    `- Rivalutazione: ${(TFR.tasso_fisso_rivalutazione * 100).toFixed(1)}% fisso + ${(TFR.percentuale_istat * 100).toFixed(0)}% variazione ISTAT FOI`
  );

  // Addizionali
  sezioni.push("");
  sezioni.push("## ADDIZIONALI REGIONALI E COMUNALI");
  sezioni.push(
    `- Regionale: da ${(ADDIZIONALI.regionale.minima * 100).toFixed(2)}% a ${(ADDIZIONALI.regionale.massima * 100).toFixed(2)}%`
  );
  sezioni.push(
    `- Comunale: da ${(ADDIZIONALI.comunale.minima * 100).toFixed(1)}% a ${(ADDIZIONALI.comunale.massima * 100).toFixed(1)}% (Roma: ${(ADDIZIONALI.comunale.eccezione_roma * 100).toFixed(1)}%)`
  );

  return sezioni.join("\n");
}
