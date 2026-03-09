"use client";

import Link from "next/link";
import { Bot, Layers, Route, Sparkles, Workflow } from "lucide-react";
import { usePathname } from "next/navigation";

const cards = [
  {
    slug: "dev-plan",
    title: "Dev Plan",
    desc: "Plan de ejecución por fases, pasos técnicos y entregables.",
    icon: Layers,
  },
  {
    slug: "flow-designer",
    title: "Flow Designer",
    desc: "Mapa completo de onboarding, preguntas por fase y dependencias.",
    icon: Workflow,
  },
  {
    slug: "roadmap",
    title: "Roadmap v2",
    desc: "Vista macro de fases y módulos para construir el manual completo.",
    icon: Route,
  },
  {
    slug: "personality-lab",
    title: "Personality Lab",
    desc: "Explora y compara personalidades para arrancar cada marca.",
    icon: Sparkles,
  },
  {
    slug: "brand-generation",
    title: "Brand Generation IA",
    desc: "Pipeline multi-agente para estrategia, visual, copy y validación.",
    icon: Bot,
  },
];

export default function BrandWorkspacePage() {
  const pathname = usePathname();
  // pathname is like /dashboard/brands/[id]/workspace
  // We need to get the base path /dashboard/brands/[id]/workspace/
  const basePath = pathname;

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--bm-color-text-secondary)]">
          Build Console
        </p>
        <h2 className="text-3xl font-light text-[var(--bm-color-text-primary)]">
          Prototipos Integrados
        </h2>
        <p className="max-w-3xl text-sm text-[var(--bm-color-text-secondary)]">
          Esta sección conecta los archivos de prototipo con rutas reales para seguir construcción
          incremental, sin perder diseño ni estructura funcional.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.slug}
              href={`${basePath}/${card.slug}`}
              className="group rounded-xl border border-[var(--bm-card-border)] bg-[var(--bm-color-surface-muted)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--bm-color-accent)]/40"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-surface)] p-2 text-[var(--bm-color-text-secondary)] group-hover:text-[var(--bm-color-accent)]">
                  <Icon size={16} />
                </div>
                <h3 className="text-lg font-medium text-[var(--bm-color-text-primary)]">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--bm-color-text-secondary)]">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
