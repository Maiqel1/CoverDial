import { toParagraphs } from "@/lib/utils/download";

/**
 * Export the letter as a PDF using jsPDF. Loaded lazily so the (fairly heavy)
 * library only downloads when a user actually exports. US-Letter, 1" margins,
 * Times 12pt with word wrap and page breaks.
 */
export async function exportLetterToPdf(
  text: string,
  filename = "cover-letter",
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 72; // 1 inch
  const lineHeight = 16;
  const paragraphGap = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  let y = margin;
  for (const paragraph of toParagraphs(text)) {
    // Collapse single newlines within a paragraph, then wrap to page width.
    const lines: string[] = doc.splitTextToSize(
      paragraph.replace(/\n/g, " "),
      maxWidth,
    );
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += paragraphGap;
  }

  doc.save(`${filename}.pdf`);
}
