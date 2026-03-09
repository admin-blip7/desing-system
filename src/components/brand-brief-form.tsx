"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AgentStatus = "completed" | "failed" | "skipped";

interface AgentOutputView {
  id: string;
  runId: string;
  agentKey: "strategist" | "researcher" | "designer" | "copywriter" | "validator";
  status: AgentStatus;
  createdAt: string;
}

interface BriefVersionView {
  id: string;
  version: number;
  brief: {
    brandName: string;
    industry: string;
    description: string;
    audience: string;
    goals: string[];
    personality: string[];
    competitors: string[];
  };
  createdAt: string;
}

interface SessionSnapshotView {
  session: {
    id: string;
    activeModule: string;
    status: "created" | "in_progress" | "running" | "completed" | "failed";
    currentBriefVersion: number;
    updatedAt: string;
  };
  currentBrief: BriefVersionView["brief"] | null;
  briefVersions: BriefVersionView[];
  agentOutputs: AgentOutputView[];
  latestConsistencyReport: {
    score: number;
    passed: boolean;
    contradictions: string[];
  } | null;
}

interface RunPayloadView {
  runId: string;
  consistencyScore: number;
  passedConsistency: boolean;
  contradictions: string[];
  artifacts: Record<string, unknown>;
}

interface BrandBriefFormProps {
  brandId: string;
  moduleKey?: string;
  sessionId?: string;
  className?: string;
  onSessionChange?: (snapshot: SessionSnapshotView) => void;
  onRunComplete?: (run: RunPayloadView) => void;
}

interface FormValues {
  brandName: string;
  industry: string;
  description: string;
  audience: string;
  goalsCsv: string;
  personalityCsv: string;
  competitorsCsv: string;
}

const DEFAULT_VALUES: FormValues = {
  brandName: "",
  industry: "",
  description: "",
  audience: "",
  goalsCsv: "",
  personalityCsv: "",
  competitorsCsv: "",
};

const FIELD_LABELS: Record<keyof FormValues, string> = {
  brandName: "Nombre de marca",
  industry: "Industria",
  description: "Descripción",
  audience: "Audiencia",
  goalsCsv: "Objetivos",
  personalityCsv: "Personalidad",
  competitorsCsv: "Competidores",
};

const INDUSTRY_SUGGESTIONS: Record<
  string,
  { goals: string[]; personality: string[] }
> = {
  tecnologia: {
    goals: [
      "Acelerar adopción de producto",
      "Incrementar retención premium",
      "Reducir fricción de onboarding",
      "Elevar ticket promedio",
    ],
    personality: ["Confiable", "Segura", "Rápida", "Innovadora", "Precisa"],
  },
  software: {
    goals: [
      "Escalar MRR",
      "Mejorar NPS",
      "Reducir churn",
      "Aumentar conversión trial-to-paid",
    ],
    personality: ["Confiable", "Clara", "Ágil", "Experta"],
  },
  fintech: {
    goals: ["Incrementar confianza", "Optimizar conversión", "Expandir mercado"],
    personality: ["Segura", "Sólida", "Transparente", "Rápida"],
  },
};

const formSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(1, "El nombre de marca es obligatorio."),
  industry: z.string().trim().min(1, "La industria es obligatoria."),
  description: z
    .string()
    .trim()
    .min(50, "La descripción debe tener al menos 50 caracteres."),
  audience: z
    .string()
    .trim()
    .min(1, "La audiencia es obligatoria."),
  goalsCsv: z
    .string()
    .trim()
    .min(1, "Debes agregar al menos un objetivo."),
  personalityCsv: z
    .string()
    .trim()
    .min(1, "Debes agregar al menos un rasgo de personalidad."),
  competitorsCsv: z
    .string()
    .trim()
    .min(1, "Debes agregar al menos un competidor."),
});

