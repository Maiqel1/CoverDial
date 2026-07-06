"use client";

import { Icon } from "@/components/ui";

// Preset revision instructions. Each is sent to the AI verbatim as the
// instruction, so they read as natural imperatives.
const SUGGESTIONS = [
  "Make it more concise",
  "Sound more confident",
  "Highlight leadership",
  "Make it more ATS-friendly",
];

interface QuickSuggestionsProps {
  onPick: (instruction: string) => void;
  disabled?: boolean;
}

/** One-tap revision presets shown under the AI Assistant input. */
export function QuickSuggestions({ onPick, disabled }: QuickSuggestionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quick Suggestions
      </p>
      <div className="grid gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            disabled={disabled}
            onClick={() => onPick(text)}
            className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-soft active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="text-sm text-foreground">{text}</span>
            <Icon
              name="arrow_forward"
              size={18}
              className="text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-foreground"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
