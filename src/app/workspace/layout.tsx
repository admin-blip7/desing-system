import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/workspace", label: "Workspace" },
  { href: "/workspace/dev-plan", label: "Dev Plan" },
  { href: "/workspace/flow-designer", label: "Flow" },
  { href: "/workspace/roadmap", label: "Roadmap" },
  { href: "/workspace/personality-lab", label: "Personality" },
  { href: "/workspace/voice-tone", label: "Voice & Tone" },
];

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--bm-card-border)] bg-[var(--bm-color-surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--bm-color-text-secondary)]">Brand Manual App</p>
            <h1 className="text-lg font-light text-[var(--bm-color-text-primary)]">Builder Workspace</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-[var(--bm-card-border)] px-3 py-1.5 text-xs text-[var(--bm-color-text-secondary)] transition-all hover:border-[var(--bm-color-accent)]/50 hover:text-[var(--bm-color-accent)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-md bg-[var(--bm-color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--bm-color-accent-contrast)] transition-all hover:brightness-110"
            >
              Onboarding
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
