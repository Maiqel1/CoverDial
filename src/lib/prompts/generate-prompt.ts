import type { GeneratorInput, Length, Tone } from "@/types";

/**
 * Prompt engineering for cover-letter *generation*, kept separate from the API
 * call (the provider) so prompts can be tuned/tested in isolation.
 */

const TONE_GUIDANCE: Record<Tone, string> = {
  Professional: "polished, competent, and businesslike",
  Friendly: "warm and personable while still professional",
  Confident: "assertive and self-assured, emphasising impact and results",
  Formal: "traditional and highly formal in structure and language",
};

const LENGTH_GUIDANCE: Record<Length, string> = {
  Short: "about 150–200 words across 2 tight paragraphs",
  Standard: "about 300–350 words across 3–4 paragraphs",
  Detailed: "about 450–550 words across 4–5 thorough paragraphs",
};

const SYSTEM = `You are an expert cover letter writer who helps job seekers craft compelling, tailored cover letters.

Rules:
- Write ONLY the cover letter body text. No preamble, no explanations, no markdown, no code fences.
- Ground every claim in the candidate's actual resume. Never invent employers, titles, dates, metrics, or skills that are not present.
- Address the letter to the hiring team; if no name is available use "Dear Hiring Manager,".
- Open with a strong hook, connect the candidate's real experience to the role's needs, and close with a confident call to action.
- Use natural, human prose. Avoid clichés ("I am writing to express"), buzzword stuffing, and obvious AI phrasing.
- End with "Sincerely," followed by the candidate's name if it appears in the resume; otherwise omit the signature name.`;

/** Assemble the system + user prompt for a generation request. */
export function buildGeneratePrompt(input: GeneratorInput): {
  system: string;
  prompt: string;
} {
  const { resumeText, jobDescription, tone, length, additionalInstructions } =
    input;

  const extra = additionalInstructions?.trim()
    ? `\nAdditional instructions from the candidate (follow these closely):\n${additionalInstructions.trim()}`
    : "";

  const prompt = `Write a cover letter tailored to this job, based on the candidate's resume.

Tone: ${tone} — ${TONE_GUIDANCE[tone]}.
Length: ${LENGTH_GUIDANCE[length]}.

=== CANDIDATE RESUME ===
${resumeText.trim()}

=== JOB DESCRIPTION ===
${jobDescription.trim()}${extra}

Return only the finished cover letter.`;

  return { system: SYSTEM, prompt };
}
