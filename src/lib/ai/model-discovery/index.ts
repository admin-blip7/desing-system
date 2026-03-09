/**
 * Sistema de Discovery de Modelos de IA
 * 
 * Unifica el descubrimiento de modelos de diferentes proveedores
 * con sistema de cache para optimizar performance.
 */

import {
  ModelOption,
  DiscoveryResult,
  DiscoveryError,
  CachedDiscovery,
  STATIC_MODELS,
  FLOW_MODEL_RECOMMENDATIONS,
  DISCOVERY_CACHE_KEY,
  DISCOVERY_CACHE_TTL,
  FlowType,
} from "./types";
import { discoverOpenAIModels } from "./openai";
import { discoverAnthropicModels } from "./anthropic";
import { discoverGroqModels } from "./groq";

export * from "./types";
export { discoverOpenAIModels } from "./openai";
export { discoverAnthropicModels } from "./anthropic";
export { discoverGroqModels } from "./groq";

interface DiscoveryOptions {
  useCache?: boolean;
  timeout?: number;
}

/**
 * Descubre modelos de un proveedor específico con cache
 */
export async function discoverModels(
  provider: "openai" | "anthropic" | "groq",
  apiKey: string,
  options: DiscoveryOptions = {}
): Promise<DiscoveryResult> {
  const { useCache = true, timeout = 10000 } = options;

  // Intentar usar cache
  if (useCache) {
    const cached = getCachedDiscovery(provider);
    if (cached) {
      console.log(`[Discovery] Using cached models for ${provider}`);
      return cached.data;
    }
  }

  // Realizar discovery
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let result: DiscoveryResult;

    switch (provider) {
      case "openai":
        result = await discoverOpenAIModels(apiKey);
        break;
      case "anthropic":
        result = await discoverAnthropicModels(apiKey);
        break;
      case "groq":
        result = await discoverGroqModels(apiKey);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    clearTimeout(timeoutId);

    // Guardar en cache
    cacheDiscovery(provider, result);

    return result;
  } catch (error) {
    console.error(`[Discovery] Error discovering ${provider} models:`, error);
    
    // Fallback a modelos estáticos si el discovery falla
    const staticModels = STATIC_MODELS.filter((m) => m.provider === provider);
    if (staticModels.length > 0) {
      console.log(`[Discovery] Falling back to static models for ${provider}`);
      return {
        models: staticModels,
        lastUpdated: new Date().toISOString(),
        provider,
      };
    }

    throw error;
  }
}

/**
 * Descubre modelos de todos los proveedores configurados
 */
export async function discoverAllModels(
  configs: Record<string, string>,
  options: DiscoveryOptions = {}
): Promise<{ results: DiscoveryResult[]; errors: DiscoveryError[] }> {
  const results: DiscoveryResult[] = [];
  const errors: DiscoveryError[] = [];

  const discoveries = Object.entries(configs).map(async ([provider, apiKey]) => {
    if (!apiKey) return;

    try {
      const result = await discoverModels(
        provider as "openai" | "anthropic" | "groq",
        apiKey,
        options
      );
      results.push(result);
    } catch (error) {
      errors.push({
        provider,
        error: error instanceof Error ? error.message : "Unknown error",
        code: error instanceof Error && error.name === "AbortError" ? "TIMEOUT" : "UNKNOWN",
      });
    }
  });

  await Promise.all(discoveries);

  return { results, errors };
}

/**
 * Obtiene modelos cacheados para un proveedor
 */
function getCachedDiscovery(provider: string): CachedDiscovery | null {
  if (typeof window === "undefined") return null;

  try {
    const cacheKey = `${DISCOVERY_CACHE_KEY}-${provider}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;

    const parsed: CachedDiscovery = JSON.parse(cached);
    const now = Date.now();

    // Verificar si el cache expiró
    if (now - parsed.timestamp > DISCOVERY_CACHE_TTL) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Guarda resultados de discovery en cache
 */
function cacheDiscovery(provider: string, data: DiscoveryResult): void {
  if (typeof window === "undefined") return;

  try {
    const cacheKey = `${DISCOVERY_CACHE_KEY}-${provider}`;
    const toCache: CachedDiscovery = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(toCache));
  } catch (error) {
    console.error("[Discovery] Error caching models:", error);
  }
}

/**
 * Limpia el cache de discovery
 */
export function clearDiscoveryCache(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(DISCOVERY_CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("[Discovery] Error clearing cache:", error);
  }
}

/**
 * Filtra modelos por flujo soportado
 */
export function filterModelsByFlow(
  models: ModelOption[],
  flow: FlowType
): ModelOption[] {
  return models.filter((model) => model.supportedFlows.includes(flow));
}

/**
 * Obtiene el modelo recomendado para un flujo
 */
export function getRecommendedModelForFlow(
  models: ModelOption[],
  flow: FlowType
): ModelOption | undefined {
  // Primero buscar modelos marcados como recomendados
  const recommended = models.filter(
    (m) => m.isRecommended && m.supportedFlows.includes(flow)
  );
  
  if (recommended.length > 0) {
    return recommended[0];
  }

  // Luego buscar en la lista de recomendaciones por flujo
  const flowRecommendations = FLOW_MODEL_RECOMMENDATIONS[flow];
  for (const modelId of flowRecommendations) {
    const model = models.find((m) => m.id === modelId && m.supportedFlows.includes(flow));
    if (model) return model;
  }

  // Finalmente, retornar el primer modelo que soporte el flujo
  return models.find((m) => m.supportedFlows.includes(flow));
}

/**
 * Calcula el costo estimado de una generación
 */
export function estimateGenerationCost(
  model: ModelOption,
  estimatedTokens: number = 1500
): {
  inputCost: number;
  outputCost: number;
  totalCost: number;
} {
  const inputTokens = estimatedTokens * 0.7; // 70% input
  const outputTokens = estimatedTokens * 0.3; // 30% output

  const inputCost = (inputTokens / 1000) * model.capabilities.costPer1kInput;
  const outputCost = (outputTokens / 1000) * model.capabilities.costPer1kOutput;

  return {
    inputCost: Math.round(inputCost * 10000) / 10000,
    outputCost: Math.round(outputCost * 10000) / 10000,
    totalCost: Math.round((inputCost + outputCost) * 10000) / 10000,
  };
}

/**
 * Compara modelos y retorna el más económico para un flujo
 */
export function getCheapestModelForFlow(
  models: ModelOption[],
  flow: FlowType
): ModelOption | undefined {
  const compatibleModels = models.filter((m) => m.supportedFlows.includes(flow));
  
  if (compatibleModels.length === 0) return undefined;

  return compatibleModels.reduce((cheapest, current) => {
    const cheapestTotal = cheapest.capabilities.costPer1kInput + cheapest.capabilities.costPer1kOutput;
    const currentTotal = current.capabilities.costPer1kInput + current.capabilities.costPer1kOutput;
    return currentTotal < cheapestTotal ? current : cheapest;
  });
}
