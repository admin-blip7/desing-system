const planPhases = [
  {
    id: 0,
    title: "Setup & Infraestructura",
    status: "done",
    progress: "85%",
  },
  {
    id: 1,
    title: "Selector de Personalidad + Onboarding",
    status: "in_progress",
    progress: "75%",
  },
  {
    id: 2,
    title: "Vista de Marca + Sistema de Módulos",
    status: "in_progress",
    progress: "55%",
  },
  {
    id: 3,
    title: "Integración con IA",
    status: "in_progress",
    progress: "50%",
  },
  {
    id: 4,
    title: "Previews en Vivo + Editor",
    status: "in_progress",
    progress: "60%",
  },
  {
    id: 5,
    title: "Exportación",
    status: "pending",
    progress: "35%",
  },
  {
    id: 6,
    title: "Expandir módulos (fases 2-7)",
    status: "pending",
    progress: "20%",
  },
  {
    id: 7,
    title: "Polish, Deploy y Lanzamiento",
    status: "pending",
    progress: "20%",
  },
];

export default function WorkspaceDevPlanPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Execution Plan</p>
        <h2 className="text-2xl font-light text-white">Seguimiento de construcción</h2>
        <p className="mt-2 text-sm text-zinc-400">Corte actual basado en `brand-manual-dev-plan.jsx` versus implementación real.</p>
      </div>

      <div className="space-y-3">
        {planPhases.map((phase) => (
          <article key={phase.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Fase {phase.id}</p>
                <h3 className="text-base text-white">{phase.title}</h3>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-medium uppercase tracking-[0.12em] ${
                    phase.status === "done"
                      ? "text-emerald-300"
                      : phase.status === "in_progress"
                        ? "text-yellow-300"
                        : "text-zinc-400"
                  }`}
                >
                  {phase.status.replace("_", " ")}
                </p>
                <p className="text-sm text-zinc-200">{phase.progress}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
