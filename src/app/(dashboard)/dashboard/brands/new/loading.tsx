export default function NewBrandLoading() {
  return (
    <div className="min-h-screen p-8 text-[var(--bm-color-text-primary)] bg-[var(--bm-color-bg)]">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-6 w-56 animate-pulse rounded bg-[var(--bm-color-surface-muted)]" />
        <div className="h-12 w-full animate-pulse rounded bg-[var(--bm-card-bg)]" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-[var(--bm-card-bg)]" />
      </div>
    </div>
  );
}
