import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "./Icon";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional leading Material Symbols icon. */
  icon?: string;
  iconFilled?: boolean;
}

/**
 * Small status pill (e.g. the "Saved to Cloud" badge in the editor header).
 * label-sm typography: 12px, uppercase, wide tracking on a muted fill.
 */
export function Chip({ icon, iconFilled, className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted-hover px-3 py-1",
        "text-[12px] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} filled={iconFilled} size={16} />}
      {children}
    </span>
  );
}
