interface Phase2SystemPreviewProps {
  moduleName: string;
  content: string;
}

export default function Phase2SystemPreview({ moduleName, content }: Phase2SystemPreviewProps) {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">No se pudo interpretar JSON para {moduleName}.</p>
      </div>
    );
  }

  const entries = Array.isArray(parsed)
    ? parsed.map((value, index) => [String(index), value] as const)
    : Object.entries((parsed as Record<string, unknown>) || {});

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{moduleName} Structured Output</p>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-zinc-500">{key}</p>
            <pre className="whitespace-pre-wrap break-words text-[11px] text-zinc-200">
              {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
