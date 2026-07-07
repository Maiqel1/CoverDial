import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Optional tagline under the wordmark. */
  subtitle?: string;
  /** Pixel size of the mark. */
  markSize?: number;
  className?: string;
}

/**
 * Brand lockup: the CoverDial mark + wordmark.
 *
 * The source PNG has a white background (no alpha), so `mix-blend-multiply`
 * drops the white against the light sidebar/top-bar surfaces while keeping the
 * teal/green artwork. The wordmark stays in the app's monochrome type so the
 * logo's colour is the single, intentional pop of brand colour.
 */
export function Logo({ subtitle, markSize = 40, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/coverdial-logo.png"
        alt="CoverDial"
        width={markSize}
        height={markSize}
        priority
        className="mix-blend-multiply"
        style={{ width: markSize, height: "auto" }}
      />
      <div className="leading-tight">
        <span className="block text-lg font-black tracking-tighter text-foreground">
          CoverDial
        </span>
        {subtitle && (
          <span className="block text-[11px] text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
