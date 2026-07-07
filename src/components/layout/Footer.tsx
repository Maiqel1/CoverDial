import { cn } from "@/lib/utils/cn";

interface FooterProps {
  /**
   * "full" - taller footer with wordmark (Generator page).
   * "compact" - slim 48px bar (Editor page, where vertical space is precious).
   */
  variant?: "full" | "compact";
  className?: string;
}

/** Shared page footer. Two density variants to match the two screens. */
export function Footer({ variant = "full", className }: FooterProps) {
  const compact = variant === "compact";

  return (
    <footer
      className={cn(
        "border-t border-border bg-canvas",
        compact ? "px-10 py-3" : "mt-auto px-10 py-8",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center gap-4",
          compact ? "justify-center" : "flex-col gap-2 md:flex-row md:gap-6",
        )}
      >
        {!compact && (
          <span className="text-sm font-bold text-foreground">CoverDial</span>
        )}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CoverDial. Tailored for professionals.
        </p>
      </div>
    </footer>
  );
}
