/**
 * BAML Flow Generator Service
 *
 * Servicio unificado que orquesta la generación de módulos
 * usando el sistema de flujos BAML especializados.
 */

import { b } from "@bm/ai-shared/baml_client";
import {
  executeFlow,
  getFlowTypeForModule,
  type FlowRequest,
  type FlowResponse,
  type ExtendedBrandContext as BrandContext,
  type DependencyContext,
} from "./orchestrator";
import type { PersonalityProfile } from "./orchestrator";

// ============================================
// CONTEXT BUILDERS
// ============================================

/**
 * Construye el contexto de marca para generación
 */
export interface BrandContextInput {
  name: string;
  personalityId: string;
  industry?: string;
  offering?: string;
  locale?: string;
  logoUrl?: string;
  personalityProfile?: PersonalityProfile;
}

export function buildBrandContext(input: BrandContextInput): BrandContext {
  return {
    name: input.name,
    personalityId: input.personalityId,
    industry: input.industry,
    offering: input.offering,
    locale: input.locale || "es-ES",
  };
}

/**
 * Construye el contexto de dependencias desde módulos previos
 */
export interface DependencyInput {
  moduleKey: string;
  content: unknown;
}

export function buildDependencyContext(
  dependencies: DependencyInput[],
  maxCharsPerDep = 1500,
): DependencyContext[] {
  return dependencies.map((dep) => {
    let contentSummary = extractTextFromContent(dep.content);

    // Truncar si es muy largo
    if (contentSummary.length > maxCharsPerDep) {
      contentSummary = contentSummary.slice(0, maxCharsPerDep) + "...";
    }

    return {
      moduleKey: dep.moduleKey,
      contentSummary,
    };
  });
}

/**
 * Extrae texto plano de contenido estructurado
 */
function extractTextFromContent(content: unknown): string {
  if (content === null || content === undefined) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item) => extractTextFromContent(item)).join("\n");
  }

  if (typeof content === "object") {
    const asRecord = content as Record<string, unknown>;

    // Buscar __payload primero (versión interna)
    if ("__payload" in asRecord) {
      return extractTextFromContent(asRecord.__payload);
    }

    // Buscar content
    if ("content" in asRecord) {
      return extractTextFromContent(asRecord.content);
    }

    // Buscar text
    if ("text" in asRecord) {
      return extractTextFromContent(asRecord.text);
    }

    // Como último recurso, stringify
    return JSON.stringify(asRecord, null, 2);
  }

  return String(content);
}

// ============================================
// GENERATOR OPTIONS
// ============================================

export interface GeneratorOptions {
  // Opciones de salida
  forceJson?: boolean;
  stream?: boolean;

  // Opciones de flujo
  validateOutput?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;

  // Opciones de presupuesto
  maxTokens?: number;
  temperature?: number;
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

export interface ModuleGenerationRequest {
  brandId: string;
  moduleKey: string;
  moduleName: string;
  phaseId: number;
  brandContext: BrandContextInput;
  userAnswers?: Record<string, unknown>;
  dependencies?: DependencyInput[];
  personalityProfile?: PersonalityProfile;
  options?: GeneratorOptions;
}

export interface ModuleGenerationResponse {
  success: boolean;
  content?: unknown;
  error?: string;
  metadata?: {
    flowType: string;
    generatedAt: string;
    tokensUsed?: number;
    costEstimate?: number;
  };
}

/**
 * Genera contenido para un módulo usando el sistema de flujos BAML
 */
export async function generateModule(
  request: ModuleGenerationRequest,
): Promise<ModuleGenerationResponse> {
  const {
    brandId,
    moduleKey,
    moduleName,
    phaseId,
    brandContext: brandInput,
    userAnswers,
    dependencies,
    personalityProfile,
    options = {},
  } = request;

  try {
    // 1. Determinar el tipo de flujo
    const flowType = getFlowTypeForModule(moduleKey);

    // 2. Construir el request del flujo
    const flowRequest: FlowRequest = {
      flowType,
      moduleKey,
      moduleName,
      brandContext: buildBrandContext(brandInput),
      personalityProfile: personalityProfile || {
        id: brandInput.personalityId || "default",
        name: "Default",
        archetype: "Regular",
        tagline: "",
        philosophy: "",
        key_principles: [],
        dna: "",
      },
      userAnswers: (userAnswers || {}) as Record<string, string>,
      dependencies: dependencies ? buildDependencyContext(dependencies) : [],
      additionalData: {
        brandId,
        phaseId,
      },
    };

    // 3. Ejecutar el flujo
    let response: FlowResponse = {
      success: false,
      error: "Not executed",
    };

    const maxAttempts = options.retryOnError ? (options.maxRetries || 2) : 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      response = await executeFlow(flowRequest, {
        personalityProfile: flowRequest.personalityProfile,
      });

      if (response.success) {
        break;
      }

      // Si es el último intento, fallar
      if (attempt === maxAttempts - 1) {
        return {
          success: false,
          error: response.error || "Generation failed after retries",
          metadata: {
            flowType,
            generatedAt: new Date().toISOString(),
          },
        };
      }

      // Esperar antes de reintentar
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }

    // 4. Validar output si se solicita
    if (options.validateOutput && response.content) {
      // TODO: Implementar validación específica por flujo
      // Por ahora, validación básica
      try {
        JSON.parse(response.content);
      } catch {
        return {
          success: false,
          error: "Generated content is not valid JSON",
          metadata: {
            flowType,
            generatedAt: new Date().toISOString(),
          },
        };
      }
    }

    // 5. Parsear contenido según el tipo de flujo
    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(response.content || "{}");
    } catch {
      // Si no es JSON, devolver como está
      parsedContent = response.content;
    }

