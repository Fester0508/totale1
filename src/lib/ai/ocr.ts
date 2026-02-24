import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { OCR_SYSTEM_PROMPT, getOCRUserMessage } from "./prompts";
import { DatiEstrattiOCRSchema } from "../types";
import type { DatiEstrattiOCR, AICallResult } from "../types";

export async function estraiDatiDocumento(
  fileBuffer: Buffer,
  mimeType: string = "image/jpeg",
  documentType?: string
): Promise<AICallResult<DatiEstrattiOCR>> {
  const start = Date.now();
  const base64Data = fileBuffer.toString("base64");
  const isPdf = mimeType === "application/pdf";

  const fileContent = isPdf
    ? { type: "file" as const, data: base64Data, mediaType: "application/pdf" as const }
    : { type: "image" as const, image: `data:${mimeType};base64,${base64Data}` };

  const { object, usage } = await generateObject({
    model: openai("gpt-4o"),
    schema: DatiEstrattiOCRSchema,
    schemaName: "DatiEstrattiOCR",
    schemaDescription: "Dati estratti da un documento fiscale italiano",
    messages: [
      {
        role: "system",
        content: OCR_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          fileContent,
          {
            type: "text",
            text: getOCRUserMessage(documentType),
          },
        ],
      },
    ],
    maxOutputTokens: 4000,
    maxRetries: 3,
    temperature: 0,
  });

  return {
    data: object,
    tokensInput: usage.inputTokens ?? 0,
    tokensOutput: usage.outputTokens ?? 0,
    durata_ms: Date.now() - start,
  };
}
