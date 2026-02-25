import { z } from "zod";

// === Zod Schemas for AI output validation ===
// Nota: si usa .nullable() invece di .optional() per compatibilità
// con OpenAI Structured Outputs (tutti i campi devono essere in "required")

export const VoceOCRSchema = z.object({
  voce: z.string(),
  importo: z.number(),
});

export const DatiEstrattiOCRSchema = z.object({
  dati_anagrafici: z.object({
    nome: z.string().nullable(),
    azienda: z.string().nullable(),
    mese_anno: z.string().nullable(),
    ccnl: z.string().nullable(),
    livello: z.string().nullable(),
    qualifica: z.string().nullable(),
    tipo_contratto: z.string().nullable(),
    ore_settimanali: z.number().nullable(),
    software_gestionale: z.string().nullable(),
    anzianita_anni: z.number().nullable(),
    percentuale_part_time: z.number().nullable(),
  }),
  competenze: z.array(VoceOCRSchema),
  trattenute: z.array(VoceOCRSchema),
  totali: z.object({
    lordo: z.number().nullable(),
    netto: z.number().nullable(),
    trattenute_totali: z.number().nullable(),
    tfr: z.number().nullable(),
  }),
  ferie_permessi: z
    .object({
      ferie_residue: z.number().nullable(),
      ferie_maturate: z.number().nullable(),
      ferie_godute: z.number().nullable(),
      permessi_residui: z.number().nullable(),
      permessi_maturati: z.number().nullable(),
      permessi_goduti: z.number().nullable(),
      rol_residui: z.number().nullable(),
      malattia_giorni: z.number().nullable(),
      congedi_altri: z.string().nullable(),
    })
    .nullable(),
  testo_grezzo: z.string().nullable(),
});

export const VoceAnalisiSchema = z.object({
  nome: z.string(),
  importo: z.number(),
  stato: z.enum(["verde", "giallo", "rosso"]),
  spiegazione: z.string(),
  problema: z.string().nullable(),
  riferimento_normativo: z.string().nullable(),
  categoria: z.string().nullable(),
  impatto_euro: z.number().nullable(),
});

export const AnomaliaSchema = z.object({
  titolo: z.string(),
  impatto_economico: z.string(),
  cosa_fare: z.string(),
});

export const ConfrontoEUSchema = z.object({
  ruolo_stimato: z.string(),
  italia: z.number(),
  germania: z.number(),
  francia: z.number(),
  spagna: z.number(),
  olanda: z.number(),
});

export const FeriePermessiAnalisiSchema = z
  .object({
    ferie_residue: z.number().nullable(),
    ferie_maturate: z.number().nullable(),
    ferie_godute: z.number().nullable(),
    permessi_residui: z.number().nullable(),
    rol_residui: z.number().nullable(),
    malattia_giorni: z.number().nullable(),
    note: z.string().nullable(),
  })
  .nullable();

export const TFRAnalisiSchema = z
  .object({
    accantonamento_mensile: z.number().nullable(),
    accantonamento_calcolato: z.number().nullable(),
    differenza: z.number().nullable(),
    destinazione: z.string().nullable(),
    conforme: z.boolean().nullable(),
    nota: z.string().nullable(),
  })
  .nullable();

export const RisultatoAnalisiSchema = z.object({
  semaforo_globale: z.enum(["verde", "giallo", "rosso"]),
  riepilogo: z.string(),
  score: z.number().nullable(),
  importo_recuperabile: z.number().nullable(),
  raccomandazioni: z.array(z.string()).nullable(),
  dati_anagrafici: z
    .object({
      nome: z.string().nullable(),
      azienda: z.string().nullable(),
      mese_anno: z.string().nullable(),
      ccnl: z.string().nullable(),
      livello: z.string().nullable(),
      anzianita: z.string().nullable(),
      tipo_contratto: z.string().nullable(),
      ore_settimanali: z.number().nullable(),
      paga_oraria: z.number().nullable(),
      software_gestionale: z.string().nullable(),
    })
    .nullable(),
  retribuzione: z
    .object({
      lordo: z.number().nullable(),
      netto: z.number().nullable(),
      trattenute_totali: z.number().nullable(),
      irpef: z.number().nullable(),
      inps: z.number().nullable(),
      addizionali: z.number().nullable(),
    })
    .nullable(),
  ferie_permessi: FeriePermessiAnalisiSchema,
  tfr: TFRAnalisiSchema,
  voci: z.array(VoceAnalisiSchema),
  anomalie: z.array(AnomaliaSchema),
  confronto_eu: ConfrontoEUSchema.nullable(),
});

// === TypeScript types ===

export type VoceAnalisi = z.infer<typeof VoceAnalisiSchema>;
export type Anomalia = z.infer<typeof AnomaliaSchema>;
export type ConfrontoEU = z.infer<typeof ConfrontoEUSchema>;
export type RisultatoAnalisi = z.infer<typeof RisultatoAnalisiSchema>;

export type SemaforoColore = "verde" | "giallo" | "rosso";

export type StatoAnalisi = "processing" | "completed" | "error";

export interface Analisi {
  id: string;
  session_id: string;
  user_id: string | null;
  file_url: string;
  file_type: string;
  stato: StatoAnalisi;
  dati_estratti: Record<string, unknown> | null;
  risultato: RisultatoAnalisi | null;
  semaforo: SemaforoColore | null;
  numero_anomalie: number;
  processing_started_at: string | null;
  created_at: string;
  expires_at: string;
}

// === Admin types ===

export interface AIUsage {
  id: string;
  analisi_id: string | null;
  modello: string;
  fase: "ocr" | "analisi";
  tokens_input: number;
  tokens_output: number;
  costo_usd: number;
  durata_ms: number | null;
  errore: string | null;
  created_at: string;
}

export interface AICallResult<T> {
  data: T;
  tokensInput: number;
  tokensOutput: number;
  durata_ms: number;
}

// === User profile types ===

export interface UserProfile {
  id: string;
  privacy_accepted_at: string;
  terms_accepted_at: string;
  marketing_consent: boolean;
  marketing_consent_at: string | null;
  created_at: string;
  updated_at: string;
}

// === OCR types (inferred from Zod schema) ===

export type DatiEstrattiOCR = z.infer<typeof DatiEstrattiOCRSchema>;
