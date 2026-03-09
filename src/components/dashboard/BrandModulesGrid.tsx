"use client";

import { Phase, PromptModule } from "@/lib/data/phases";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ModuleEditor from "@/components/dashboard/ModuleEditor";
import { toast } from "sonner";
import { useState } from "react";

import { generateModuleAction } from "@/actions/generate-module";
import { getDependencyModulesForModule } from "@/lib/utils/module-dependencies";

// Phase colors from Flow Design
const PHASE_COLORS: Record<number, string> = {
  1: "#F5C518", // Identidad - Yellow
  2: "#EC4899", // Visual Extendido - Pink
  3: "#3B82F6", // UI Kit - Blue
  4: "#10B981", // Digital - Green
  5: "#F97316", // Físico - Orange
  6: "#EF4444", // Experiencia - Red
  7: "#8B5CF6", // Distribución - Purple
};

interface BrandModulesGridProps {
  phases: Phase[];
  brandId: string;
  initialData?: Record<string, {
    status: "locked" | "pending" | "generating" | "completed" | "error";
    content?: any;
  }>;
}

export default function BrandModulesGrid({
  phases,
  brandId,
  initialData = {}
}: BrandModulesGridProps) {
  // Initialize state from props (server data)
  const [moduleData, setModuleData] = useState<
    Record<string, { status: string; content?: any }>
  >(initialData);
  const [selectedModule, setSelectedModule] = useState<PromptModule | null>(null);

  const getModuleState = (module: PromptModule) => {
    return moduleData[module.key] || moduleData[module.name];
  };

  const getDependencyStatus = (
    dependencyKey: string,
    dependencyName: string
  ) => {
    return (
      moduleData[dependencyKey]?.status ||
      moduleData[dependencyName]?.status ||
      "pending"
    );
  };

  const handleStartModule = async (module: PromptModule) => {
    const currentData = getModuleState(module);

    // If completed, just open editor
    if (currentData?.status === "completed") {
      setSelectedModule(module);
      return;
    }

    toast.info(`Iniciando módulo: ${module.name}`);

    // Set state to generating
    setModuleData((prev) => ({
      ...prev,
      [module.key]: {
        ...(prev[module.key] || prev[module.name]),
        status: "generating",
      },
    }));

    try {
      console.log("=== GENERATING MODULE ===");
      console.log("Brand ID:", brandId);
      console.log("Module Key:", module.key);
      console.log("Module Name:", module.name);

      const result = await generateModuleAction(brandId, module.key);

      console.log("Generation result:", result);

      if (result.success) {
        setModuleData((prev) => ({
          ...prev,
          [module.key]: { status: "completed", content: result.data },
        }));
        toast.success(`Módulo completado: ${module.name}`);
      } else {
        console.error("Generation failed:", result.error);
        setModuleData((prev) => ({
          ...prev,
          [module.key]: {
            ...(prev[module.key] || prev[module.name]),
            status: "error",
          },
        }));
        toast.error(`Error: ${result.error}`);
      }
    } catch (e: any) {
      console.error("Exception during generation:", e);
      setModuleData((prev) => ({
        ...prev,
        [module.key]: {
          ...(prev[module.key] || prev[module.name]),
          status: "error",
        },
      }));
      toast.error(`Error desconocido: ${e.message || "Ver consola para detalles"}`);
    }
  };

  const handleSaveContent = async (newContent: string) => {
    if (!selectedModule) return;

    // TODO: Call server action to update content
    // For now, update local state
    setModuleData((prev) => ({
      ...prev,
      [selectedModule.key]: {
        ...(prev[selectedModule.key] || prev[selectedModule.name]),
        content: {
          ...(
            typeof (
              prev[selectedModule.key]?.content ||
              prev[selectedModule.name]?.content
            ) === "object"
              ? (prev[selectedModule.key]?.content ||
                  prev[selectedModule.name]?.content)
              : {}
          ),
          content: newContent,
        },
      },
    }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <>
      <div style={{ padding: "24px 32px" }}>
        {phases.map((phase, phaseIndex) => (
          <div
            key={phase.id}
            style={phaseIndex > 0 ? { marginTop: "32px" } : undefined}
          >
            {/* Phase Header - Flow Design Style */}
            <div
              className="flex items-center gap-2 border-b"
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--flow-border-main)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "var(--flow-radius-dot)",
                  background: PHASE_COLORS[phase.id] || PHASE_COLORS[1],
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: PHASE_COLORS[phase.id] || PHASE_COLORS[1],
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {phase.phase}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--flow-text-disabled)",
                  marginLeft: "4px",
                }}
              >
                {phase.title}
              </span>
            </div>

            {/* Modules Grid */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {phase.modules.map((module, i) => {
                const rawStatus = getModuleState(module)?.status as
                  | "locked"
                  | "pending"
                  | "generating"
                  | "completed"
                  | "error"
                  | undefined;
                const dependencies = getDependencyModulesForModule(
                  module.key
                );
                const hasPendingDependencies = dependencies.some(
                  (dep) =>
                    getDependencyStatus(dep.key, dep.name) !== "completed"
                );
                const status =
                  rawStatus === "completed" ||
                  rawStatus === "generating" ||
                  rawStatus === "error"
                    ? rawStatus
                    : hasPendingDependencies
                      ? "locked"
                      : "pending";

                return (
                  <ModuleCard
                    key={i}
                    module={module}
                    status={status}
                    index={i}
                    onStart={() => handleStartModule(module)}
                    href={`/dashboard/brands/${brandId}/modules/${module.key}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ModuleEditor
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={selectedModule?.name || ""}
        moduleKey={selectedModule?.key || ""}
        initialContent={
          selectedModule &&
          (moduleData[selectedModule.key]?.content ||
            moduleData[selectedModule.name]?.content)
            ? typeof (
                moduleData[selectedModule.key]?.content ||
                moduleData[selectedModule.name]?.content
              ) === "string"
              ? moduleData[selectedModule.key]?.content ||
                moduleData[selectedModule.name]?.content
              : JSON.stringify(
                  moduleData[selectedModule.key]?.content ||
                    moduleData[selectedModule.name]?.content,
                  null,
                  2
                )
            : ""
        }
        onSave={handleSaveContent}
      />
    </>
  );
}
