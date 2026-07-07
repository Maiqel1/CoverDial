/**
 * Resume file parsing - runs entirely in the browser, so the file never leaves
 * the user's machine. Supports PDF (via pdf.js) and DOCX (via mammoth).
 *
 * The parser libraries are `import()`-ed lazily inside each function so they are
 * only downloaded when a user actually uploads a file, and never touch the SSR
 * bundle.
 */

export const MAX_RESUME_MB = 5;
const ACCEPTED_EXT = /\.(pdf|docx)$/i;

export class ResumeParseError extends Error {}

/** True if the file looks like a supported resume (by extension). */
export function isSupportedResume(file: File): boolean {
  return ACCEPTED_EXT.test(file.name);
}

/** Human-readable guard used by the UI before attempting a parse. */
export function validateResumeFile(file: File): string | null {
  if (!isSupportedResume(file)) return "Only PDF or DOCX files are supported.";
  if (file.size > MAX_RESUME_MB * 1024 * 1024)
    return `File is too large. Max size is ${MAX_RESUME_MB}MB.`;
  return null;
}

/** Collapse excessive whitespace/blank lines that parsers tend to produce. */
function normalize(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function parsePdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Point pdf.js at its worker. `new URL(..., import.meta.url)` lets the bundler
  // (Turbopack) emit the worker as an asset and hand back a usable URL.
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let pageText = "";
    for (const item of content.items) {
      // TextItem has `str` and `hasEOL`; TextMarkedContent does not.
      if ("str" in item) {
        pageText += item.str;
        if (item.hasEOL) pageText += "\n";
        else pageText += " ";
      }
    }
    pages.push(pageText);
  }
  return normalize(pages.join("\n\n"));
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  return normalize(value);
}

/**
 * Parse a resume file into plain text. Throws {@link ResumeParseError} with a
 * user-friendly message on unsupported types or unreadable files.
 */
export async function parseResume(file: File): Promise<string> {
  const invalid = validateResumeFile(file);
  if (invalid) throw new ResumeParseError(invalid);

  const isPdf = /\.pdf$/i.test(file.name);
  try {
    const text = isPdf ? await parsePdf(file) : await parseDocx(file);
    if (text.length < 20) {
      throw new ResumeParseError(
        "We couldn't read meaningful text from this file. If it's a scanned/image PDF, paste the text instead.",
      );
    }
    return text;
  } catch (err) {
    if (err instanceof ResumeParseError) throw err;
    throw new ResumeParseError(
      "We couldn't read that file. Try a different file or paste the text instead.",
    );
  }
}
