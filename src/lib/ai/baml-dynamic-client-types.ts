/**
 * Tipos y utilidades para BAML Dinámico (Client-Safe)
 *
 * Este archivo solo contiene tipos y funciones puras que son
 * seguras para importar desde componentes del cliente.
 */

import type { ModelOption, FlowType } from "@/lib/ai/model-discovery";

export interface BamlExecutionConfig {
  provider: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface FlowExecutionRequest {
  moduleKey: string;
  brandId: string;
  brandContext: {
    name: string;
    industry: string;
    personality_id: string;
    offering: string;
  };
  userAnswers: Record<string, string | string[]>;
  dependencies?: Array<{
    moduleKey: string;
    contentSummary: string;
  }>;
}

export interface FlowExecutionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  modelUsed: string;
  providerUsed: string;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
}

/**
 * Obtiene el flujo BAML correspondiente para un módulo
 * Versión client-safe (solo lectura, sin importar BAML)
 */
export function getFlowTypeForModule(moduleKey: string): FlowType {
  const flowMap: Record<string, FlowType> = {
    // FASE 1 - TEXT_FLOW
    brandStory: "TEXT_FLOW",
    brandPhilosophy: "TEXT_FLOW",
    voiceTone: "TEXT_FLOW",
    customerPersonas: "TEXT_FLOW",

    // FASE 1 - VISUAL_IDENTITY_FLOW
    logo: "VISUAL_IDENTITY_FLOW",
    colorPalette: "VISUAL_IDENTITY_FLOW",
    geometry: "VISUAL_IDENTITY_FLOW",

    // FASE 1 - UI_COMPONENT_FLOW
    typography: "UI_COMPONENT_FLOW",

    // FASE 2 - MULTIMEDIA_FLOW
    photography: "MULTIMEDIA_FLOW",
    motion: "MULTIMEDIA_FLOW",
    audioBranding: "MULTIMEDIA_FLOW",

    // FASE 2 - VISUAL_IDENTITY_FLOW
    illustration: "VISUAL_IDENTITY_FLOW",
    iconography: "VISUAL_IDENTITY_FLOW",

    // FASE 2 - UI_COMPONENT_FLOW
    dataVisualization: "UI_COMPONENT_FLOW",

    // FASE 3 - UI_COMPONENT_FLOW
    designTokens: "UI_COMPONENT_FLOW",
    buttons: "UI_COMPONENT_FLOW",
    forms: "UI_COMPONENT_FLOW",
    gridsLayouts: "UI_COMPONENT_FLOW",
    navigation: "UI_COMPONENT_FLOW",
    cardsContainers: "UI_COMPONENT_FLOW",
    tagsStatus: "UI_COMPONENT_FLOW",
    emptyErrorStates: "UI_COMPONENT_FLOW",
    tablesLists: "UI_COMPONENT_FLOW",

    // FASE 4 - TEMPLATE_FLOW
    landingPages: "TEMPLATE_FLOW",
    productPage: "TEMPLATE_FLOW",
    cartCheckout: "TEMPLATE_FLOW",
    socialMediaKit: "TEMPLATE_FLOW",
    socialProfiles: "TEMPLATE_FLOW",
    emailNewsletters: "TEMPLATE_FLOW",
    presentations: "TEMPLATE_FLOW",
    videoTemplates: "TEMPLATE_FLOW",

    // FASE 4 - TEXT_FLOW
    supportTickets: "TEXT_FLOW",
    seoMeta: "TEXT_FLOW",

    // FASE 5 - TEXT_FLOW
    printGuide: "TEXT_FLOW",
    architectural: "TEXT_FLOW",

    // FASE 5 - TEMPLATE_FLOW
    stationery: "TEMPLATE_FLOW",
    labeling: "TEMPLATE_FLOW",
    packaging: "TEMPLATE_FLOW",
    uniforms: "TEMPLATE_FLOW",
    merchandising: "TEMPLATE_FLOW",
    signage: "TEMPLATE_FLOW",
    vehicles: "TEMPLATE_FLOW",

    // FASE 5 - VISUAL_IDENTITY_FLOW
    qrCodes: "VISUAL_IDENTITY_FLOW",

    // FASE 6 - TEXT_FLOW
    behaviorManual: "TEXT_FLOW",
    incidentManagement: "TEXT_FLOW",
    cxSystem: "TEXT_FLOW",
    employeeOnboarding: "TEXT_FLOW",
    coBranding: "TEXT_FLOW",
    benchmark: "TEXT_FLOW",

    // FASE 7 - INTEGRATION_FLOW
    notionConnector: "INTEGRATION_FLOW",
    exportMdLlms: "INTEGRATION_FLOW",
    assetLibrary: "INTEGRATION_FLOW",

    // FASE 7 - TEXT_FLOW
    releaseNotes: "TEXT_FLOW",
    brandAudit: "TEXT_FLOW",
    roadmapGenerator: "TEXT_FLOW",
  };

  return flowMap[moduleKey] || "TEXT_FLOW";
}

