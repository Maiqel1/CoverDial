import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/** Form field label — label-md typography, muted-foreground. */
export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-sm font-medium tracking-tight text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
