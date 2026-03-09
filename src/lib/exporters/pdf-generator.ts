import { jsPDF } from "jspdf";

interface ModuleRow {
  module_key: string;
  content: unknown;
}

export function buildManualPdfBuffer(brandName: string, modules: ModuleRow[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  // Cover
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setTextColor(250, 250, 250);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text(brandName, margin, pageHeight / 2 - 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Brand Manual", margin, pageHeight / 2 + 10);
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text(`Export date: ${new Date().toISOString()}`, margin, pageHeight / 2 + 32);

  // TOC
  doc.addPage();
  y = margin;
  doc.setTextColor(10, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Tabla de Contenidos", margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  modules.forEach((module, index) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(`${String(index + 1).padStart(2, "0")}  ${module.module_key}`, margin, y);
    y += 16;
  });

  // Sections
  for (const module of modules) {
    doc.addPage();
    y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(module.module_key, margin, y);
    y += 18;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    const content = normalizeModuleContent(module.content);

    const lines = doc.splitTextToSize(content, maxWidth) as string[];
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 13;
    }
  }

  // Footer page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`${i}/${pageCount}`, pageWidth - margin, pageHeight - 20, { align: "right" });
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

function normalizeModuleContent(content: unknown): string {
  if (content && typeof content === "object" && "__payload" in (content as Record<string, unknown>)) {
    return normalizeModuleContent((content as Record<string, unknown>).__payload);
  }

  if (typeof content === "string") {
    return content;
  }

  if (!content || typeof content !== "object") {
    return String(content ?? "");
  }

  const anyContent = content as Record<string, unknown>;
  if (typeof anyContent.text === "string") {
    return anyContent.text;
  }

  if (typeof anyContent.content === "string") {
    return anyContent.content;
  }

  return JSON.stringify(content, null, 2);
}