function parseCsvInput(value: string): string[] {
  const separators = new Set([",", ";", "\n", "\r", "\t", "|"]);
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const char of value) {
    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? null : (char as '"' | "'");
      continue;
    }

    if (!quote && separators.has(char)) {
      if (current.trim().length > 0) tokens.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim().length > 0) {
    tokens.push(current);
  }

  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const token of tokens) {
    const cleaned = token.replace(/^["']|["']$/g, "").trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(cleaned);
  }
  return normalized;
}

function appendCsvValue(current: string, value: string): string {
  const parsed = parseCsvInput(current);
  const incoming = value.trim();
  if (!incoming) return current;
  if (parsed.some((entry) => entry.toLowerCase() === incoming.toLowerCase())) {
    return parsed.join(", ");
  }
  return [...parsed, incoming].join(", ");
}

function toSignature(values: FormValues): string {
  return JSON.stringify({
    ...values,
    goalsCsv: parseCsvInput(values.goalsCsv).sort(),
    personalityCsv: parseCsvInput(values.personalityCsv).sort(),
    competitorsCsv: parseCsvInput(values.competitorsCsv).sort(),
  });
}

function normalizeForForm(brief: SessionSnapshotView["currentBrief"]): FormValues {
  if (!brief) {
    return DEFAULT_VALUES;
  }
  return {
    brandName: brief.brandName || "",
    industry: brief.industry || "",
    description: brief.description || "",
    audience: brief.audience || "",
    goalsCsv: (brief.goals || []).join(", "),
    personalityCsv: (brief.personality || []).join(", "),
    competitorsCsv: (brief.competitors || []).join(", "),
  };
}

const resolver: Resolver<FormValues> = async (values) => {
  const parsed = formSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string" && !errors[path]) {
        errors[path] = {
          type: "zod",
          message: issue.message,
        };
      }
    }
    return { values: {}, errors };
  }

  const csvChecks: Array<{
    key: keyof FormValues;
    min: number;
    message: string;
  }> = [
    { key: "goalsCsv", min: 1, message: "Debes incluir al menos un objetivo válido." },
    { key: "personalityCsv", min: 1, message: "Debes incluir al menos un rasgo válido." },
    { key: "competitorsCsv", min: 1, message: "Debes incluir al menos un competidor válido." },
  ];

  const csvErrors: Record<string, { type: string; message: string }> = {};
  for (const check of csvChecks) {
    if (parseCsvInput(values[check.key]).length < check.min) {
      csvErrors[check.key] = {
        type: "validate",
        message: check.message,
      };
    }
  }

  if (Object.keys(csvErrors).length > 0) {
    return {
      values: {},
      errors: csvErrors,
    };
  }

  return { values, errors: {} };
};

