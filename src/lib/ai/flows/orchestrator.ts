/**
 * BAML Flow Orchestrator
 *
 * Este servicio orquesta los flujos BAML especializados
 * para los 55 módulos del brand manual.
 *
 * Usa las funciones BAML generadas en baml_src/*.baml:
 * - GenerateBrandModule: Flujo genérico para cualquier módulo
 * - GenerateTextModule: Flujo especializado para contenido de texto
 * - GenerateVisualModule: Flujo especializado para módulos visuales
 * - GenerateComponentModule: Flujo especializado para componentes UI
 * - GenerateTemplateModule: Flujo especializado para plantillas
 */

import { b, type BrandContext, type PersonalityProfile } from "@bm/ai-shared/baml_client";

// Re-exportar tipos BAML
export type { PersonalityProfile } from "@bm/ai-shared/baml_client";

// ============================================
// TYPES
// ============================================

export type FlowType =
  | "TEXT_FLOW"
  | "VISUAL_IDENTITY_FLOW"
  | "UI_COMPONENT_FLOW"
  | "TEMPLATE_FLOW"
  | "MULTIMEDIA_FLOW"
  | "INTEGRATION_FLOW";

export interface FlowRequest {
  flowType?: FlowType;
  moduleKey: string;
  moduleName: string;
  brandContext: ExtendedBrandContext;
  personalityProfile: PersonalityProfile;
  userAnswers?: Record<string, string>;
  dependencies?: DependencyContext[];
  additionalData?: Record<string, unknown>;
}

export interface ExtendedBrandContext {
  name: string;
  personalityId: string;
  industry?: string;
  offering?: string;
  locale?: string;
}

export interface DependencyContext {
  moduleKey: string;
  contentSummary: string;
}

export interface FlowResponse {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: Record<string, unknown>;
  validationIssues?: string[];
}

// ============================================
// FLOW TYPE MAPPING
// ============================================

/**
 * Mapa de módulos a su tipo de flujo correspondiente
 * Basado en el análisis de los 55 módulos
 */
const MODULE_FLOW_MAP: Record<string, FlowType> = {
  // FASE 1: Fundamentos de Identidad
  brandStory: "TEXT_FLOW",
  brandPhilosophy: "TEXT_FLOW",
  voiceTone: "TEXT_FLOW",
  customerPersonas: "TEXT_FLOW",
  logo: "VISUAL_IDENTITY_FLOW",
  colorPalette: "VISUAL_IDENTITY_FLOW",
  typography: "UI_COMPONENT_FLOW",
  geometry: "VISUAL_IDENTITY_FLOW",

  // FASE 2: Sistema Visual Extendido
  photography: "MULTIMEDIA_FLOW",
  illustration: "VISUAL_IDENTITY_FLOW",
  iconography: "VISUAL_IDENTITY_FLOW",
  motion: "MULTIMEDIA_FLOW",
  audioBranding: "MULTIMEDIA_FLOW",
  dataVisualization: "UI_COMPONENT_FLOW",

  // FASE 3: UI Kit
  designTokens: "UI_COMPONENT_FLOW",
  buttons: "UI_COMPONENT_FLOW",
  forms: "UI_COMPONENT_FLOW",
  gridsLayouts: "UI_COMPONENT_FLOW",
  navigation: "UI_COMPONENT_FLOW",
  cardsContainers: "UI_COMPONENT_FLOW",
  tagsStatus: "UI_COMPONENT_FLOW",
  emptyErrorStates: "UI_COMPONENT_FLOW",
  tablesLists: "UI_COMPONENT_FLOW",

  // FASE 4: Presencia Digital
  landingPages: "TEMPLATE_FLOW",
  productPage: "TEMPLATE_FLOW",
  cartCheckout: "TEMPLATE_FLOW",
  socialMediaKit: "TEMPLATE_FLOW",
  socialProfiles: "TEMPLATE_FLOW",
  emailNewsletters: "TEMPLATE_FLOW",
  supportTickets: "TEXT_FLOW",
  seoMeta: "TEXT_FLOW",
  presentions: "TEMPLATE_FLOW",
  videoTemplates: "MULTIMEDIA_FLOW",

  // FASE 5: Identidad Física
  printGuide: "TEXT_FLOW",
  stationery: "TEMPLATE_FLOW",
  labeling: "TEMPLATE_FLOW",
  qrCodes: "VISUAL_IDENTITY_FLOW",
  packaging: "TEMPLATE_FLOW",
  uniforms: "TEMPLATE_FLOW",
  merchandising: "TEMPLATE_FLOW",
  signage: "TEMPLATE_FLOW",
  architectural: "TEXT_FLOW",
  vehicles: "TEMPLATE_FLOW",

  // FASE 6: Experiencia del Cliente
  behaviorManual: "TEXT_FLOW",
  incidentManagement: "TEXT_FLOW",
  cxSystem: "TEXT_FLOW",
  employeeOnboarding: "TEXT_FLOW",
  coBranding: "TEXT_FLOW",
  benchmark: "TEXT_FLOW",

  // FASE 7: Integraciones
  notionConnector: "INTEGRATION_FLOW",
  exportMdLlms: "INTEGRATION_FLOW",
  assetLibrary: "INTEGRATION_FLOW",
  releaseNotes: "TEXT_FLOW",
  brandAudit: "TEXT_FLOW",
  roadmapGenerator: "TEXT_FLOW",
};

