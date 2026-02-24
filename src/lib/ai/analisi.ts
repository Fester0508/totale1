import { generateText, Output } from "ai";
import { getAnalisiSystemPrompt } from "./prompts";
import { RisultatoAnalisiSchema } from "../types";
import { generaContestoRiferimento, identificaCCNLDaPaga } from "../dati-riferimento";
import type { RisultatoAnalisi, DatiEstrattiOCR, AICallResult } from "../types";

export async function analizzaBustaPaga(
  datiEstratti: DatiEstrattiOCR
): Promise<AICallResult<RisultatoAnalisi>> {
  const start = Date.now();

  // Genera il contesto di riferimento con i dati CCNL reali
  const ccnlNome = datiEstratti.dati_anagrafici?.ccnl ?? null;
  const anno = estraiAnno(datiEstratti.dati_anagrafici?.mese_anno);

  // Identifica possibili CCNL dalla paga base
  const pagaBase = datiEstratti.totali?.lordo ?? null;
  const candidatiCCNL = pagaBase ? identificaCCNLDaPaga(pagaBase) : undefined;

  const contestoRiferimento = generaContestoRiferimento(ccnlNome, anno, candidatiCCNL);
  const systemPrompt = getAnalisiSystemPrompt(contestoRiferimento);

  const { output, usage } = await generateText({
    model: "openai/gpt-4o",
    output: Output.object({
      schema: RisultatoAnalisiSchema,
    }),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Analizza questa busta paga. Ecco i dati estratti dal documento:\n\n${JSON.stringify(datiEstratti, null, 2)}`,
      },
    ],
    maxOutputTokens: 8000,
    temperature: 0.1,
  });

  if (!output) {
    throw new Error("Analisi non ha prodotto risultati validi");
  }

  return {
    data: output,
    tokensInput: usage.inputTokens ?? 0,
    tokensOutput: usage.outputTokens ?? 0,
    durata_ms: Date.now() - start,
  };
}

/** Estrae l'anno da una stringa tipo "Gennaio 2025" o "01/2025" */
function estraiAnno(meseAnno: string | null | undefined): number {
  if (!meseAnno) return new Date().getFullYear();
  const match = meseAnno.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : new Date().getFullYear();
}
