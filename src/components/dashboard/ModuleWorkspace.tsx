"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateModuleContentAction } from "@/actions/update-module-content";
import ModuleRenderer from "@/components/previews/ModuleRenderer";
import { Question } from "@/lib/data/onboarding";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TagsInput } from "@/components/ui/TagsInput";
import { ModuleStatus } from "@/lib/types/module";
import { saveModuleAnswersAction } from "@/actions/save-module-answers";
import { useStreamGeneration } from "@/hooks/useStreamGeneration";
import { cn } from "@/lib/utils";

interface ModuleWorkspaceProps {
  brandId: string;
  moduleKey: string;
  moduleName: string;
  moduleDescription: string;
  initialStatus: ModuleStatus;
  initialContent: unknown;
  initialAnswers: Record<string, string | string[]>;
  preQuestions: Question[];
  dependencies: { name: string; status: string }[];
  phaseGate?: {
    phaseName: string;
    missingQuestions: string[];
  };
  currentUserLabel: string;
}

interface VersionEntry {
  version: number;
  savedAt: string;
  content: unknown;
  author?: string;
  note?: string;
}

interface VersionEnvelope {
  __payload: unknown;
  __history?: VersionEntry[];
  __version?: number;
}

export default function ModuleWorkspace({
  brandId,
  moduleKey,
  moduleName,
  moduleDescription,
  initialStatus,
  initialContent,
  initialAnswers,
  preQuestions,
  dependencies,
  phaseGate,
  currentUserLabel,
}: ModuleWorkspaceProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ModuleStatus>(initialStatus);
  const [content, setContent] = useState<unknown>(initialContent);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [editorContent, setEditorContent] = useState(
    toContentString(unwrapContentEnvelope(initialContent)),
  );
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const { run, events: streamEvents, isRunning: isStreaming } = useStreamGeneration();
  const [versionHistory, setVersionHistory] = useState<VersionEntry[]>(extractHistory(initialContent));
  const [currentVersion, setCurrentVersion] = useState<number>(extractVersion(initialContent));
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<number | null>(null);
  const [changeNote, setChangeNote] = useState("");
  const [historyWindow, setHistoryWindow] = useState<"all" | "7d" | "30d">("all");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyReferenceNow] = useState(() => Date.now());

  // Collapsible sections state - reduces visual overload
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [isDiffCollapsed, setIsDiffCollapsed] = useState(true);

  const blockedDependencies = useMemo(
    () => dependencies.filter((item) => item.status !== "completed"),
    [dependencies],
  );

  const isBlocked = blockedDependencies.length > 0;
  const isPhaseLocked = Boolean(phaseGate && phaseGate.missingQuestions.length > 0);

  // Unsaved answers indicator - reduces friction by showing pending changes
  const hasUnsavedAnswers = useMemo(() => {
    return JSON.stringify(answers) !== JSON.stringify(initialAnswers);
  }, [answers, initialAnswers]);

  // Unsaved editor changes indicator
  const hasUnsavedEditorChanges = useMemo(() => {
    const currentContent = toContentString(unwrapContentEnvelope(content));
    return editorContent !== currentContent;
  }, [editorContent, content]);

  // Simplified progress - shows only user-relevant states
  const progress = useMemo(() => {
    const stepsOrder = ["context", "generation", "result"];
    const hasError = streamEvents.some((event) => event.type === "error");
    if (hasError) return 0;

    const hasResult = streamEvents.some((event) => event.type === "result");
    if (hasResult) return 100;

    const lastStatusEvent = [...streamEvents].reverse().find((event) => event.type === "status");
    const currentStep = String(lastStatusEvent?.step || "");
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex === -1) return isStreaming ? 10 : 0;
    return Math.min(90, 20 + currentIndex * 35);
  }, [streamEvents, isStreaming]);

  // Simplified timeline - removes technical noise
  const simplifiedProgress = useMemo(() => {
    const steps = [
      { key: "preparing", label: "Preparando contexto" },
      { key: "generating", label: "Generando contenido" },
      { key: "finalizing", label: "Finalizando" },
    ];

    const currentIndex = steps.findIndex(s =>
      streamEvents.some((e) => e.type === "status" && String(e.step) === s.key)
    );

    return { steps, currentIndex, hasResult: streamEvents.some(e => e.type === "result") };
  }, [streamEvents]);

  const selectedVersionEntry = useMemo(
    () => versionHistory.find((entry) => entry.version === selectedHistoryVersion) || null,
    [versionHistory, selectedHistoryVersion],
  );

  const filteredHistory = useMemo(() => {
    const windowMs =
      historyWindow === "7d" ? 7 * 24 * 60 * 60 * 1000 : historyWindow === "30d" ? 30 * 24 * 60 * 60 * 1000 : null;
    const query = historyQuery.trim().toLowerCase();

    return versionHistory.filter((entry) => {
      if (windowMs !== null) {
        const savedAtMs = new Date(entry.savedAt).getTime();
        if (!Number.isFinite(savedAtMs) || historyReferenceNow - savedAtMs > windowMs) {
          return false;
        }
      }

      if (!query) return true;
      const note = (entry.note || "").toLowerCase();
      const author = (entry.author || "").toLowerCase();
      return note.includes(query) || author.includes(query) || `v${entry.version}`.includes(query);
    });
  }, [versionHistory, historyWindow, historyQuery, historyReferenceNow]);

  const diffRows = useMemo(() => {
    if (!selectedVersionEntry) return [];
    return buildLineDiff(toContentString(selectedVersionEntry.content), editorContent).slice(0, 240);
  }, [selectedVersionEntry, editorContent]);

  // Auto-save answers implicitly before generating - reduces friction
  const onGenerate = () => {
    if (isBlocked) {
      toast.error("Completa primero los módulos dependientes.");
      return;
    }

    if (isPhaseLocked) {
      toast.error("Esta fase sigue bloqueada. Completa y guarda las preguntas de desbloqueo.");
      return;
    }

    startGenerating(async () => {
      // Implicitly save answers before generating
      const saveAnswersResult = await saveModuleAnswersAction(brandId, moduleKey, answers);
      if (!saveAnswersResult.success) {
        toast.error(saveAnswersResult.error || "No se pudieron guardar las respuestas del módulo.");
        return;
      }

      setStatus("generating");
      const result = (await run(brandId, moduleKey)) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        setStatus("error");
        toast.error(result.error || "Error al generar módulo");
        return;
      }

      setStatus("completed");
      setContent(result.data);
      setEditorContent(toContentString(unwrapContentEnvelope(result.data)));
      setVersionHistory(extractHistory(result.data));
      setCurrentVersion(extractVersion(result.data));
      toast.success("Módulo generado");
      router.refresh();
    });
  };

  const onSave = () => {
    startSaving(async () => {
      const previousPayload = unwrapContentEnvelope(content);
      const nextVersion = currentVersion + 1;
      const nextHistory: VersionEntry[] = [
        {
          version: currentVersion,
          savedAt: new Date().toISOString(),
          content: previousPayload,
          author: currentUserLabel,
          note: changeNote.trim() || undefined,
        },
        ...versionHistory,
      ].slice(0, 20);

      const envelope: VersionEnvelope = {
        __payload: editorContent,
        __history: nextHistory,
        __version: nextVersion,
      };

      const result = await updateModuleContentAction(brandId, moduleKey, envelope);
      if (!result.success) {
        toast.error(result.error || "No se pudo guardar");
        return;
      }

      setContent(envelope);
      setVersionHistory(nextHistory);
      setCurrentVersion(nextVersion);
      setChangeNote("");
      toast.success(`Contenido guardado (v${nextVersion})`);
      router.refresh();
    });
  };

  // Manual save answers - kept for explicit user control
  const onSaveAnswers = () => {
    startSaving(async () => {
      const result = await saveModuleAnswersAction(brandId, moduleKey, answers);
      if (!result.success) {
        toast.error(result.error || "No se pudieron guardar las respuestas.");
        return;
      }

      toast.success("Respuestas del módulo guardadas");
    });
  };

  const updateAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Confirm before restoring - prevents accidental data loss
  const onRestoreVersion = (entry: VersionEntry) => {
    if (hasUnsavedEditorChanges) {
      if (!confirm(`Tienes cambios sin guardar en el editor. ¿Restaurar la versión v${entry.version}? Los cambios actuales se perderán.`)) {
        return;
      }
    }
    setEditorContent(toContentString(entry.content));
    toast.success(`Versión v${entry.version} cargada al editor`);
  };

  // Status badge with improved visual hierarchy
  const statusBadgeConfig = useMemo(() => {
    switch (status) {
      case "completed":
        return {
          className: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: CheckCircle2,
        };
      case "generating":
        return {
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse",
          icon: Loader2,
        };
      case "error":
        return {
          className: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          icon: AlertCircle,
        };
      default:
        return {
          className: "bg-zinc-800 border-zinc-700 text-zinc-400",
          icon: null,
        };
    }
  }, [status]);

  const StatusIcon = statusBadgeConfig.icon;

  return (
    <div className="space-y-4">
      {/* Header Section - Primary section with more prominence */}
      <section className="module-section module-section-primary">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--bm-color-text-primary)]">
              {moduleName}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--bm-color-text-secondary)] max-w-3xl">
              {moduleDescription}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium uppercase tracking-wider",
            statusBadgeConfig.className
          )}>
            {StatusIcon && <StatusIcon className="w-4 h-4" />}
            {status === "completed" ? "Completado" :
             status === "generating" ? "Generando" :
             status === "error" ? "Error" : status}
          </div>
        </div>
      </section>

      {/* Dependencies Section - Secondary section, more compact */}
      {dependencies.length > 0 && (
        <section className="module-section module-section-secondary">
          <p className="module-section-label">Dependencias</p>
          <div className="flex flex-wrap gap-2">
            {dependencies.map((dep) => (
              <span
                key={dep.name}
                className={cn(
                  "module-dependency-badge",
                  dep.status === "completed"
                    ? "module-dependency-badge--completed"
                    : "module-dependency-badge--pending"
                )}
              >
                <span className={cn(
                  "module-dependency-dot",
                  dep.status === "completed"
                    ? "module-dependency-dot--completed"
                    : "module-dependency-dot--pending"
                )} />
                {dep.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Phase Gate Alert - More urgent visual design */}
      {phaseGate && phaseGate.missingQuestions.length > 0 && (
        <section className="module-section module-section-alert rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--bm-color-warning)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--bm-color-warning)]">
                Fase bloqueada: {phaseGate.phaseName}
              </p>
              <p className="mt-1 text-sm text-[var(--bm-color-text-secondary)]">
                Completa estas preguntas antes de continuar:
              </p>
              <ul className="mt-2 space-y-1">
                {phaseGate.missingQuestions.map((question) => (
                  <li
                    key={question}
                    className="text-xs text-[var(--bm-color-text-secondary)] pl-4 border-l-2 border-[var(--bm-color-warning)]/30"
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Questions Section - Primary section, main interactive area */}
      <section className="module-section module-section-primary">
        <p className="module-section-label">Preguntas del módulo</p>

        {preQuestions.length === 0 ? (
          <p className="text-sm text-[var(--bm-color-text-secondary)] py-4">
            Este módulo se puede generar solo con contexto previo. Puedes generarlo directamente.
          </p>
        ) : (
          <div className="space-y-4">
            {preQuestions.map((question) => (
              <QuestionField
                key={question.key}
                question={question}
                value={answers[question.key]}
                onChange={(value) => updateAnswer(question.key, value)}
              />
            ))}
          </div>
        )}

        {/* Action buttons grouped to reduce visual clutter */}
        <div className="module-actions-group mt-6">
          {/* Primary action - Generate */}
          <button
            onClick={onGenerate}
            disabled={isGenerating || isStreaming || isBlocked || isPhaseLocked}
            className={cn(
              "flex-1 min-h-[44px] px-6 py-2.5 rounded-lg font-semibold text-sm transition-all",
              "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]",
              "hover:brightness-110 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            )}
          >
            {isGenerating || isStreaming ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </span>
            ) : status === "completed" ? (
              "Regenerar con IA"
            ) : (
              "Generar con IA"
            )}
          </button>

          {/* Secondary actions */}
          <div className="flex gap-2">
            <button
              onClick={onSaveAnswers}
              disabled={isSaving}
              className={cn(
                "module-touch-target px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                "bg-[var(--bm-button-secondary-bg)] text-[var(--bm-button-secondary-text)]",
                "border border-[var(--bm-button-secondary-border)]",
                "hover:bg-[var(--bm-color-surface-muted)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                hasUnsavedAnswers && "ring-2 ring-[var(--bm-color-accent)]/50"
              )}
            >
              {hasUnsavedAnswers ? "Guardar respuestas*" : "Guardar respuestas"}
            </button>

            {/* Only show when content exists - reduces visual noise */}
            {status === "completed" && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className={cn(
                  "module-touch-target px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  "bg-[var(--bm-button-secondary-bg)] text-[var(--bm-button-secondary-text)]",
                  "border border-[var(--bm-button-secondary-border)]",
                  "hover:bg-[var(--bm-color-surface-muted)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  hasUnsavedEditorChanges && "ring-2 ring-[var(--bm-color-accent)]/50"
                )}
              >
                <Save className="w-4 h-4" />
                {hasUnsavedEditorChanges ? "Guardar cambios*" : "Guardar"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Simplified Progress Section - Only during generation */}
      {streamEvents.length > 0 && (
        <section className="module-section module-section-secondary">
          <div className="flex items-center justify-between mb-4">
            <p className="module-section-label">Progreso de generación</p>
            <span className="text-xs text-[var(--bm-color-text-secondary)]">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bm-color-surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--bm-color-accent)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Simplified step indicators - shows user-friendly states */}
          <div className="mt-4 flex items-center gap-2">
            {simplifiedProgress.steps.map((step, index) => {
              const isActive = index === simplifiedProgress.currentIndex;
              const isCompleted = index < simplifiedProgress.currentIndex || simplifiedProgress.hasResult;

              return (
                <div
                  key={step.key}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    isActive && "bg-[var(--bm-color-accent-muted)] text-[var(--bm-color-accent)]",
                    isCompleted && !isActive && "bg-[var(--bm-color-success)]/10 text-[var(--bm-color-success)]",
                    !isActive && !isCompleted && "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : (
                    isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                    )
                  )}
                  {step.label}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Content Section - Only shows when completed */}
      {status === "completed" && (
        <section className="space-y-4">
          <ModuleRenderer moduleName={moduleName} content={unwrapContentEnvelope(content)} />

          {/* Quick Editor Section */}
          <div className="module-section">
            <div className="flex items-center justify-between mb-3">
              <p className="module-section-label">Editor rápido · v{currentVersion}</p>
              {hasUnsavedEditorChanges && (
                <span className="text-xs text-[var(--bm-color-accent)]">Tienes cambios sin guardar</span>
              )}
            </div>
            <textarea
              value={editorContent}
              onChange={(event) => setEditorContent(event.target.value)}
              className="module-input min-h-[260px] rounded-[var(--bm-radius-md)] p-4 font-mono text-sm"
            />

            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs text-[var(--bm-color-text-secondary)]">
                  Nota de cambio (opcional)
                </label>
                <input
                  value={changeNote}
                  onChange={(event) => setChangeNote(event.target.value)}
                  placeholder="Ej: Ajuste de tono y estructura del módulo"
                  className="module-input rounded-[var(--bm-radius-md)] px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={onSave}
                disabled={isSaving}
                className={cn(
                  "module-touch-target self-end px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
                  "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]",
                  "hover:brightness-110 active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>

          {/* Version History - Collapsed by default to reduce visual overload */}
          {versionHistory.length > 0 && (
            <div className="module-section module-section-secondary">
              <button
                onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                className="module-collapsible-trigger w-full"
              >
                <ChevronDown className={cn(
                  "module-collapsible-icon",
                  !isHistoryCollapsed && "rotate-180"
                )} />
                <span className="module-section-label">Historial de versiones</span>
                <span className="text-xs text-[var(--bm-color-text-secondary)]">
                  ({filteredHistory.length} {filteredHistory.length === 1 ? "versión" : "versiones"})
                </span>
              </button>

              <div className={cn(
                "module-collapsible",
                isHistoryCollapsed && "module-collapsible--collapsed"
              )}>
                <div className="pt-4 space-y-4">
                  {/* Filters */}
                  <div className="grid gap-2 md:grid-cols-[160px_1fr]">
                    <select
                      value={historyWindow}
                      onChange={(event) => setHistoryWindow(event.target.value as "all" | "7d" | "30d")}
                      className="module-input rounded-[var(--bm-radius-md)] px-3 py-2 text-sm"
                    >
                      <option value="all">Todo el historial</option>
                      <option value="7d">Últimos 7 días</option>
                      <option value="30d">Últimos 30 días</option>
                    </select>
                    <input
                      value={historyQuery}
                      onChange={(event) => setHistoryQuery(event.target.value)}
                      placeholder="Buscar por nota, autor o versión"
                      className="module-input rounded-[var(--bm-radius-md)] px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Version list */}
                  <div className="space-y-2">
                    {filteredHistory.map((entry, index) => (
                      <div
                        key={`${entry.version}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-bg)] px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[var(--bm-color-text-primary)]">
                              v{entry.version}
                            </p>
                            {entry.version === currentVersion && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bm-color-accent-muted)] text-[var(--bm-color-accent)]">
                                Actual
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--bm-color-text-secondary)] mt-0.5">
                            {new Date(entry.savedAt).toLocaleString()}
                          </p>
                          {(entry.author || entry.note) && (
                            <p className="text-xs text-[var(--bm-color-text-secondary)] mt-1">
                              {entry.author && <span>por {entry.author}</span>}
                              {entry.author && entry.note && <span> · </span>}
                              {entry.note && <span className="italic">"{entry.note}"</span>}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRestoreVersion(entry)}
                          className="module-touch-target ml-3 px-3 py-1.5 rounded-md text-sm font-medium transition-all border border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
                        >
                          Restaurar
                        </button>
                      </div>
                    ))}
                    {filteredHistory.length === 0 && (
                      <p className="text-sm text-[var(--bm-color-text-secondary)] text-center py-4">
                        No hay versiones para ese filtro.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Version Diff - Collapsed by default */}
          <div className="module-section module-section-secondary">
            <button
              onClick={() => setIsDiffCollapsed(!isDiffCollapsed)}
              className="module-collapsible-trigger w-full"
            >
              <ChevronDown className={cn(
                "module-collapsible-icon",
                !isDiffCollapsed && "rotate-180"
              )} />
              <span className="module-section-label">Comparar versiones</span>
            </button>

            <div className={cn(
              "module-collapsible",
              isDiffCollapsed && "module-collapsible--collapsed"
            )}>
              <div className="pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm text-[var(--bm-color-text-secondary)]">
                    Comparar contra versión:
                  </label>
                  <select
                    value={selectedHistoryVersion ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSelectedHistoryVersion(value ? Number(value) : null);
                    }}
                    className="module-input rounded-[var(--bm-radius-md)] px-3 py-2 text-sm min-w-[200px]"
                  >
                    <option value="">Seleccionar…</option>
                    {filteredHistory.map((entry) => (
                      <option key={entry.version} value={entry.version}>
                        v{entry.version} · {new Date(entry.savedAt).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedVersionEntry && (
                  <div className="mt-4 max-h-72 overflow-auto rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-bg)] p-3">
                    {diffRows.length === 0 ? (
                      <p className="text-sm text-[var(--bm-color-text-secondary)] text-center py-4">
                        Sin cambios detectados.
                      </p>
                    ) : (
                      diffRows.map((row, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "font-mono text-xs leading-6",
                            row.type === "added" && "bg-emerald-500/10 text-emerald-400",
                            row.type === "removed" && "bg-rose-500/10 text-rose-400",
                            row.type === "same" && "text-[var(--bm-color-text-secondary)]"
                          )}
                        >
                          <span className="mr-3 inline-block w-5 text-center select-none">
                            {row.type === "added" ? "+" : row.type === "removed" ? "-" : " "}
                          </span>
                          {row.line}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-color-bg)] p-4">
      <label className="mb-3 block text-sm font-medium text-[var(--bm-color-text-primary)]">
        {question.q}
      </label>

      {question.type === "text" && (
        <input
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
          className="module-input rounded-[var(--bm-radius-md)] px-3 py-2.5 text-sm"
          placeholder={question.example}
        />
      )}

      {question.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
          className="module-input min-h-24 rounded-[var(--bm-radius-md)] px-3 py-2.5 text-sm"
          placeholder={question.example}
        />
      )}

      {question.type === "select" && (
        <select
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
          className="module-input rounded-[var(--bm-radius-md)] px-3 py-2.5 text-sm"
        >
          <option value="">Selecciona una opción</option>
          {question.options?.map((option) => (
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

      {question.type === "file" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
          className="module-input rounded-[var(--bm-radius-md)] px-3 py-2.5 text-sm"
          placeholder="URL o referencia del archivo"
        />
      )}
    </div>
  );
}

function unwrapContentEnvelope(content: unknown): unknown {
  if (content && typeof content === "object" && "__payload" in (content as Record<string, unknown>)) {
    return (content as VersionEnvelope).__payload;
  }

  return content;
}

function extractHistory(content: unknown): VersionEntry[] {
  if (content && typeof content === "object" && "__history" in (content as Record<string, unknown>)) {
    const history = (content as VersionEnvelope).__history;
    return Array.isArray(history) ? history : [];
  }
  return [];
}

function extractVersion(content: unknown): number {
  if (content && typeof content === "object" && "__version" in (content as Record<string, unknown>)) {
    const version = (content as VersionEnvelope).__version;
    if (typeof version === "number" && Number.isFinite(version)) {
      return version;
    }
  }
  return 1;
}

function toContentString(content: unknown): string {
  return typeof content === "string" ? content : JSON.stringify(content ?? "", null, 2);
}

function buildLineDiff(previous: string, current: string): Array<{ type: "same" | "added" | "removed"; line: string }> {
  const previousLines = previous.split("\n");
  const currentLines = current.split("\n");
  const max = Math.max(previousLines.length, currentLines.length);
  const rows: Array<{ type: "same" | "added" | "removed"; line: string }> = [];

  for (let i = 0; i < max; i += 1) {
    const oldLine = previousLines[i];
    const newLine = currentLines[i];

    if (oldLine === newLine) {
      if (oldLine !== undefined) {
        rows.push({ type: "same", line: oldLine });
      }
      continue;
    }

    if (oldLine !== undefined) {
      rows.push({ type: "removed", line: oldLine });
    }

    if (newLine !== undefined) {
      rows.push({ type: "added", line: newLine });
    }
  }

  return rows;
}
