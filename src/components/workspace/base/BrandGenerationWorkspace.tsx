"use client";

import { useMemo, useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import BrandBriefForm from "@/components/brand-brief-form";

interface BrandGenerationWorkspaceProps {
  brandId: string;
  moduleKey?: string;
  sessionId?: string;
}

interface SessionSnapshotView {
  session: {
    id: string;
    status: "created" | "in_progress" | "running" | "completed" | "failed";
    activeModule: string;
    currentBriefVersion: number;
    updatedAt: string;
  };
  briefVersions: Array<{ id: string; version: number }>;
  agentOutputs: Array<{
    id: string;
    runId: string;
    agentKey: "strategist" | "researcher" | "designer" | "copywriter" | "validator";
    status: "completed" | "failed" | "skipped";
    createdAt: string;
  }>;
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

export default function BrandGenerationWorkspace({
  brandId,
  moduleKey,
  sessionId,
}: BrandGenerationWorkspaceProps) {
  const [snapshot, setSnapshot] = useState<SessionSnapshotView | null>(null);
  const [runPayload, setRunPayload] = useState<RunPayloadView | null>(null);

  const latestRunId = useMemo(() => {
    if (!snapshot || snapshot.agentOutputs.length === 0) {
      return null;
    }
    return snapshot.agentOutputs[snapshot.agentOutputs.length - 1]?.runId || null;
  }, [snapshot]);

  return (
    <BaseWorkspace
      brandId={brandId}
      moduleKey={moduleKey || "brandGeneration"}
      moduleName="Brand Generation IA"
      moduleSubtitle="Persistencia de sesión + orquestación multi-agente con BAML"
      backLink={`/dashboard/brands/${brandId}`}
      customSave={async () => true}
    >
      {() => (
        <div className="h-full overflow-auto bg-[#0A0A0A] px-6 py-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <BrandBriefForm
              brandId={brandId}
              moduleKey={moduleKey || "geometry"}
              sessionId={sessionId}
              onSessionChange={(next) => setSnapshot(next)}
              onRunComplete={(run) => setRunPayload(run)}
            />

            <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h3 className="text-sm font-semibold text-zinc-100">Resumen de sesión</h3>
              {!snapshot ? (
                <p className="mt-2 text-sm text-zinc-500">Sin sesión activa.</p>
              ) : (
                <div className="mt-3 grid gap-3 md:grid-cols-5">
                  <Stat label="Session ID" value={snapshot.session.id} mono />
                  <Stat label="Estado" value={snapshot.session.status} />
                  <Stat label="Módulo" value={snapshot.session.activeModule} />
                  <Stat label="Versión brief" value={`v${snapshot.session.currentBriefVersion}`} />
                  <Stat
                    label="Actualizado"
                    value={new Date(snapshot.session.updatedAt).toLocaleString()}
                  />
                </div>
              )}

              {runPayload && (
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-200">
                  <p>
                    Última ejecución: <span className="font-mono">{runPayload.runId}</span>
                  </p>
                  <p>
                    Consistencia: {runPayload.consistencyScore} (
                    {runPayload.passedConsistency ? "OK" : "Ajustes requeridos"})
                  </p>
                  {runPayload.contradictions.length > 0 && (
                    <p className="mt-1 text-zinc-400">
                      Contradicciones detectadas: {runPayload.contradictions.length}
                    </p>
                  )}
                </div>
              )}

              {!runPayload && latestRunId && (
                <p className="mt-3 text-xs text-zinc-500">
                  Último run detectado en sesión: <span className="font-mono">{latestRunId}</span>
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </BaseWorkspace>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className={`mt-1 text-xs text-zinc-200 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