export default function BrandBriefForm({
  brandId,
  moduleKey = "geometry",
  sessionId,
  className,
  onSessionChange,
  onRunComplete,
}: BrandBriefFormProps) {
  const [snapshot, setSnapshot] = useState<SessionSnapshotView | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runPayload, setRunPayload] = useState<RunPayloadView | null>(null);
  const [rollbackVersion, setRollbackVersion] = useState<number | null>(null);
  const latestSavedSignatureRef = useRef<string>("");
  const hydratedRef = useRef(false);
  const onSessionChangeRef = useRef(onSessionChange);

  // Keep the ref in sync with the prop
  useEffect(() => {
    onSessionChangeRef.current = onSessionChange;
  }, [onSessionChange]);

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver,
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const watched = watch();
  const industryKey = watched.industry.toLowerCase();
  const industrySuggestion = useMemo(() => {
    const key = Object.keys(INDUSTRY_SUGGESTIONS).find((item) =>
      industryKey.includes(item)
    );
    return key ? INDUSTRY_SUGGESTIONS[key] : INDUSTRY_SUGGESTIONS.tecnologia;
  }, [industryKey]);

  const updateSnapshot = useCallback(
    (next: SessionSnapshotView) => {
      setSnapshot(next);
      onSessionChangeRef.current?.(next);
    },
    [] // Empty deps - we use the ref instead of the prop directly
  );

  const toSavePayload = useCallback(
    (values: FormValues) => ({
      brandName: values.brandName,
      industry: values.industry,
      description: values.description,
      audience: values.audience,
      goals: parseCsvInput(values.goalsCsv),
      personality: parseCsvInput(values.personalityCsv),
      competitors: parseCsvInput(values.competitorsCsv),
    }),
    []
  );

  const createOrLoadSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      if (sessionId) {
        const existingResponse = await fetch(`/api/sessions?sessionId=${sessionId}`, {
          method: "GET",
        });

        if (existingResponse.ok) {
          const payload = await existingResponse.json();
          const loaded = payload.session as SessionSnapshotView;
          updateSnapshot(loaded);
          reset(normalizeForForm(loaded.currentBrief));
          latestSavedSignatureRef.current = toSignature(normalizeForForm(loaded.currentBrief));
          hydratedRef.current = true;
          return;
        }
      }

      const createResponse = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          brandId,
          moduleKey,
        }),
      });

      const payload = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(payload?.error || "No se pudo iniciar la sesión.");
      }

      const loaded = payload.session as SessionSnapshotView;
      updateSnapshot(loaded);
      const normalized = normalizeForForm(loaded.currentBrief);
      reset(normalized);
      latestSavedSignatureRef.current = toSignature(normalized);
      hydratedRef.current = true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar sesión.");
    } finally {
      setIsLoadingSession(false);
    }
  }, [brandId, moduleKey, sessionId]); // Removed updateSnapshot and reset from deps to prevent infinite loop

  // Use a ref to track if we've already loaded
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void createOrLoadSession();
  }, [createOrLoadSession]);

  useEffect(() => {
    if (!hydratedRef.current || !snapshot) return;

    const signature = toSignature(watched);
    if (signature === latestSavedSignatureRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        setIsSaving(true);
        const response = await fetch("/api/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "saveBrief",
            sessionId: snapshot.session.id,
            moduleKey,
            source: "autosave",
            brief: toSavePayload(watched),
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Auto-save falló.");
        }

        const next = payload.session as SessionSnapshotView;
        updateSnapshot(next);
        latestSavedSignatureRef.current = signature;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo guardar automáticamente.");
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [moduleKey, snapshot, toSavePayload, watched]); // Removed updateSnapshot from deps to prevent infinite loop

  const runGeneration = handleSubmit(async (values) => {
    if (!snapshot) return;

    setIsRunning(true);
    try {
      const saveResponse = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveBrief",
          sessionId: snapshot.session.id,
          moduleKey,
          source: "manual",
          brief: toSavePayload(values),
        }),
      });
      const savePayload = await saveResponse.json();
      if (!saveResponse.ok) {
        throw new Error(savePayload?.error || "No se pudo guardar el brief antes de ejecutar.");
      }
      updateSnapshot(savePayload.session as SessionSnapshotView);

      const runResponse = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run",
          sessionId: snapshot.session.id,
        }),
      });

      const runJson = await runResponse.json();
      if (!runResponse.ok) {
        throw new Error(runJson?.details || runJson?.error || "No se pudo ejecutar el flujo.");
      }

      const nextSession = runJson.session as SessionSnapshotView;
      updateSnapshot(nextSession);
      const run = runJson.run as RunPayloadView;
      setRunPayload(run);
      onRunComplete?.(run);
      toast.success("Flujo multi-agente completado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al ejecutar flujo.");
    } finally {
      setIsRunning(false);
    }
  });

  const rollback = async () => {
    if (!snapshot || !rollbackVersion) return;
    try {
      const response = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rollback",
          sessionId: snapshot.session.id,
          rollbackToVersion: rollbackVersion,
          moduleKey,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo hacer rollback.");
      }
      const next = payload.session as SessionSnapshotView;
      updateSnapshot(next);
      const normalized = normalizeForForm(next.currentBrief);
      reset(normalized);
      latestSavedSignatureRef.current = toSignature(normalized);
      toast.success(`Rollback aplicado a la versión ${rollbackVersion}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al hacer rollback.");
    }
  };

  const agentStatusMap = useMemo(() => {
    if (!snapshot) return new Map<string, AgentOutputView>();
    const map = new Map<string, AgentOutputView>();
    for (const row of snapshot.agentOutputs) {
      map.set(row.agentKey, row);
    }
    return map;
  }, [snapshot]);

  if (isLoadingSession) {
    return (
      <div className={`rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 ${className || ""}`}>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando sesión y brief existente...
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Brand Brief Persistente</h2>
            <p className="text-xs text-zinc-400">
              Sesión: <span className="font-mono">{snapshot?.session.id || "N/A"}</span> · Módulo activo:{" "}
              <span className="font-medium text-zinc-200">{snapshot?.session.activeModule || moduleKey}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="rounded-full border border-zinc-700 px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-zinc-300"
              aria-live="polite"
            >
              {isSaving ? "Guardando..." : "Guardado"}
            </span>

            <Button
              type="button"
              onClick={runGeneration}
              disabled={!isValid || isRunning}
              className="bg-amber-500 text-black hover:bg-amber-400"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Ejecutar flujo IA
                </>
              )}
            </Button>
          </div>
        </header>

        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void runGeneration();
          }}
        >
          {(
            [
              "brandName",
              "industry",
              "description",
              "audience",
              "goalsCsv",
              "personalityCsv",
              "competitorsCsv",
            ] as Array<keyof FormValues>
          ).map((field) => {
            const isTextArea = field === "description" || field === "audience";
            const span2 =
              field === "description" ||
              field === "audience" ||
              field === "competitorsCsv";
            const id = `brief-${field}`;

            return (
              <label
                key={field}
                htmlFor={id}
                className={`space-y-1 text-xs text-zinc-400 ${span2 ? "md:col-span-2" : ""}`}
              >
                {FIELD_LABELS[field]} *
                {isTextArea ? (
                  <textarea
                    id={id}
                    aria-invalid={errors[field] ? "true" : "false"}
                    aria-describedby={errors[field] ? `${id}-error` : undefined}
                    className="min-h-[92px] w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-amber-400"
                    {...register(field)}
                  />
                ) : (
                  <input
                    id={id}
                    aria-invalid={errors[field] ? "true" : "false"}
                    aria-describedby={errors[field] ? `${id}-error` : undefined}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-amber-400"
                    {...register(field)}
                  />
                )}
                {errors[field]?.message && (
                  <p id={`${id}-error`} className="text-xs text-rose-400">
                    {errors[field]?.message}
                  </p>
                )}
              </label>
            );
          })}
        </form>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SuggestionGroup
            title="Sugerencias de objetivos"
            options={industrySuggestion.goals}
            onSelect={(item) => setValue("goalsCsv", appendCsvValue(watch("goalsCsv"), item), { shouldValidate: true })}
          />
          <SuggestionGroup
            title="Sugerencias de personalidad"
            options={industrySuggestion.personality}
            onSelect={(item) =>
              setValue("personalityCsv", appendCsvValue(watch("personalityCsv"), item), { shouldValidate: true })
            }
          />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-zinc-100">Versionado y ejecución</h3>
          <div className="flex items-center gap-2">
            <select
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
              value={rollbackVersion ?? ""}
              onChange={(event) =>
                setRollbackVersion(
                  event.target.value ? Number(event.target.value) : null
                )
              }
              aria-label="Seleccionar versión para rollback"
            >
              <option value="">Seleccionar versión</option>
              {snapshot?.briefVersions.map((version) => (
                <option key={version.id} value={version.version}>
                  v{version.version} · {new Date(version.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              disabled={!rollbackVersion}
              onClick={rollback}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Rollback
            </Button>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-5">
          {(["strategist", "researcher", "designer", "copywriter", "validator"] as const).map(
            (agent) => {
              const state = agentStatusMap.get(agent);
              const status = state?.status || "skipped";
              const statusColor =
                status === "completed"
                  ? "text-emerald-400"
                  : status === "failed"
                    ? "text-rose-400"
                    : "text-zinc-500";

              return (
                <div
                  key={agent}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                    {agent}
                  </p>
                  <p className={`mt-1 text-xs font-medium ${statusColor}`}>{status}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {state ? new Date(state.createdAt).toLocaleTimeString() : "sin ejecución"}
                  </p>
                </div>
              );
            }
          )}
        </div>

        {snapshot?.latestConsistencyReport && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-200">
            <p>
              Consistencia:{" "}
              <span className="font-semibold">{snapshot.latestConsistencyReport.score}</span>{" "}
              ({snapshot.latestConsistencyReport.passed ? "aprobada" : "requiere ajuste"})
            </p>
            {snapshot.latestConsistencyReport.contradictions.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-300">
                {snapshot.latestConsistencyReport.contradictions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {runPayload && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
            <p className="text-xs text-zinc-400">
              Run: <span className="font-mono text-zinc-200">{runPayload.runId}</span>
            </p>
            <pre className="mt-2 max-h-[240px] overflow-auto text-xs text-zinc-300">
              {JSON.stringify(runPayload.artifacts, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}

function SuggestionGroup({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-zinc-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
