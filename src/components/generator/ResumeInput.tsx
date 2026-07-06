"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon, Textarea } from "@/components/ui";
import {
  MAX_RESUME_MB,
  ResumeParseError,
  parseResume,
  validateResumeFile,
} from "@/lib/files/parse-resume";

interface ResumeInputProps {
  /** Current resume text (the RHF-controlled value). */
  value: string;
  onChange: (value: string) => void;
  /** Validation message for the resume field, if any. */
  error?: string;
}

type Mode = "upload" | "paste";

/**
 * Resume entry with two modes:
 *  - "upload": drag/drop or browse a PDF/DOCX; the file is parsed to text
 *    in-browser and populates the form's resume value.
 *  - "paste":  paste raw resume text directly.
 * Both feed the same `value` (resume text) that the form validates.
 */
export function ResumeInput({ value, onChange, error }: ResumeInputProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedChars, setParsedChars] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    const picked = files?.[0];
    if (!picked) return;

    const invalid = validateResumeFile(picked);
    if (invalid) {
      setLocalError(invalid);
      return;
    }

    setLocalError(null);
    setFile(picked);
    setParsedChars(null);
    setParsing(true);
    try {
      const text = await parseResume(picked);
      onChange(text);
      setParsedChars(text.length);
    } catch (err) {
      const message =
        err instanceof ResumeParseError
          ? err.message
          : "We couldn't read that file. Try pasting the text instead.";
      setLocalError(message);
      setFile(null);
      onChange("");
    } finally {
      setParsing(false);
    }
  }

  function clearFile() {
    setFile(null);
    setParsedChars(null);
    setLocalError(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {/* Mode toggle */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          Resume
        </span>
        <div className="flex gap-1 rounded-lg bg-muted p-0.5">
          {(["upload", "paste"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                mode === m
                  ? "bg-surface text-foreground shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "upload" ? "Upload" : "Paste text"}
            </button>
          ))}
        </div>
      </div>

      {mode === "upload" ? (
        parsing ? (
          // Reading state
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
            <Icon
              name="progress_activity"
              size={24}
              className="animate-spin text-muted-foreground"
            />
            <p className="truncate text-sm text-muted-foreground">
              Reading {file?.name}…
            </p>
          </div>
        ) : file ? (
          // Parsed-file summary
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Icon name="description" size={24} className="shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-subtle">
                  {(file.size / 1024).toFixed(0)} KB
                  {parsedChars !== null &&
                    ` · ${parsedChars.toLocaleString()} characters extracted`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove file"
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted-hover hover:text-foreground"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        ) : (
          // Dropzone
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              dragging
                ? "border-primary bg-muted-hover"
                : "border-border bg-muted hover:bg-muted-hover",
            )}
          >
            <Icon name="upload_file" size={36} className="mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop your resume, or{" "}
              <span className="font-semibold text-foreground underline">browse</span>
            </p>
            <p className="mt-2 text-xs text-subtle">PDF or DOCX · Max {MAX_RESUME_MB}MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => void handleFiles(e.target.files)}
            />
          </div>
        )
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder="Paste your resume text here..."
        />
      )}

      {(error || localError) && (
        <p className="mt-2 text-xs text-error">{localError ?? error}</p>
      )}
    </div>
  );
}
