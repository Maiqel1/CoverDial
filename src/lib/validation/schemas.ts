import { z } from "zod";
import { TONES, LENGTHS } from "@/types";

/**
 * Validation for the Generator form.
 *
 * The resume's source of truth is `resumeText` (a string): the paste-text mode
 * sets it directly, and the file-upload mode will fill it via parsing in Step 3.
 * Validating the text (not the File) keeps a single rule regardless of source.
 */
export const generatorSchema = z.object({
  resumeText: z
    .string()
    .trim()
    .min(30, "Please add your resume by uploading a file or pasting at least a few lines."),
  jobDescription: z
    .string()
    .trim()
    .min(30, "Paste the job description (at least 30 characters) so the AI has context."),
  tone: z.enum(TONES),
  length: z.enum(LENGTHS),
  additionalInstructions: z
    .string()
    .trim()
    .max(500, "Keep additional instructions under 500 characters.")
    .optional()
    .or(z.literal("")),
});

/** Form values inferred from the schema - used to type the React Hook Form. */
export type GeneratorFormValues = z.infer<typeof generatorSchema>;

/**
 * Validation for an AI Assistant revision request: the current letter plus the
 * instruction describing how to change it.
 */
export const reviseSchema = z.object({
  letter: z.string().trim().min(1, "There is no letter to revise yet."),
  instruction: z
    .string()
    .trim()
    .min(2, "Tell the AI what to change.")
    .max(500, "Keep the instruction under 500 characters."),
});

export type ReviseValues = z.infer<typeof reviseSchema>;
