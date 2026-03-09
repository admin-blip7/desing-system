"use client";

interface ExportActionsProps {
  brandId: string;
}

const formats = [
  { label: "PDF", endpoint: "/api/export/pdf" },
  { label: "Logo PDF Auto", endpoint: "/api/export/logo-guidelines/pdf", fileSuffix: "logo-guidelines.pdf" },
  { label: "HTML", endpoint: "/api/export", format: "html" as const },
  { label: "Markdown", endpoint: "/api/export", format: "markdown" as const },
];

export default function ExportActions({ brandId }: ExportActionsProps) {
  const onDownload = async (
    endpoint: string,
    label: string,
    format?: "html" | "markdown",
    fileSuffix?: string,
  ) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(format ? { brandId, format } : { brandId }),
    });

    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileSuffix ? `${brandId}-${fileSuffix}` : `${brandId}-${label.toLowerCase()}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {formats.map((item) => (
        <article key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-lg font-medium text-white">{item.label}</p>
          <p className="mt-1 text-sm text-zinc-400">Genera archivo descargable del manual completo.</p>

          <button
            onClick={() => onDownload(item.endpoint, item.label, item.format, item.fileSuffix)}
            className="mt-4 inline-block rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            Descargar {item.label}
          </button>
        </article>
      ))}
    </div>
  );
}
