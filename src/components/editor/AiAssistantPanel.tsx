"use client";

import { useState } from "react";
import { Button, Icon, Textarea } from "@/components/ui";
import { QuickSuggestions } from "./QuickSuggestions";

interface AiAssistantPanelProps {
  /** Read the letter currently in the editor (plain text). */
  getCurrentText: () => string;
  /** Apply a revised letter (updates the editor + store). */
  onRevised: (text: string) => void;
}

/**
 * The AI Assistant. Sends the *current* letter plus an instruction to
 * /api/revise and applies the returned letter in place — editing what exists
 * rather than regenerating from scratch.
 */
export function AiAssistantPanel({ getCurrentText, onRevised }: AiAssistantPanelProps) {
  const [instruction, setInstruction] = useState("");
  const [isRevising, setIsRevising] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runRevise(text: string) {
    const letter = getCurrentText().trim();
    if (!letter) {
      setError("There's no letter to revise yet — generate one first.");
      return;
    }
    if (!text.trim()) {
      setError("Tell the AI what to change.");
      return;
    }

    setIsRevising(true);
    setError(null);
    try {
      const res = await fetch("/api/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter, instruction: text.trim() }),
      });
      const data = (await res.json()) as { letter?: string; error?: string };
      if (!res.ok || !data.letter) {
        throw new Error(data.error ?? "Failed to revise the letter.");
      }
      onRevised(data.letter);
      setInstruction("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsRevising(false);
    }
  }

  return (
    <aside className="flex w-full flex-col border-border bg-muted lg:w-[360px] lg:border-l">
      {/* Prompt box */}
      <div className="border-b border-border bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="auto_awesome" filled size={20} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
            AI Assistant
          </h3>
        </div>

        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={4}
          placeholder="Tell AI what to change..."
          disabled={isRevising}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              void runRevise(instruction);
            }
          }}
        />

        <Button
          fullWidth
          size="lg"
          className="mt-4 gap-2"
          disabled={isRevising}
          onClick={() => void runRevise(instruction)}
        >
          {isRevising ? (
            <>
              <Icon name="progress_activity" size={20} className="animate-spin" />
              Applying…
            </>
          ) : (
            "Apply Changes"
          )}
        </Button>

        {error && <p className="mt-3 text-xs text-error">{error}</p>}
      </div>

      {/* Suggestions + tip */}
      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
        <QuickSuggestions onPick={(t) => void runRevise(t)} disabled={isRevising} />

        <div className="rounded-xl bg-primary p-4 text-primary-foreground">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80">
            Pro Tip
          </p>
          <p className="text-sm leading-snug opacity-95">
            Try asking to &ldquo;rewrite the introduction to emphasize my 5 years
            of remote leadership.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
