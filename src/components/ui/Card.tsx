import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the larger 16px radius for prominent containers. */
  large?: boolean;
  /** Add a hover lift for clickable cards. */
  interactive?: boolean;
}

/**
 * Surface container: white, hairline border, soft layered shadow for gentle
 * depth (see design/DESIGN.md > Elevation - subtle, never heavy blur).
 */
export function Card({ large, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-surface shadow-soft",
        large ? "rounded-xl" : "rounded-lg",
        interactive &&
          "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-subtle",
        className,
      )}
      {...props}
    />
  );
}
