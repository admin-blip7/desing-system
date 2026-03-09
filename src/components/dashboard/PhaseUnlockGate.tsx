"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question } from "@/lib/data/onboarding";
import { savePhaseUnlockAnswersAction } from "@/actions/save-phase-unlock";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TagsInput } from "@/components/ui/TagsInput";
import { getMissingRequiredQuestions, isQuestionVisible } from "@/lib/utils/question-validation";

interface PhaseUnlockGateProps {
  brandId: string;
  phaseId: number;
  phaseName: string;
  unlockQuestions: Question[];
  initialAnswers?: Record<string, string | string[]>;
}

export default function PhaseUnlockGate({
  brandId,
  phaseId,
  phaseName,
  unlockQuestions,
  initialAnswers = {},
}: PhaseUnlockGateProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [isSaving, startSaving] = useTransition();

  const visibleQuestions = useMemo(
    () => unlockQuestions.filter((question) => isQuestionVisible(question, answers)),
    [unlockQuestions, answers],
  );

  const missingRequired = useMemo(
    () => getMissingRequiredQuestions(unlockQuestions, answers, { requireAll: true }),
    [unlockQuestions, answers],
  );

  if (unlockQuestions.length === 0) {
    return null;
  }

  const updateAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const saveAnswers = () => {
    startSaving(async () => {
      const result = await savePhaseUnlockAnswersAction(brandId, phaseId, answers);
      if (!result.success) {
        toast.error(result.error || "No se pudieron guardar las respuestas de fase.");
        return;
      }

      toast.success("Fase validada y guardada.");
      router.refresh();
    });
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Gate de fase</p>
          <h3 className="mt-1 text-sm font-medium text-zinc-100">Preguntas de desbloqueo para {phaseName}</h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${
            missingRequired.length === 0
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/40 bg-amber-500/10 text-amber-300"
          }`}
        >
          {missingRequired.length === 0 ? "Desbloqueada" : "Bloqueada"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {visibleQuestions.map((question) => (
          <QuestionField
            key={question.key}
            question={question}
            value={answers[question.key]}
            onChange={(value) => updateAnswer(question.key, value)}
          />
        ))}
      </div>

      {missingRequired.length > 0 && (
        <p className="mt-4 text-xs text-amber-300">
          Completa los campos obligatorios para desbloquear esta fase.
        </p>
      )}

      <div className="mt-5">
        <button
          onClick={saveAnswers}
          disabled={isSaving}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar respuestas de fase"}
        </button>
      </div>
    </section>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (next: string | string[]) => void;
}) {
  const commonClassName =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-yellow-500";

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <label className="block text-sm text-zinc-200">
        {question.q} {question.required && <span className="text-rose-400">*</span>}
      </label>

      <div className="mt-3">
        {question.type === "textarea" && (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className={`${commonClassName} min-h-[88px]`}
          />
        )}

        {(question.type === "text" || question.type === "file" || question.type === "conditional") && (
          <input
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className={commonClassName}
          />
        )}

        {question.type === "select" && (
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className={commonClassName}
          >
            <option value="">Selecciona una opción</option>
            {(question.options || []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {question.type === "multi-select" && (
          <MultiSelect
            options={question.options || []}
            selected={Array.isArray(value) ? value : []}
            onChange={(next) => onChange(next)}
          />
        )}

        {question.type === "tags" && (
          <TagsInput
            tags={Array.isArray(value) ? value : []}
            onChange={(next) => onChange(next)}
            placeholder={question.example}
          />
        )}

        {question.type === "range" && (
          <input
            type="range"
            value={typeof value === "string" || typeof value === "number" ? String(value) : "0"}
            onChange={(event) => onChange(event.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-yellow-500"
          />
        )}
      </div>
    </div>
  );
}
