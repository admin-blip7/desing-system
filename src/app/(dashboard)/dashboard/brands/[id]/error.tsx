"use client";

interface BrandErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BrandError({ error, reset }: BrandErrorProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-10">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Error Boundary</p>
      <h1 className="text-3xl font-light text-white">No se pudo cargar la marca</h1>
      <p className="text-sm text-zinc-400">{error.message || "Error inesperado"}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
      >
        Reintentar
      </button>
    </div>
  );
}
