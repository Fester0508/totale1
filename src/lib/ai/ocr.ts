import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { OCR_SYSTEM_PROMPT, getOCRUserMessage } from "./prompts";
import { DatiEstrattiOCRSchema } from "../types";
import type { DatiEstrattiOCR, AICallResult } from "../types";

export async function estraiDatiDocumento(
  fileBuffer: Buffer,
  mimeType: string = "image/jpeg",
  documentType?: string
): Promise<AICallResult<DatiEstrattiOCR>> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("ERR-OPENAI-MISSING");
  }
  const start = Date.now();
  const base64Data = fileBuffer.toString("base64");
  const isPdf = mimeType === "application/pdf";

  const fileContent = isPdf
    ? {
        type: "file" as const,
        data: base64Data,
        mediaType: "application/pdf" as const,
      }
    : {
        type: "image" as const,
        image: `data:${mimeType};base64,${base64Data}`,
      };

  const { output, usage } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({
      schema: DatiEstrattiOCRSchema,
    }),
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
    temperature: 0,
  });

  if (!output) {
    throw new Error("OCR non ha prodotto risultati validi");
  }

  return {
    data: output,
    tokensInput: usage.inputTokens ?? 0,
    tokensOutput: usage.outputTokens ?? 0,
    durata_ms: Date.now() - start,
  };
}
