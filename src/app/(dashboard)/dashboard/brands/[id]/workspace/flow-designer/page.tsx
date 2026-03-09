"use client";

import { useMemo, useState } from "react";
import { onboardingSteps } from "@/lib/data/onboarding";
import { phases } from "@/lib/data/phases";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "onboarding", label: "Onboarding" },
  { id: "modules", label: "Módulos" },
  { id: "datamap", label: "Data Map" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface StatProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function Stat({ label, value, highlight = false }: StatProps) {
  return (
    <div>
      <p className={cn("text-2xl font-light", highlight ? "text-[var(--bm-color-accent)]" : "text-[var(--bm-color-text-primary)]")}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--bm-color-text-secondary)]">
        {label}
      </p>
    </div>
  );
}

interface FlowRowProps {
  title: string;
  body: string;
}

function FlowRow({ title, body }: FlowRowProps) {
  return (
    <div className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-surface)] p-4">
      <p className="text-sm font-medium text-[var(--bm-color-text-primary)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--bm-color-text-secondary)]">{body}</p>
    </div>
  );
}

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
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--bm-color-text-secondary)]">
            System Flow
          </p>
          <h2 className="text-2xl font-light text-[var(--bm-color-text-primary)]">
            Preguntas, Módulos y Flujo de Datos
          </h2>
        </div>

        <div className="flex rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs transition",
                tab === item.id
                  ? "bg-[var(--bm-color-surface)] text-[var(--bm-color-accent)]"
                  : "text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Onboarding" value={questionStats.onboardingCount} />
        <Stat label="Preguntas de fase" value={questionStats.phaseUnlockCount} />
        <Stat label="Preguntas por módulo" value={questionStats.moduleQuestionCount} />
        <Stat label="Total preguntas" value={questionStats.total} highlight />
        <Stat label="Módulos" value={questionStats.moduleCount} />
      </div>

      {tab === "onboarding" && (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-3">
            <p className="mb-3 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--bm-color-text-secondary)]">
              Pasos
            </p>
            <div className="space-y-1">
              {onboardingSteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
                    activeStep === idx
                      ? "bg-[var(--bm-color-surface)] text-[var(--bm-color-text-primary)]"
                      : "text-[var(--bm-color-text-secondary)] hover:bg-[var(--bm-color-surface-muted)] hover:text-[var(--bm-color-text-primary)]"
                  )}
                >
                  <span>{step.name}</span>
                  <span className="text-xs text-[var(--bm-color-text-tertiary)]">{step.questions.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-5">
            <h3 className="mb-4 text-lg font-medium text-[var(--bm-color-text-primary)]">
              {onboardingSteps[activeStep]?.name}
            </h3>
            <div className="space-y-3">
              {onboardingSteps[activeStep]?.questions.map((question) => (
                <div
                  key={question.key}
                  className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-surface)] p-3"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-[var(--bm-color-text-primary)]">{question.q}</p>
                    <span className="rounded border border-[var(--bm-color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--bm-color-text-tertiary)]">
                      {question.type}
                    </span>
                  </div>
                  {question.options && (
                    <div className="flex flex-wrap gap-1.5">
                      {question.options.map((opt) => (
                        <span
                          key={opt}
                          className="rounded border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] px-2 py-0.5 text-[10px] text-[var(--bm-color-text-secondary)]"
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
          <aside className="rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-3">
            <p className="mb-3 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--bm-color-text-secondary)]">
              Fases
            </p>
            <div className="space-y-1">
              {phases.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(idx)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition",
                    activePhase === idx
                      ? "bg-[var(--bm-color-surface)] text-[var(--bm-color-text-primary)]"
                      : "text-[var(--bm-color-text-secondary)] hover:bg-[var(--bm-color-surface-muted)] hover:text-[var(--bm-color-text-primary)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{phase.phase}</span>
                    <span className="text-xs text-[var(--bm-color-text-tertiary)]">{phase.modules.length}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--bm-color-text-tertiary)]">{phase.title}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-5">
            <h3 className="mb-1 text-lg font-medium text-[var(--bm-color-text-primary)]">
              {currentPhase?.title}
            </h3>
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[var(--bm-color-text-tertiary)]">
              {currentPhase?.phase}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {currentPhase?.modules.map((module) => (
                <article
                  key={module.key}
                  className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-surface)] p-4"
                >
                  <h4 className="text-sm font-medium text-[var(--bm-color-text-primary)]">{module.name}</h4>
                  <p className="mt-1 text-xs text-[var(--bm-color-text-tertiary)]">
                    {module.description || module.aiGenerates}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--bm-color-text-secondary)]">
                    <span>Preguntas: {module.preQuestions.length}</span>
                    <span className="font-mono text-[var(--bm-color-text-tertiary)]">{module.key}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "datamap" && (
        <div className="space-y-3 rounded-xl border border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)] p-5">
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
