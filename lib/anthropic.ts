import Anthropic from "@anthropic-ai/sdk";

let cachedClient: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key.",
    );
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey });
  }
  return cachedClient;
}

export const MODEL_OPUS = "claude-opus-4-7" as const;
export const MODEL_HAIKU = "claude-haiku-4-5-20251001" as const;

export type CustomerSurface = "trip";
export type InternalSurface = "ops" | "crew";
export type Surface = CustomerSurface | InternalSurface;

export type Effort = "low" | "medium" | "high";

export interface SurfaceConfig {
  model: typeof MODEL_OPUS | typeof MODEL_HAIKU;
  effort: Effort;
  systemPrompt: string;
}
