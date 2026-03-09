"use client";

import { useMemo, useState } from "react";
import { onboardingSteps } from "@/lib/data/onboarding";
import { phases } from "@/lib/data/phases";

const tabs = [
  { id: "onboarding", label: "Onboarding" },
  { id: "modules", label: "Módulos" },
  { id: "datamap", label: "Data Map" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function FlowDesignerPage() {
  const [tab, setTab] = useState<TabId>("onboarding");
  const [activeStep, setActiveStep] = useState(0);
  const [activePhase, setActivePhase] = useState(0);

  const questionStats = useMemo(() => {
    const onboardingCount = onboardingSteps.reduce((acc, step) => acc + step.questions.length, 0);
    const phaseUnlockCount = phases.reduce((acc, phase) => acc + phase.unlockQuestions.length, 0);
    const moduleCount = phases.reduce((acc, phase) => acc + phase.modules.length, 0);
    const moduleQuestionCount = phases.reduce(
      (acc, phase) => acc + phase.modules.reduce((moduleAcc, mod) => moduleAcc + mod.preQuestions.length, 0),
      0,
    );

    return {
      onboardingCount,
      phaseUnlockCount,
      moduleCount,
      moduleQuestionCount,
      total: onboardingCount + phaseUnlockCount + moduleQuestionCount,
    };
  }, []);

  const currentPhase = phases[activePhase] ?? phases[0];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">System Flow</p>
          <h2 className="text-2xl font-light text-white">Preguntas, Módulos y Flujo de Datos</h2>
        </div>

        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs transition ${
                tab === item.id ? "bg-zinc-800 text-yellow-300" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Onboarding" value={questionStats.onboardingCount} />
        <Stat label="Preguntas de fase" value={questionStats.phaseUnlockCount} />
        <Stat label="Preguntas por módulo" value={questionStats.moduleQuestionCount} />
        <Stat label="Total preguntas" value={questionStats.total} highlight />
        <Stat label="Módulos" value={questionStats.moduleCount} />
      </div>

      {tab === "onboarding" && (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <p className="mb-3 px-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Pasos</p>
            <div className="space-y-1">
              {onboardingSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                    activeStep === idx
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
                >
                  <span>{step.name}</span>
                  <span className="text-xs text-zinc-500">{step.questions.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="mb-4 text-lg font-medium text-white">{onboardingSteps[activeStep]?.name}</h3>
            <div className="space-y-3">
              {onboardingSteps[activeStep]?.questions.map((question) => (
                <div key={question.key} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-zinc-200">{question.q}</p>
                    <span className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
                      {question.type}
                    </span>
                  </div>
                  {question.options && (
                    <div className="flex flex-wrap gap-1.5">
                      {question.options.map((opt) => (
                        <span
                          key={opt}
                          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "modules" && (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <p className="mb-3 px-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Fases</p>
            <div className="space-y-1">
              {phases.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(idx)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    activePhase === idx
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{phase.phase}</span>
                    <span className="text-xs text-zinc-500">{phase.modules.length}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{phase.title}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="mb-1 text-lg font-medium text-white">{currentPhase?.title}</h3>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-zinc-500">{currentPhase?.phase}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {currentPhase?.modules.map((module) => (
                <article key={module.key} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                  <h4 className="text-sm font-medium text-zinc-100">{module.name}</h4>
                  <p className="mt-1 text-xs text-zinc-500">{module.description || module.aiGenerates}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Preguntas: {module.preQuestions.length}</span>
                    <span className="font-mono text-zinc-500">{module.key}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "datamap" && (
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <FlowRow title="1. Onboarding Global" body="Respuestas fundacionales de marca (una sola vez)." />
          <FlowRow title="2. Context Engine" body="Combina onboarding + personalidad + respuestas por módulo." />
          <FlowRow title="3. Generación" body="IA genera outputs por módulo con dependencias contextuales." />
          <FlowRow title="4. Persistencia" body="Se guarda en Supabase por brand/module para edición y versionado." />
          <FlowRow title="5. Preview + Export" body="Render HTML/markdown, edición inline y salida a PDF/share." />
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-2xl font-light ${highlight ? "text-yellow-300" : "text-white"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">{label}</p>
    </div>
  );
}

function FlowRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <p className="text-sm font-medium text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{body}</p>
    </div>
  );
}
