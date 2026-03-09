interface ModuleRow {
  module_key: string;
  content: unknown;
}

export function buildManualHtml(brandName: string, modules: ModuleRow[]) {
  const sections = modules
    .map((module) => {
      const rawContent =
        module.content && typeof module.content === "object" && "__payload" in (module.content as Record<string, unknown>)
          ? (module.content as Record<string, unknown>).__payload
          : module.content;
      const content =
        typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent, null, 2);

      return `
        <section>
          <h2>${module.module_key}</h2>
          <pre>${escapeHtml(content)}</pre>
        </section>
      `;
    })
    .join("\n");

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${brandName} - Brand Manual</title>
        <style>
          body { font-family: Georgia, serif; max-width: 980px; margin: 0 auto; padding: 40px 24px; color: #111; }
          h1 { font-size: 42px; margin: 0 0 8px; }
          p.meta { color: #666; margin-bottom: 28px; }
          section { margin: 0 0 34px; border-top: 1px solid #ddd; padding-top: 22px; }
          h2 { margin: 0 0 12px; font-size: 26px; }
          pre { white-space: pre-wrap; line-height: 1.6; background: #f8f8f8; padding: 14px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>${brandName}</h1>
        <p class="meta">Manual exportado automáticamente.</p>
        ${sections || "<p>No hay módulos completados para exportar.</p>"}
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
