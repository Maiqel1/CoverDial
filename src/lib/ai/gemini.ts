import { GoogleGenAI } from "@google/genai";
import { AIError, type AIProvider, type GenerateTextParams } from "./provider";

/**
 * Gemini implementation of {@link AIProvider}.
 *
 * The API key is read from the server-only `GEMINI_API_KEY` env var - this file
 * must never be imported into a client component (it runs in route handlers).
 * Model is overridable via `GEMINI_MODEL` (defaults to gemini-2.5-flash: fast,
 * cheap, and more than capable for cover letters).
 */
export function createGeminiProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  return {
    name: `gemini:${model}`,
    async generateText({ system, prompt, temperature = 0.7 }: GenerateTextParams) {
      if (!apiKey) {
        throw new AIError(
          "The AI isn't configured yet. Add GEMINI_API_KEY to .env.local and restart the dev server.",
          500,
        );
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: system,
            temperature,
          },
        });

        const text = response.text?.trim();
        if (!text) {
          throw new AIError(
            "The AI returned an empty response. Please try again.",
          );
        }
        return text;
      } catch (err) {
        if (err instanceof AIError) throw err;
        // Surface a clean message; keep the raw error in server logs.
        console.error("[gemini] generateContent failed:", err);
        const message =
          err instanceof Error && /API key/i.test(err.message)
            ? "Your Gemini API key was rejected. Double-check GEMINI_API_KEY."
            : "The AI request failed. Please try again in a moment.";
        throw new AIError(message);
      }
    },
  };
}
