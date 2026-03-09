import { phases } from "@/lib/data/phases";
import { ModuleDefinition } from "@/lib/types/module";

export const modulesDefinition: ModuleDefinition[] = phases.flatMap((phase) =>
  phase.modules.map((module) => ({
    key: module.key,
    name: module.name,
    phaseId: phase.id,
    phaseName: phase.phase,
    phaseTitle: phase.title,
    preQuestions: module.preQuestions,
    aiGenerates: module.aiGenerates,
    feedsInto: module.feedsInto,
    description: module.description,
  })),
);

function normalizeIdentifier(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getModuleByKey(key: string): ModuleDefinition | undefined {
  return modulesDefinition.find((module) => module.key === key);
}

export function getModuleByName(name: string): ModuleDefinition | undefined {
  return modulesDefinition.find((module) => module.name === name);
}

export function getModuleByIdentifier(identifier: string): ModuleDefinition | undefined {
  const normalized = normalizeIdentifier(identifier);
  return modulesDefinition.find(
    (module) =>
      module.key === identifier ||
      module.name === identifier ||
      normalizeIdentifier(module.key) === normalized ||
      normalizeIdentifier(module.name) === normalized,
  );
}
