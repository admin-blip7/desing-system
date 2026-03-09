interface ModuleRow {
  module_key: string;
  content: unknown;
}

export function buildManualMarkdown(brandName: string, modules: ModuleRow[]) {
  const header = `# ${brandName} - Brand Manual\n\nExport date: ${new Date().toISOString()}\n`;

  const body = modules
    .map((module) => {
      const rawContent =
        module.content && typeof module.content === "object" && "__payload" in (module.content as Record<string, unknown>)
          ? (module.content as Record<string, unknown>).__payload
          : module.content;
      const content =
        typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent, null, 2);

      return `\n## ${module.module_key}\n\n\
\
\
${content}\n\
\
\
`;
    })
    .join("\n");

  return `${header}\n${body || "_No completed modules yet._\n"}`;
}
