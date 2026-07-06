import { cn } from "@/lib/utils/cn";

interface IconProps {
  /** Material Symbols ligature name, e.g. "edit_note", "auto_awesome". */
  name: string;
  /** Render the filled variant of the symbol. */
  filled?: boolean;
  /** Optional pixel size; defaults to inherit (1em). */
  size?: number;
  className?: string;
}

/**
 * Thin wrapper over the Material Symbols icon font.
 * Keeps icon usage declarative (<Icon name="..." />) instead of repeating
 * the span + class boilerplate throughout the app.
 */
export function Icon({ name, filled, size, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined", filled && "filled", className)}
      style={size ? { fontSize: size } : undefined}
    >
      {name}
    </span>
  );
}
