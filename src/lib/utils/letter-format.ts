/**
 * Convert the AI's plain-text letter (paragraphs separated by blank lines) into
 * HTML paragraphs that Tiptap can load. Reverse direction uses the editor's own
 * `getText()`, which already returns newline-delimited plain text.
 */
export function letterTextToHtml(text: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .filter((block) => block.trim().length > 0);

  if (paragraphs.length === 0) return "<p></p>";

  return paragraphs
    .map((block) => `<p>${escape(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
