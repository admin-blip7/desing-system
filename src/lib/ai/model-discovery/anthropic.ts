/**
 * Discovery de modelos Anthropic
 */

import { ModelOption, DiscoveryResult, FlowType } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/models";

// Configuración de modelos Anthropic - Actualizado 2026
const ANTHROPIC_MODEL_CONFIGS: Record<string, Partial<ModelOption>> = {
  "claude-opus-4-6": {
    name: "Claude Opus 4.6",
    description: "Muy fuerte en razonamiento/código - Imagen+texto",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.015,
      costPer1kOutput: 0.075,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "UI_COMPONENT_FLOW", "INTEGRATION_FLOW"],
    isRecommended: true,
  },
  "claude-haiku-4-5-20251001": {
    name: "Claude Haiku 4.5",
    description: "Reemplazo oficial del Haiku 3.5 - Rápido y económico",
    capabilities: {
      maxTokens: 200000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0008,
      costPer1kOutput: 0.004,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
    isRecommended: true,
  },
  "claude-3-7-sonnet-20250219": {
    name: "Claude 3.7 Sonnet",
    description: "Buena relación costo/capacidad (ya no es la gen más nueva)",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-7-sonnet-latest": {
    name: "Claude 3.7 Sonnet (Latest)",
    description: "Última versión de Claude 3.7 Sonnet",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-5-sonnet-20241022": {
    name: "Claude 3.5 Sonnet",
    description: "Balance probado calidad/velocidad",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-5-sonnet-latest": {
    name: "Claude 3.5 Sonnet (Latest)",
    description: "Última versión estable",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-5-haiku-20241022": {
    name: "Claude 3.5 Haiku",
    description: "Ultra-rápido para tareas simples",
    capabilities: {
      maxTokens: 200000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0008,
      costPer1kOutput: 0.004,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-5-haiku-latest": {
    name: "Claude 3.5 Haiku (Latest)",
    description: "Última versión de Haiku",
    capabilities: {
      maxTokens: 200000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0008,
      costPer1kOutput: 0.004,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "claude-3-opus-20240229": {
    name: "Claude 3 Opus",
    description: "Máxima calidad para tareas complejas",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.015,
      costPer1kOutput: 0.075,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW"],
  },
  "claude-3-opus-latest": {
    name: "Claude 3 Opus (Latest)",
    description: "Última versión de Opus",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.015,
      costPer1kOutput: 0.075,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW"],
  },
  "claude-3-sonnet-20240229": {
    name: "Claude 3 Sonnet",
    description: "Versión legacy de Sonnet",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW"],
  },
  "claude-3-haiku-20240307": {
    name: "Claude 3 Haiku",
    description: "Versión legacy de Haiku",
    capabilities: {
      maxTokens: 200000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00025,
      costPer1kOutput: 0.00125,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
};

interface AnthropicModel {
  id: string;
  display_name: string;
  created_at: string;
  type: string;
}

interface AnthropicListResponse {
  data: AnthropicModel[];
  has_more: boolean;
  first_id: string;
  last_id: string;
}

export async function discoverAnthropicModels(apiKey: string): Promise<DiscoveryResult> {
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data: AnthropicListResponse = await response.json();

    // Mapear modelos
    const models: ModelOption[] = data.data
      .filter((model) => ANTHROPIC_MODEL_CONFIGS[model.id])
      .map((model) => {
        const config = ANTHROPIC_MODEL_CONFIGS[model.id];
        return {
          id: model.id,
          name: config.name || model.display_name,
          provider: "anthropic" as const,
          description: config.description || "",
          capabilities: config.capabilities!,
          supportedFlows: config.supportedFlows as FlowType[],
          isRecommended: config.isRecommended,
          isExperimental: config.isExperimental,
        };
      })
      .sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return a.name.localeCompare(b.name);
      });

    return {
      models,
      lastUpdated: new Date().toISOString(),
      provider: "anthropic",
    };
  } catch (error) {
    console.error("Error discovering Anthropic models:", error);
    throw error;
  }
}