    // 6. Enrich con metadatos del módulo
    const enrichedContent = {
      title: `Generado: ${moduleName}`,
      content: parsedContent,
      type: getContentType(flowType),
      timestamp: new Date().toISOString(),
      model: "baml-flow",
      flowType,
      dependencyKeys: dependencies?.map((d) => d.moduleKey) || [],
      personalityId: brandInput.personalityId,
    };

    return {
      success: true,
      content: enrichedContent,
      metadata: {
        flowType,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(`Error generating module ${moduleKey}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Genera múltiples módulos en paralelo cuando sea posible
 */
export async function generateModulesBatch(
  requests: ModuleGenerationRequest[],
  options?: GeneratorOptions,
): Promise<ModuleGenerationResponse[]> {
  return Promise.all(
    requests.map((req) => generateModule({ ...req, options })),
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getContentType(flowType: string): string {
  switch (flowType) {
    case "TEXT_FLOW":
      return "text";
    case "VISUAL_IDENTITY_FLOW":
      return "visual";
    case "UI_COMPONENT_FLOW":
      return "ui";
    case "TEMPLATE_FLOW":
      return "template";
    case "MULTIMEDIA_FLOW":
      return "multimedia";
    case "INTEGRATION_FLOW":
      return "integration";
    default:
      return "text";
  }
}

/**
 * Verifica si un módulo requiere imagen además de texto
 */
export function moduleRequiresImage(moduleKey: string): boolean {
  const imageModules = [
    "logo",
    "photography",
    "illustration",
    "iconography",
    "geometry",
  ];

  return imageModules.includes(moduleKey);
}

/**
 * Verifica si un módulo requiere JSON forzado
 */
export function moduleRequiresJson(moduleKey: string, phaseId: number): boolean {
  // Fases 3, 4, 5, 7 siempre requieren JSON
  if ([3, 4, 5, 7].includes(phaseId)) {
    return true;
  }

  // Módulos específicos que requieren JSON
  const jsonModules = [
    "colorPalette",
    "typography",
    "designTokens",
    "buttons",
    "forms",
    "gridsLayouts",
    "navigation",
    "cardsContainers",
    "tagsStatus",
    "emptyErrorStates",
    "tablesLists",
  ];

  return jsonModules.includes(moduleKey);
}

/**
 * Estima el costo de generación de un módulo
 */
export function estimateGenerationCost(
  moduleKey: string,
  phaseId: number,
): { tokens: number; cost: number } {
  // Estimaciones basadas en el tipo de módulo
  const flowType = getFlowTypeForModule(moduleKey);

  let estimatedTokens = 1000;
  let costPer1k = 0.01; // Default

  switch (flowType) {
    case "TEXT_FLOW":
      estimatedTokens = 1500;
      costPer1k = 0.003; // Anthropic Sonnet
      break;
    case "VISUAL_IDENTITY_FLOW":
      estimatedTokens = 2000;
      costPer1k = 0.005;
      break;
    case "UI_COMPONENT_FLOW":
      estimatedTokens = 2500;
      costPer1k = 0.005;
      break;
    case "TEMPLATE_FLOW":
      estimatedTokens = 3000;
      costPer1k = 0.004;
      break;
    case "MULTIMEDIA_FLOW":
      estimatedTokens = 2000;
      costPer1k = 0.005;
      break;
    case "INTEGRATION_FLOW":
      estimatedTokens = 1000;
      costPer1k = 0.002;
      break;
  }

  const cost = (estimatedTokens / 1000) * costPer1k;

  return {
    tokens: estimatedTokens,
    cost: Math.round(cost * 10000) / 10000, // 4 decimales
  };
}

/**
 * Construye el prompt específico para un módulo
 */
export function buildModulePrompt(
  moduleKey: string,
  moduleName: string,
  phaseId: number,
  brandContext: BrandContext,
  dependencies: DependencyContext[],
  userAnswers: Record<string, unknown>,
): string {
  let prompt = `Genera contenido para el módulo "${moduleName}" de la marca ${brandContext.name}.\n\n`;
  prompt += `## FASE DEL PROYECTO\nFase ${phaseId}\n\n`;
  prompt += `## CONTEXTO OBLIGATORIO DE MARCA\n`;
  prompt += `Debes mantener consistencia estricta con la identidad de marca.\n`;

  if (dependencies.length > 0) {
    prompt += `\n## MÓDULOS PREVIOS RELEVANTES\n`;
    dependencies.forEach((dep) => {
      prompt += `### ${dep.moduleKey}\n${dep.contentSummary}\n\n`;
    });
  }

  if (Object.keys(userAnswers).length > 0) {
    prompt += `\n## RESPUESTAS DEL USUARIO\n`;
    Object.entries(userAnswers).forEach(([key, value]) => {
      prompt += `- ${key}: ${value}\n`;
    });
  }

  return prompt;
}
