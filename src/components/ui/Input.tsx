import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "./field";

/** Single-line text input. Ref-forwarding so React Hook Form can register it. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input ref={ref} type={type} className={cn(fieldBase, className)} {...props} />
    );
  },
);
Input.displayName = "Input";
