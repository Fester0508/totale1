const PREZZI: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.5, output: 10.0 }, // USD per 1M tokens (text)
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
};

// Costo approssimativo per token immagine (GPT-4o Vision)
// ~85 tokens per tile 512x512, ~$0.001275 per tile a $15/1M tokens
// Per semplicità usiamo il pricing text standard + un margine

export function calcCosto(
  modello: string,
  tokensInput: number,
  tokensOutput: number
): number {
  const p = PREZZI[modello] ?? { input: 0, output: 0 };
  return (tokensInput * p.input + tokensOutput * p.output) / 1_000_000;
}
