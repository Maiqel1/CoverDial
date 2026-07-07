import type { AIProvider } from "./provider";
import { createGeminiProvider } from "./gemini";

/**
 * The single place the app chooses its AI provider.
 *
 * To switch providers later (e.g. Claude, OpenAI), implement the AIProvider
 * interface in a sibling file and return it here - nothing else changes.
 */
export function getAIProvider(): AIProvider {
  return createGeminiProvider();
}

export type { AIProvider } from "./provider";
export { AIError } from "./provider";
