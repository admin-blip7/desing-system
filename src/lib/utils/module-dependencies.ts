import { getModuleByIdentifier, modulesDefinition } from "@/lib/data/modules-definition";
import { ModuleDefinition } from "@/lib/types/module";

const CORE_VISUAL_FOUNDATION_KEYS = ["logo", "colorPalette", "typography"] as const;
const CORE_STRATEGY_KEYS = ["brandStory", "brandPhilosophy", "voiceTone", "customerPersonas"] as const;
const UI_FOUNDATION_KEYS = ["designTokens", "buttons", "forms", "navigation"] as const;

const explicitDependenciesByKey: Record<string, string[]> = {
  // Phase 1
  colorPalette: ["brandPhilosophy"],
  typography: ["brandPhilosophy"],
  geometry: ["logo", "colorPalette", "typography"],

  // Phase 2
  photography: [...CORE_VISUAL_FOUNDATION_KEYS],
  illustration: [...CORE_VISUAL_FOUNDATION_KEYS],
  iconography: [...CORE_VISUAL_FOUNDATION_KEYS],
  motion: [...CORE_VISUAL_FOUNDATION_KEYS],
  audioBranding: [...CORE_VISUAL_FOUNDATION_KEYS, "voiceTone"],
  dataVisualization: ["colorPalette", "typography"],

  // Phase 3
  designTokens: [...CORE_VISUAL_FOUNDATION_KEYS],
  buttons: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  forms: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  gridsLayouts: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  navigation: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  cardsContainers: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  tagsStatus: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  emptyErrorStates: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],
  tablesLists: [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"],

  // Phase 4
  landingPages: [...CORE_VISUAL_FOUNDATION_KEYS, ...UI_FOUNDATION_KEYS],
  productPage: [...CORE_VISUAL_FOUNDATION_KEYS, ...UI_FOUNDATION_KEYS],
  cartCheckout: [...CORE_VISUAL_FOUNDATION_KEYS, ...UI_FOUNDATION_KEYS],
  socialMediaKit: [...CORE_VISUAL_FOUNDATION_KEYS, "voiceTone", "photography"],
  socialProfiles: [...CORE_VISUAL_FOUNDATION_KEYS, "socialMediaKit"],
  emailNewsletters: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS],
  supportTickets: [...CORE_STRATEGY_KEYS],
  seoMeta: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS],
  presentations: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS, "dataVisualization"],
  videoTemplates: [...CORE_VISUAL_FOUNDATION_KEYS, "motion", "audioBranding"],

  // Phase 5
  printGuide: [...CORE_VISUAL_FOUNDATION_KEYS],
  stationery: [...CORE_VISUAL_FOUNDATION_KEYS, "printGuide"],
  labeling: [...CORE_VISUAL_FOUNDATION_KEYS, "printGuide"],
  qrCodes: [...CORE_VISUAL_FOUNDATION_KEYS, "labeling"],
  packaging: [...CORE_VISUAL_FOUNDATION_KEYS, "printGuide"],
  uniforms: [...CORE_VISUAL_FOUNDATION_KEYS],
  merchandising: [...CORE_VISUAL_FOUNDATION_KEYS],
  signage: [...CORE_VISUAL_FOUNDATION_KEYS],
  architectural: [...CORE_VISUAL_FOUNDATION_KEYS, "signage"],
  vehicles: [...CORE_VISUAL_FOUNDATION_KEYS, "signage"],

  // Phase 6
  behaviorManual: [...CORE_STRATEGY_KEYS],
  incidentManagement: [...CORE_STRATEGY_KEYS, "behaviorManual"],
  cxSystem: [...CORE_STRATEGY_KEYS],
  employeeOnboarding: ["brandStory", "brandPhilosophy", "behaviorManual"],
  coBranding: ["brandPhilosophy", "logo", "colorPalette"],
  benchmark: [...CORE_STRATEGY_KEYS],

  // Phase 7
  notionConnector: [...CORE_VISUAL_FOUNDATION_KEYS, "brandPhilosophy"],
  exportMdLlms: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS],
  assetLibrary: [...CORE_VISUAL_FOUNDATION_KEYS, "logo"],
  releaseNotes: [...CORE_STRATEGY_KEYS],
  brandAudit: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS],
  roadmapGenerator: [...CORE_STRATEGY_KEYS, ...CORE_VISUAL_FOUNDATION_KEYS],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function inferFromFeedsInto(target: ModuleDefinition): string[] {
  const targetKeys = new Set([normalize(target.name), normalize(target.key)]);
  return modulesDefinition
    .filter((candidate) =>
      candidate.feedsInto.some((destination) => targetKeys.has(normalize(destination))),
    )
    .map((candidate) => candidate.key);
}

function inferPhaseRules(target: ModuleDefinition): string[] {
  if (target.phaseId === 2) {
    return [...CORE_VISUAL_FOUNDATION_KEYS];
  }

  if (target.phaseId === 3 && target.key !== "designTokens") {
    return [...CORE_VISUAL_FOUNDATION_KEYS, "designTokens"];
  }

  if (target.phaseId === 4) {
    return [...CORE_VISUAL_FOUNDATION_KEYS, ...UI_FOUNDATION_KEYS];
  }

  if (target.phaseId === 5) {
    return target.key === "printGuide"
      ? [...CORE_VISUAL_FOUNDATION_KEYS]
      : [...CORE_VISUAL_FOUNDATION_KEYS, "printGuide"];
  }

  if (target.phaseId === 6) {
    return [...CORE_STRATEGY_KEYS];
  }

  if (target.phaseId === 7) {
    return [...CORE_VISUAL_FOUNDATION_KEYS, "brandPhilosophy"];
  }

  return [];
}

export function getDependencyModulesForModule(moduleIdentifier: string): ModuleDefinition[] {
  const target = getModuleByIdentifier(moduleIdentifier);
  if (!target) return [];

  const dependencies = new Set<string>();

  (explicitDependenciesByKey[target.key] || []).forEach((dependencyKey) => dependencies.add(dependencyKey));
  inferFromFeedsInto(target).forEach((dependencyKey) => dependencies.add(dependencyKey));
  inferPhaseRules(target).forEach((dependencyKey) => dependencies.add(dependencyKey));
  dependencies.delete(target.key);

  return [...dependencies]
    .map((dependencyKey) => getModuleByIdentifier(dependencyKey))
    .filter((dependency): dependency is ModuleDefinition => Boolean(dependency));
}

export function getDependenciesForModule(moduleIdentifier: string): string[] {
  return getDependencyModulesForModule(moduleIdentifier).map((dependency) => dependency.name);
}

export function getRecommendedOrder(): string[] {
  const visited = new Set<string>();
  const order: string[] = [];

  const visit = (target: ModuleDefinition) => {
    if (visited.has(target.key)) return;
    visited.add(target.key);

    getDependencyModulesForModule(target.key).forEach(visit);
    order.push(target.name);
  };

  modulesDefinition.forEach((module) => visit(module));
  return order;
}

