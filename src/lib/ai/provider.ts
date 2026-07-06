/**
 * Provider-agnostic AI seam.
 *
 * Everything above this line (routes, prompt builders) talks only to this
 * interface — it knows how to turn a prompt into text, nothing more. Swapping
 * Gemini for Claude or OpenAI means writing one new implementation and changing
 * one line in `index.ts`; no feature code changes.
 */

export interface GenerateTextParams {
  /** High-level role/behaviour instruction for the model. */
  system?: string;
  /** The concrete user request (already assembled by a prompt builder). */
  prompt: string;
  /** 0 = deterministic, ~1 = creative. Defaults are provider-specific. */
  temperature?: number;
}

export interface AIProvider {
  /** Human-readable id, useful for logging/telemetry. */
  readonly name: string;
  generateText(params: GenerateTextParams): Promise<string>;
}

/** Thrown for expected, user-surfaceable AI failures (missing key, API error). */
export class AIError extends Error {
  constructor(
    message: string,
    /** HTTP-ish status to help the route choose a response code. */
    readonly status: number = 502,
  ) {
    super(message);
    this.name = "AIError";
  }
}
