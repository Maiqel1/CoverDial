import Link from "next/link";
import { Card, Icon } from "@/components/ui";
import { LetterActions } from "@/components/shared/LetterActions";

interface LetterPreviewProps {
  /** Generated letter text, or null before anything is generated. */
  letter?: string | null;
  isGenerating?: boolean;
  error?: string | null;
}

/**
 * Right-hand output panel. Renders one of four states: generating, error,
 * result, or the initial empty state. When a letter exists, the copy/export and
 * "Open in Editor" actions reveal on hover (always visible on touch screens).
 */
export function LetterPreview({ letter, isGenerating, error }: LetterPreviewProps) {
  const hasLetter = Boolean(letter);

  return (
    <Card
      large
      data-tour="preview"
      className="group flex h-[calc(100vh-13rem)] min-h-[480px] flex-col overflow-hidden p-0"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-border transition-colors group-hover:bg-subtle" />
          <span className="h-2.5 w-2.5 rounded-full bg-border transition-colors group-hover:bg-subtle" />
          <span className="h-2.5 w-2.5 rounded-full bg-border transition-colors group-hover:bg-subtle" />
          <span className="ml-2 text-xs text-muted-foreground">Letter Preview</span>
        </div>
        {hasLetter && (
          // Revealed on hover/focus (desktop); always visible on touch screens.
          <div className="flex translate-y-0 items-center gap-1 opacity-100 transition-all duration-200 lg:-translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-within:translate-y-0 lg:focus-within:opacity-100">
            <LetterActions variant="compact" />
            <div className="mx-1 h-5 w-px bg-border" />
            <Link
              href="/editor"
              className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted-hover"
            >
              <Icon name="history_edu" size={16} />
              Open in Editor
            </Link>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <Icon
              name="progress_activity"
              size={40}
              className="animate-spin text-muted-foreground"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Writing your cover letter…
            </p>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <Icon name="error" size={40} className="text-error" />
            <h4 className="mt-4 text-lg font-medium text-foreground">
              Something went wrong
            </h4>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{error}</p>
          </div>
        ) : hasLetter ? (
          <div className="whitespace-pre-wrap p-10 text-base leading-relaxed text-foreground animate-slide-up">
            {letter}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center opacity-70">
            <div className="relative mb-6">
              <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-muted-hover blur-xl" />
              <Icon
                name="description"
                size={72}
                className="relative z-10 text-subtle"
              />
            </div>
            <h4 className="text-2xl font-medium text-foreground">Ready to write</h4>
            <p className="mt-2 max-w-sm text-base text-muted-foreground">
              Your AI-generated cover letter will appear here, ready for final
              review and export.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
