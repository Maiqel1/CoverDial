import { downloadBlob, toParagraphs } from "@/lib/utils/download";

/**
 * Export the letter as a .docx using the `docx` library. Loaded lazily. Each
 * blank-line-separated block becomes a paragraph; single newlines within a
 * block become soft line breaks.
 */
export async function exportLetterToDocx(
  text: string,
  filename = "cover-letter",
): Promise<void> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const paragraphs = toParagraphs(text).map((block) => {
    const lines = block.split("\n");
    return new Paragraph({
      spacing: { after: 200 },
      children: lines.map(
        (line, i) => new TextRun({ text: line, break: i > 0 ? 1 : 0 }),
      ),
    });
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 24 } }, // 12pt (half-points)
      },
    },
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${filename}.docx`);
}
