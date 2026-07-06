"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui";
import { useLetterStore } from "@/lib/store/letter-store";
import { exportLetterToPdf } from "@/lib/export/pdf";
import { exportLetterToDocx } from "@/lib/export/docx";

interface LetterActionsProps {
  /** "bar" = labelled buttons (editor header); "compact" = icon-only (preview). */
  variant?: "bar" | "compact";
  className?: string;
}

/**
 * Copy / PDF / DOCX actions for the current letter. Reads the letter straight
 * from the shared store, so it stays in sync with manual + AI edits and needs
 * no prop drilling. Disabled when there is no letter.
 */
export function LetterActions({ variant = "bar", className }: LetterActionsProps) {
  const letter = useLetterStore((s) => s.letter);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<null | "pdf" | "docx">(null);
  const disabled = !letter;

  async function handleCopy() {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing actionable to show */
    }
  }

  async function handleExport(kind: "pdf" | "docx") {
    if (!letter) return;
    setBusy(kind);
    try {
      if (kind === "pdf") await exportLetterToPdf(letter);
      else await exportLetterToDocx(letter);
    } finally {
      setBusy(null);
    }
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <IconAction
          icon={copied ? "check" : "content_copy"}
          label={copied ? "Copied" : "Copy"}
          onClick={handleCopy}
          disabled={disabled}
        />
        <IconAction
          icon="picture_as_pdf"
          label="Download PDF"
          onClick={() => handleExport("pdf")}
          disabled={disabled || busy !== null}
        />
        <IconAction
          icon="description"
          label="Download DOCX"
          onClick={() => handleExport("docx")}
          disabled={disabled || busy !== null}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BarButton
        icon={copied ? "check" : "content_copy"}
        label={copied ? "Copied" : "Copy"}
        onClick={handleCopy}
        disabled={disabled}
      />
      <div className="mx-1 h-6 w-px bg-border" />
      <BarButton
        icon="picture_as_pdf"
        iconClassName="text-error"
        label="PDF"
        onClick={() => handleExport("pdf")}
        disabled={disabled}
        loading={busy === "pdf"}
      />
      <BarButton
        icon="description"
        label="DOCX"
        onClick={() => handleExport("docx")}
        disabled={disabled}
        loading={busy === "docx"}
      />
    </div>
  );
}

function BarButton({
  icon,
  label,
  onClick,
  disabled,
  loading,
  iconClassName,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon
        name={loading ? "progress_activity" : icon}
        size={18}
        className={cn(loading && "animate-spin", iconClassName)}
      />
      {label}
    </button>
  );
}

function IconAction({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