/**
 * Obtiene el modelo recomendado para un flujo
 */
export function getDefaultModelForFlow(flowType: FlowType): string {
  const defaults: Record<FlowType, string> = {
    TEXT_FLOW: "gpt-5.2",
    VISUAL_IDENTITY_FLOW: "gpt-5.2",
    UI_COMPONENT_FLOW: "gpt-5.2",
    TEMPLATE_FLOW: "gpt-5-nano",
    MULTIMEDIA_FLOW: "claude-opus-4-6",
    INTEGRATION_FLOW: "gpt-5.2",
  };
  return defaults[flowType];
}

/**
 * Valida si un modelo soporta un flujo específico
 */
export function isModelCompatibleWithFlow(
  model: ModelOption,
  flow: FlowType
): boolean {
  return model.supportedFlows.includes(flow);
}

/**
 * Construye el prompt para un módulo específico
 */
export function buildPromptForModule(
  flowType: FlowType,
  request: FlowExecutionRequest
): string {
  const { moduleKey, brandContext, userAnswers, dependencies } = request;

  return `
MÓDULO: ${moduleKey}
TIPO DE FLUJO: ${flowType}

CONTEXTO DE MARCA:
- Nombre: ${brandContext.name}
- Industria: ${brandContext.industry}
- Personalidad: ${brandContext.personality_id}
- Oferta: ${brandContext.offering}

RESPUESTAS DEL USUARIO:
${JSON.stringify(userAnswers, null, 2)}

${dependencies && dependencies.length > 0 ? `
DEPENDENCIAS:
${dependencies.map(d => `- ${d.moduleKey}: ${d.contentSummary}`).join('\n')}
` : ''}

Genera el contenido para este módulo siguiendo las mejores prácticas de branding.
Responde en formato JSON estructurado.
`;
}

/**
 * Construye el system prompt según el tipo de flujo
 */
export function buildSystemPrompt(flowType: FlowType): string {
  const prompts: Record<FlowType, string> = {
    TEXT_FLOW: `Eres un experto en branding y copywriting.
Genera contenido textual de alta calidad para manuales de marca.
Responde SIEMPRE en formato JSON con la estructura: { "title": string, "content": string, "variations": string[], "examples": string[], "guidelines": string[] }`,

    VISUAL_IDENTITY_FLOW: `Eres un experto en diseño de identidad visual.
Genera especificaciones técnicas y guías visuales detalladas.
Responde SIEMPRE en formato JSON con la estructura: { "title": string, "description": string, "specifications": object, "colors": array, "dos": string[], "donts": string[] }`,

    UI_COMPONENT_FLOW: `Eres un experto en diseño de sistemas de UI.
Genera especificaciones de componentes con código y guías de uso.
Responde SIEMPRE en formato JSON con la estructura: { "component_name": string, "description": string, "anatomy": string, "variants": array, "states": string[], "code_example": string }`,

    TEMPLATE_FLOW: `Eres un experto en diseño de plantillas y layouts.
Genera estructuras de templates reutilizables y personalizables.
Responde SIEMPRE en formato JSON con la estructura: { "template_name": string, "description": string, "structure": string, "fields": array, "example_content": string }`,

    MULTIMEDIA_FLOW: `Eres un experto en dirección de contenido multimedia.
Genera guías de producción para fotografía, video, audio y animación.
Responde SIEMPRE en formato JSON con la estructura: { "title": string, "style_guidelines": object, "technical_specs": array, "production_guidelines": array }`,

    INTEGRATION_FLOW: `Eres un experto en integraciones y automatización.
Genera configuraciones de exportación y sincronización.
Responde SIEMPRE en formato JSON con la estructura: { "export_config": object, "sync_specification": object, "file_structure": object }`,
  };

  return prompts[flowType] || prompts.TEXT_FLOW;
}
