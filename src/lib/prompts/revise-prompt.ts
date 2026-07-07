/**
 * Prompt engineering for cover-letter *revision*. The defining constraint: the
 * model edits the EXISTING letter per the instruction - it must not write a
 * brand-new letter from scratch.
 */

const SYSTEM = `You are an expert editor refining an existing cover letter.

Rules:
- Apply ONLY the change the user asks for. Preserve everything else - structure, facts, names, and tone - unless the instruction says otherwise.
- Return the COMPLETE revised letter, not a diff, summary, or explanation.
- Output plain text only: no markdown, no code fences, no preamble like "Here is the revised letter".
- Never invent employers, titles, dates, metrics, or skills that are not already present.
- Never use em dashes or en dashes (the long dash characters). Use commas, periods, parentheses, or a plain hyphen instead. If the current letter contains any, replace them.
- Keep the salutation and signature intact unless the instruction targets them.`;

/** Assemble the system + user prompt for a revision request. */
export function buildRevisePrompt(params: {
  letter: string;
  instruction: string;
}): { system: string; prompt: string } {
  const prompt = `Revise the cover letter below according to this instruction:

INSTRUCTION: ${params.instruction.trim()}

=== CURRENT COVER LETTER ===
${params.letter.trim()}

Return only the full revised cover letter.`;

  return { system: SYSTEM, prompt };
}