/**
 * Obtiene el tipo de flujo para un módulo
 */
export function getFlowTypeForModule(moduleKey: string): FlowType {
  return MODULE_FLOW_MAP[moduleKey] || "TEXT_FLOW";
}

/**
 * Lista todos los módulos de un tipo de flujo
 */
export function getModulesByFlowType(flowType: FlowType): string[] {
  return Object.entries(MODULE_FLOW_MAP)
    .filter(([, type]) => type === flowType)
    .map(([key]) => key);
}

// ============================================
// FLOW EXECUTORS
// ============================================

/**
 * Ejecuta TEXT_FLOW usando GenerateTextModule de BAML
 */
async function executeTextFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateTextModule(
      {
        module_key: request.moduleKey,
        module_name: request.moduleName,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        user_answers: request.userAnswers || {},
        tone_profile: "Professional and engaging",
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "TEXT_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in TEXT_FLOW",
    };
  }
}

/**
 * Ejecuta VISUAL_IDENTITY_FLOW usando GenerateVisualModule de BAML
 */
async function executeVisualIdentityFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateVisualModule(
      {
        module_key: request.moduleKey,
        module_name: request.moduleName,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        user_answers: request.userAnswers || {},
        visual_style: "Modern and distinctive",
        generation_mode: "questions",
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "VISUAL_IDENTITY_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in VISUAL_IDENTITY_FLOW",
    };
  }
}

/**
 * Ejecuta UI_COMPONENT_FLOW usando GenerateComponentModule de BAML
 */
async function executeUIComponentFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateComponentModule(
      {
        component_key: request.moduleKey,
        component_name: request.moduleName,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        design_tokens: request.additionalData?.designTokens as Record<string, string> || {},
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "UI_COMPONENT_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in UI_COMPONENT_FLOW",
    };
  }
}

/**
 * Ejecuta TEMPLATE_FLOW usando GenerateTemplateModule de BAML
 */
async function executeTemplateFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateTemplateModule(
      {
        template_key: request.moduleKey,
        template_name: request.moduleName,
        template_type: request.moduleKey,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        user_answers: request.userAnswers || {},
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "TEMPLATE_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in TEMPLATE_FLOW",
    };
  }
}

/**
 * Ejecuta MULTIMEDIA_FLOW usando GenerateBrandModule genérico
 */
async function executeMultimediaFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateBrandModule(
      {
        module_key: request.moduleKey,
        module_name: request.moduleName,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        user_answers: request.userAnswers || {},
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "MULTIMEDIA_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in MULTIMEDIA_FLOW",
    };
  }
}

/**
 * Ejecuta INTEGRATION_FLOW usando GenerateBrandModule genérico
 */
async function executeIntegrationFlow(request: FlowRequest): Promise<FlowResponse> {
  try {
    const result = await b.GenerateBrandModule(
      {
        module_key: request.moduleKey,
        module_name: request.moduleName,
        brand_context: {
          name: request.brandContext.name,
          personality_id: request.brandContext.personalityId,
          industry: request.brandContext.industry || "",
          offering: request.brandContext.offering || "",
        },
        personality_profile: request.personalityProfile,
        user_answers: request.userAnswers || {},
      },
      { client: "CustomGPT5Mini" },
    );

    return {
      success: true,
      content: JSON.stringify(result, null, 2),
      metadata: {
        flowType: "INTEGRATION_FLOW",
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in INTEGRATION_FLOW",
    };
  }
}

// ============================================
// MAIN ORCHESTRATOR
// ============================================

export interface FlowOrchestratorOptions {
  personalityProfile: PersonalityProfile;
  designTokens?: Record<string, unknown>;
}

/**
 * Orquestador principal de flujos BAML
 * Selecciona y ejecuta el flujo apropiado según el tipo de módulo
 */
export async function executeFlow(
  request: FlowRequest,
  options: FlowOrchestratorOptions,
): Promise<FlowResponse> {
  // Asegurar que tenemos el personalityProfile
  request.personalityProfile = request.personalityProfile || options.personalityProfile;

  const flowType = request.flowType || getFlowTypeForModule(request.moduleKey);

  switch (flowType) {
    case "TEXT_FLOW":
      return executeTextFlow(request);

    case "VISUAL_IDENTITY_FLOW":
      return executeVisualIdentityFlow(request);

    case "UI_COMPONENT_FLOW":
      return executeUIComponentFlow(request);

    case "TEMPLATE_FLOW":
      return executeTemplateFlow(request);

    case "MULTIMEDIA_FLOW":
      return executeMultimediaFlow(request);

    case "INTEGRATION_FLOW":
      return executeIntegrationFlow(request);

    default:
      return {
        success: false,
        error: `Unknown flow type: ${flowType}`,
      };
  }
}

/**
 * Ejecuta múltiples flujos en paralelo cuando es posible
 */
export async function executeFlowsParallel(
  requests: FlowRequest[],
  options: FlowOrchestratorOptions,
): Promise<FlowResponse[]> {
  return Promise.all(requests.map((req) => executeFlow(req, options)));
}

/**
 * Valida el output de un flujo antes de devolverlo
 */
export async function validateFlowOutput(
  flowType: FlowType,
  content: string,
): Promise<FlowResponse> {
  if (!content || content.trim().length === 0) {
    return {
      success: false,
      error: "El contenido generado está vacío",
    };
  }

  return {
    success: true,
    content,
  };
}
