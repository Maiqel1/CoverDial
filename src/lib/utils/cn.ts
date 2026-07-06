import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely.
 * - `clsx` handles conditional/array/object class inputs.
 * - `twMerge` resolves conflicts so the last utility wins
 *   (e.g. cn("px-2", "px-4") -> "px-4").
 *
 * This is the single helper every UI component uses to combine its own
 * default classes with caller-provided `className` overrides.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
