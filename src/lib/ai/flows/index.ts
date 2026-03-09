/**
 * BAML Flows Module - Main Export
 *
 * Sistema de flujos especializados BAML para generación
 * de los 55 módulos del brand manual.
 */

export * from "./orchestrator";
export * from "./generator";

// Re-exportar tipos principales
export type {
  FlowType,
  FlowRequest,
  FlowResponse,
  ExtendedBrandContext as BrandContext,
  DependencyContext,
  PersonalityProfile,
} from "./orchestrator";

export type {
  BrandContextInput,
  DependencyInput,
  GeneratorOptions,
  ModuleGenerationRequest,
  ModuleGenerationResponse,
} from "./generator";

// Re-exportar funciones principales
export {
  getFlowTypeForModule,
  getModulesByFlowType,
  executeFlow,
  executeFlowsParallel,
  validateFlowOutput,
} from "./orchestrator";

export {
  generateModule,
  generateModulesBatch,
  moduleRequiresImage,
  moduleRequiresJson,
  estimateGenerationCost,
  buildModulePrompt,
  buildBrandContext,
  buildDependencyContext,
} from "./generator";

// Constantes útiles
export const FLOW_TYPES = [
  "TEXT_FLOW",
  "VISUAL_IDENTITY_FLOW",
  "UI_COMPONENT_FLOW",
  "TEMPLATE_FLOW",
  "MULTIMEDIA_FLOW",
  "INTEGRATION_FLOW",
] as const;

export const MODULES_BY_FLOW = {
  TEXT_FLOW: [
    "brandStory",
    "brandPhilosophy",
    "voiceTone",
    "customerPersonas",
    "behaviorManual",
    "incidentManagement",
    "cxSystem",
    "employeeOnboarding",
    "coBranding",
    "benchmark",
    "printGuide",
    "architectural",
    "supportTickets",
    "seoMeta",
    "releaseNotes",
    "brandAudit",
    "roadmapGenerator",
  ],
  VISUAL_IDENTITY_FLOW: [
    "logo",
    "colorPalette",
    "geometry",
    "illustration",
    "iconography",
    "qrCodes",
  ],
  UI_COMPONENT_FLOW: [
    "designTokens",
    "buttons",
    "forms",
    "gridsLayouts",
    "navigation",
    "cardsContainers",
    "tagsStatus",
    "emptyErrorStates",
    "tablesLists",
    "typography",
    "dataVisualization",
  ],
  TEMPLATE_FLOW: [
    "landingPages",
    "productPage",
    "cartCheckout",
    "socialMediaKit",
    "socialProfiles",
    "emailNewsletters",
    "presentions",
    "stationery",
    "labeling",
    "packaging",
    "uniforms",
    "merchandising",
    "signage",
    "vehicles",
  ],
  MULTIMEDIA_FLOW: [
    "photography",
    "motion",
    "audioBranding",
    "videoTemplates",
  ],
  INTEGRATION_FLOW: [
    "notionConnector",
    "exportMdLlms",
    "assetLibrary",
  ],
} as const;
