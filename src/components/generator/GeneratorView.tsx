"use client";

import { useState } from "react";
import type { GeneratorFormValues } from "@/lib/validation/schemas";
import { useLetterStore } from "@/lib/store/letter-store";
import { GeneratorForm } from "./GeneratorForm";
import { LetterPreview } from "./LetterPreview";

/**
 * Client container for the Generator screen. Owns the async generation
 * lifecycle: it POSTs the validated form to /api/generate, tracks
 * loading/error, and writes the result into the shared letter store (which the
 * Editor reads in Step 5).
 */
export function GeneratorView() {
  const letter = useLetterStore((s) => s.letter);
  const setLetter = useLetterStore((s) => s.setLetter);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(values: GeneratorFormValues) {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { letter?: string; error?: string };
      if (!res.ok || !data.letter) {
        throw new Error(data.error ?? "Failed to generate the letter.");
      }
      setLetter(data.letter);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
      <div className="lg:sticky lg:top-8 lg:col-span-7">
        <LetterPreview letter={letter} isGenerating={isGenerating} error={error} />
      </div>
    </div>
  );
}
