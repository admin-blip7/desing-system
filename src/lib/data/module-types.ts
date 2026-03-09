import { phases } from "./phases";
import { roadmapPhases } from "./roadmap-phases";

export type ModuleType = "content" | "visual" | "system" | "template" | "workspace" | "tool";

export interface ModuleConfig {
  type: ModuleType;
  editorComponent?: string; // Componente específico si no usa el genérico
  workspacePath?: string; // Path a workspace existente
}

// Configuración de tipos para cada módulo por su key
export const moduleTypeConfig: Record<string, ModuleConfig> = {
  // FASE 1 - Fundamentos de Identidad
  brandStory: { type: "workspace", workspacePath: "/workspace/brand-story" },
  brandPhilosophy: { type: "workspace", workspacePath: "/workspace/brand-philosophy" },
  voiceTone: { type: "workspace", workspacePath: "/workspace/voice-tone" },
  customerPersonas: { type: "workspace", workspacePath: "/workspace/customer-personas" },
  logo: { type: "workspace", workspacePath: "/workspace/logo" },
  colorPalette: { type: "workspace", workspacePath: "/workspace/color-palette" },
  typography: { type: "workspace", workspacePath: "/workspace/typography" },
  geometry: { type: "workspace", workspacePath: "/workspace/geometry" },

  // FASE 2 - Sistema Visual Extendido
  photography: { type: "workspace", workspacePath: "/workspace/photography" },
  illustration: { type: "workspace", workspacePath: "/workspace/illustration" },
  iconography: { type: "workspace", workspacePath: "/workspace/iconography" },
  motion: { type: "workspace", workspacePath: "/workspace/motion" },
  audioBranding: { type: "workspace", workspacePath: "/workspace/audio-branding" },
  dataVisualization: { type: "workspace", workspacePath: "/workspace/data-visualization" },

  // FASE 3 - UI Kit
  // FASE 3 - UI Kit (Moved to Essential Workspaces)
  designTokens: { type: "workspace", workspacePath: "/workspace/design-tokens" },

  uiKit: { type: "workspace", workspacePath: "/workspace/ui-kit" },

  buttons: { type: "workspace", workspacePath: "/workspace/buttons" },
  forms: { type: "workspace", workspacePath: "/workspace/forms" },
  gridsLayouts: { type: "workspace", workspacePath: "/workspace/grids-layouts" },
  navigation: { type: "workspace", workspacePath: "/workspace/navigation" },
  cardsContainers: { type: "workspace", workspacePath: "/workspace/cards-containers" },
  tagsStatus: { type: "workspace", workspacePath: "/workspace/tags-status" },
  emptyErrorStates: { type: "workspace", workspacePath: "/workspace/empty-error-states" },
  tablesLists: { type: "workspace", workspacePath: "/workspace/tables-lists" },

  // FASE 4 - Presencia Digital
  landingPages: { type: "workspace", workspacePath: "/workspace/landing-pages" },
  productPage: { type: "workspace", workspacePath: "/workspace/product-page" },
  cartCheckout: { type: "workspace", workspacePath: "/workspace/cart-checkout" },
  socialMediaKit: { type: "workspace", workspacePath: "/workspace/social-media" },
  socialProfiles: { type: "workspace", workspacePath: "/workspace/social-profiles" },
  emailNewsletters: { type: "workspace", workspacePath: "/workspace/email-templates" },
  supportTickets: { type: "workspace", workspacePath: "/workspace/support-tickets" },
  seoMeta: { type: "workspace", workspacePath: "/workspace/seo-meta" },
  presentations: { type: "workspace", workspacePath: "/workspace/presentations" },
  videoTemplates: { type: "workspace", workspacePath: "/workspace/video-templates" },
  webTemplates: { type: "workspace", workspacePath: "/workspace/web-templates" },

  // FASE 5 - Identidad Física
  printGuide: { type: "workspace", workspacePath: "/workspace/print-guide" },
  stationery: { type: "workspace", workspacePath: "/workspace/stationery" },
  labeling: { type: "workspace", workspacePath: "/workspace/labeling" },
  qrCodes: { type: "workspace", workspacePath: "/workspace/qr-codes" },
  packaging: { type: "workspace", workspacePath: "/workspace/packaging" },
  uniforms: { type: "workspace", workspacePath: "/workspace/uniforms" },
  merchandising: { type: "workspace", workspacePath: "/workspace/merchandising" },
  signage: { type: "workspace", workspacePath: "/workspace/signage" },
  architectural: { type: "workspace", workspacePath: "/workspace/architectural" },
  vehicles: { type: "workspace", workspacePath: "/workspace/vehicles" },

  // FASE 6 - Experiencia del Cliente
  behaviorManual: { type: "workspace", workspacePath: "/workspace/behavior" },
  incidentManagement: { type: "workspace", workspacePath: "/workspace/incidents" },
  cxSystem: { type: "workspace", workspacePath: "/workspace/cx-system" },
  employeeOnboarding: { type: "workspace", workspacePath: "/workspace/onboarding" },
  coBranding: { type: "workspace", workspacePath: "/workspace/co-branding" },
  benchmark: { type: "workspace", workspacePath: "/workspace/benchmark" },

  // FASE 7 - Integraciones
  notionConnector: { type: "workspace", workspacePath: "/workspace/notion-connector" },
  exportMdLlms: { type: "workspace", workspacePath: "/workspace/export-md-llms" },
  assetLibrary: { type: "workspace", workspacePath: "/workspace/asset-library" },
  releaseNotes: { type: "workspace", workspacePath: "/workspace/release-notes" },
  brandAudit: { type: "workspace", workspacePath: "/workspace/brand-audit" },
  roadmapGenerator: { type: "workspace", workspacePath: "/workspace/roadmap" },
};

