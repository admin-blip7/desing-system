import Link from "next/link";
import { Layers, Route, Sparkles, Workflow } from "lucide-react";

const cards = [
  {
    href: "/workspace/dev-plan",
    title: "Dev Plan",
    desc: "Plan de ejecución por fases, pasos técnicos y entregables.",
    icon: Layers,
  },
  {
    href: "/workspace/flow-designer",
    title: "Flow Designer",
    desc: "Mapa completo de onboarding, preguntas por fase y dependencias.",
    icon: Workflow,
  },
  {
    href: "/workspace/roadmap",
    title: "Roadmap v2",
    desc: "Vista macro de fases y módulos para construir el manual completo.",
    icon: Route,
  },
  {
    href: "/workspace/personality-lab",
    title: "Personality Lab",
    desc: "Explora y compara personalidades para arrancar cada marca.",
    icon: Sparkles,
  },
];

export default function WorkspaceHomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Build Console</p>
        <h2 className="text-3xl font-light text-white">Prototipos Integrados en la App</h2>
        <p className="max-w-3xl text-sm text-zinc-400">
          Esta sección conecta los archivos de prototipo con rutas reales de Next.js para seguir construcción
          incremental, sin perder diseño ni estructura funcional.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:-translate-y-0.5 hover:border-yellow-500/40"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 group-hover:text-yellow-300">
                  <Icon size={16} />
                </div>
                <h3 className="text-lg font-medium text-white">{card.title}</h3>
              </div>
              <p className="text-sm text-zinc-400">{card.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
