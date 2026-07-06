import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "./field";

/** Multi-line text input (job description, AI prompt). */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "resize-none", className)}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