// Función para obtener el tipo de un módulo
export function getModuleType(moduleKey: string): ModuleConfig {
  return (
    moduleTypeConfig[moduleKey] || { type: "content" } // Default: content
  );
}

// Función para obtener datos del módulo desde phases.ts (sistema original)
export function getModuleFromPhases(moduleKey: string) {
  for (const phase of phases) {
    const module = phase.modules.find((m) => m.key === moduleKey);
    if (module) {
      return {
        ...module,
        phaseId: phase.id,
        phaseColor: phase.color,
        phaseTitle: phase.title,
      };
    }
  }
  return null;
}

// Función para obtener datos del módulo desde roadmap-phases.ts
export function getModuleFromRoadmap(moduleKey: string) {
  for (const phase of roadmapPhases) {
    const module = phase.modules.find((m) => m.key === moduleKey);
    if (module) {
      return {
        ...module,
        phaseId: phase.id,
        phaseColor: phase.color,
        phaseTitle: phase.title,
        phaseSubtitle: phase.subtitle,
        phaseWeeks: phase.weeks,
      };
    }
  }
  return null;
}

// Función combinada que obtiene datos de ambas fuentes
export function getModuleData(moduleKey: string) {
  const fromPhases = getModuleFromPhases(moduleKey);
  const fromRoadmap = getModuleFromRoadmap(moduleKey);
  const typeConfig = getModuleType(moduleKey);

  return {
    // Datos del sistema original (preQuestions, aiGenerates, etc.)
    preQuestions: fromPhases?.preQuestions || [],
    aiGenerates: fromPhases?.aiGenerates || "",
    feedsInto: fromPhases?.feedsInto || [],
    description: fromPhases?.description || fromRoadmap?.desc || "",

    // Datos del roadmap (nombre, descripción, output)
    name: fromRoadmap?.name || fromPhases?.name || "",
    desc: fromRoadmap?.desc || fromPhases?.description || "",
    output: fromRoadmap?.output || "",
    isNew: fromRoadmap?.isNew || false,

    // Datos de fase
    phaseId: fromRoadmap?.phaseId || fromPhases?.phaseId || 1,
    phaseColor: fromRoadmap?.phaseColor || fromPhases?.phaseColor || "#F5C518",
    phaseTitle: fromRoadmap?.phaseTitle || fromPhases?.phaseTitle || "",
    phaseSubtitle: fromRoadmap?.phaseSubtitle || "",
    phaseWeeks: fromRoadmap?.phaseWeeks || "",

    // Configuración de tipo
    type: typeConfig.type,
    workspacePath: typeConfig.workspacePath,
  };
}
