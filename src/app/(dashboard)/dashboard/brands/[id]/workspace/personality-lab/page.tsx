import { personalities } from "@/lib/data/personalities";

export default function PersonalityLabPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--bm-color-text-secondary)]">
          Personality Lab
        </p>
        <h2 className="text-2xl font-light text-[var(--bm-color-text-primary)]">
          Sistema de personalidades
        </h2>
        <p className="mt-2 text-sm text-[var(--bm-color-text-secondary)]">
          Matriz de referencia para selección base en onboarding.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personalities.map((personality) => (
          <article
            key={personality.id}
            className="rounded-xl border border-[var(--bm-color-border)] p-5"
            style={{ background: personality.cardBg }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: personality.color }}
            >
              {personality.archetype}
            </p>
            <h3 className="mt-1 text-xl font-light text-white">{personality.name}</h3>
            <p className="mt-2 text-sm text-zinc-300">{personality.tagline}</p>
            <p className="mt-3 text-xs text-zinc-400">{personality.philosophy}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {personality.ideal.slice(0, 3).map((ideal) => (
                <span
                  key={ideal}
                  className="rounded-full border border-zinc-700 bg-zinc-900/70 px-2 py-0.5 text-[10px] text-zinc-300"
                >
                  {ideal}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
