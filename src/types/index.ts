// Shared domain types for CoverDial.
// These option lists are the single source of truth: the form selects, the Zod
// schema, and (later) the AI prompt builder all derive from them.

export const TONES = [
  "Professional",
  "Friendly",
  "Confident",
  "Formal",
] as const;
export type Tone = (typeof TONES)[number];

export const LENGTHS = ["Standard", "Short", "Detailed"] as const;
export type Length = (typeof LENGTHS)[number];

/** The resolved input we send to the AI to generate a cover letter. */
export interface GeneratorInput {
  /** Plain-text resume content (from a parsed file or pasted directly). */
  resumeText: string;
  jobDescription: string;
  tone: Tone;
  length: Length;
  additionalInstructions?: string;
}
