import { jsPDF } from "jspdf";

interface ModuleRow {
  module_key: string;
  content: unknown;
}

interface LogoGuidelinesPdfOptions {
  brandName: string;
  modules: ModuleRow[];
}

interface SectionBlock {
  title: string;
  body: string[];
}

export function buildLogoGuidelinesPdfBuffer({ brandName, modules }: LogoGuidelinesPdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const moduleTextByKey = new Map(
    modules.map((module) => [module.module_key, normalizeModuleContent(module.content)]),
  );

  // Cover
  doc.setFillColor(10, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text(brandName, margin, pageHeight / 2 - 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Guia de Identidad Visual", margin, pageHeight / 2 + 4);
  doc.setFontSize(14);
  doc.text("Gestion de Logotipo", margin, pageHeight / 2 + 28);
  doc.setFontSize(10);
  doc.setTextColor(190, 205, 220);
  doc.text(`Version 1.0.0 - ${new Date().toISOString().slice(0, 10)}`, margin, pageHeight / 2 + 56);

  const sections = buildSections(brandName, moduleTextByKey);

  // TOC
  doc.addPage();
  y = margin;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Tabla de contenidos", margin, y);
  y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  sections.forEach((section, index) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(`${index + 1}. ${section.title}`, margin, y);
    y += 17;
  });

  for (const section of sections) {
    doc.addPage();
    y = margin;

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(section.title, margin, y);
    y += 20;

    doc.setDrawColor(210, 215, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);

    for (const paragraph of section.body) {
      const lines = doc.splitTextToSize(paragraph, maxWidth) as string[];
      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
          doc.setTextColor(15, 23, 42);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(`${section.title} (cont.)`, margin, y);
          y += 16;
          doc.setTextColor(40, 40, 40);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
        }
        doc.text(line, margin, y);
        y += 14;
      }
      y += 8;
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(125, 125, 125);
    doc.text(`${i}/${pageCount}`, pageWidth - margin, pageHeight - 20, { align: "right" });
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

function buildSections(brandName: string, moduleTextByKey: Map<string, string>): SectionBlock[] {
  const logoSummary = summarize(moduleTextByKey.get("logo"), "No hay datos del modulo logo. Se aplican especificaciones estandar aprobadas.");
  const colorSummary = summarize(moduleTextByKey.get("colorPalette"), "No hay datos del modulo color. Se aplican colores institucionales base con contraste AA.");
  const typographySummary = summarize(
    moduleTextByKey.get("typography"),
    "No hay datos del modulo tipografia. Se aplican recomendaciones sans-serif de alta legibilidad.",
  );

  return [
    {
      title: "1. Generacion y filosofia del logotipo",
      body: [
        `${brandName} adopta un sistema de logotipo orientado a claridad, consistencia y reproduccion multi-soporte.`,
        `Contexto autocompletado desde modulo logo: ${logoSummary}`,
        "Elementos estructurales: isotipo, logotipo tipografico e isologo combinado. Relaciones proporcionales bloqueadas y no editables.",
      ],
    },
    {
      title: "2. Versiones del logotipo",
      body: [
        "Version principal: Hex #0D3B66 y #F4D35E. Uso obligatorio cuando exista contraste suficiente.",
        "Version negativa: blanco y gris frio para fondos oscuros o saturados.",
        "Version monocromatica: K100 / K85 para reproduccion de una tinta.",
        "Isotipo independiente: permitido para favicon, app icon y avatar cuando la marca ya es reconocible.",
      ],
    },
    {
      title: "3. Area de proteccion",
      body: [
        "Unidad de referencia: u = altura de la letra M del logotipo.",
        "Margen minimo obligatorio: 1u en superior, inferior, izquierda y derecha.",
        "Ningun elemento externo (texto, imagen, borde, icono) puede invadir el area de proteccion.",
      ],
    },
    {
      title: "4. Tamaños minimos",
      body: [
        "Isologo horizontal: 120 px minimo legible, 160 px recomendado.",
        "Isologo vertical: 90 px minimo legible, 120 px recomendado.",
        "Logotipo tipografico: 80 px minimo legible, 110 px recomendado.",
        "Isotipo: 16 px minimo legible, 24 px recomendado. En impresion: 5 mm minimo legible, 8 mm recomendado.",
      ],
    },
    {
      title: "5. Colores de fondo",
      body: [
        `Contexto autocompletado desde modulo color: ${colorSummary}`,
        "Fondos preferidos: #FFFFFF, #0D3B66, #F7F9FC.",
        "Fondos prohibidos: luminancia cercana al logo, combinaciones vibrantes y patrones de alto ruido sin overlay.",
        "El contraste de texto del documento debe cumplir WCAG 2.1 AA (4.5:1 normal, 3:1 grande).",
      ],
    },
    {
      title: "6. Reglas de uso correcto e incorrecto",
      body: [
        "Correcto: mantener proporcion original, version aprobada y area de proteccion completa.",
        "Incorrecto: distorsionar, rotar, aplicar efectos, alterar colores, mezclar versiones o editar tipografia del logotipo.",
        "Cada caso incorrecto debe presentarse junto a su correccion equivalente para evitar ambiguedad operativa.",
      ],
    },
    {
      title: "7. Exportacion y distribucion",
      body: [
        `Soporte de tipografia recomendado para la guia: ${typographySummary}`,
        "Formatos maestros: SVG, EPS, AI y PDF vectorial. Raster: PNG/JPG solo cuando aplique.",
        "Resolucion: 300 DPI para impresion al tamaño final. Entregables digitales: variantes @1x, @2x y @3x.",
        "Perfiles de color: sRGB para digital e ISO Coated v2/FOGRA39 para impresion, segun imprenta.",
      ],
    },
  ];
}

function summarize(source: string | undefined, fallback: string): string {
  if (!source) {
    return fallback;
  }

  const normalized = source.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return fallback;
  }

  return normalized.slice(0, 280);
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
