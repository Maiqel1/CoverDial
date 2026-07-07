import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "./Icon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols ligature name. */
  icon: string;
  filled?: boolean;
  /** Accessible label - required since the button has no visible text. */
  label: string;
  iconSize?: number;
}

/**
 * Square, icon-only button used in toolbars and panels (undo/redo, copy, mic…).
 * Enforces an accessible label so icon-only controls stay screen-reader friendly.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, filled, label, iconSize = 20, className, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded p-2 text-muted-foreground",
          "transition-colors hover:bg-muted-hover hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <Icon name={icon} filled={filled} size={iconSize} />
      </button>
    );
  },
);
IconButton.displayName = "IconButton";
