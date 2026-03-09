/**
 * Discovery de modelos OpenAI
 */

import { ModelOption, DiscoveryResult, FlowType } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/models";

// Mapeo de modelos OpenAI a sus capacidades - Actualizado 2026
const OPENAI_MODEL_CONFIGS: Record<string, Partial<ModelOption>> = {
  "gpt-5.2": {
    name: "GPT-5.2",
    description: "Mejor general/agentic hoy - Flagship OpenAI",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.005,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "UI_COMPONENT_FLOW", "INTEGRATION_FLOW"],
    isRecommended: true,
  },
  "gpt-5.3-codex": {
    name: "GPT-5.3 Codex",
    description: "Especializado para coding y workflows de desarrollo",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.006,
      costPer1kOutput: 0.018,
    },
    supportedFlows: ["UI_COMPONENT_FLOW", "INTEGRATION_FLOW"],
  },
  "gpt-5-mini": {
    name: "GPT-5 Mini",
    description: "Rápido y más barato que full",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0005,
      costPer1kOutput: 0.002,
    },
    supportedFlows: ["TEXT_FLOW", "UI_COMPONENT_FLOW", "TEMPLATE_FLOW", "INTEGRATION_FLOW"],
  },
  "gpt-5-nano": {
    name: "GPT-5 Nano",
    description: "Ultra barato para clasificación/resúmenes y plantillas",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0001,
      costPer1kOutput: 0.0005,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
    isRecommended: true,
  },
  "gpt-5-chatgpt-mini": {
    name: "GPT-5 ChatGPT Mini",
    description: "Optimizado para ChatGPT",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0005,
      costPer1kOutput: 0.002,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "gpt-4.5-preview": {
    name: "GPT-4.5 Preview",
    description: "Modelo experimental avanzado",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.075,
      costPer1kOutput: 0.15,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW"],
    isExperimental: true,
  },
  "gpt-4o": {
    name: "GPT-4o",
    description: "Multimodal legacy - Fallback (se depreca 2026-02-13)",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0025,
      costPer1kOutput: 0.01,
    },
    supportedFlows: ["VISUAL_IDENTITY_FLOW"],
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    description: "Versión económica de GPT-4o",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00015,
      costPer1kOutput: 0.0006,
    },
    supportedFlows: ["TEXT_FLOW", "UI_COMPONENT_FLOW", "TEMPLATE_FLOW"],
  },
  "gpt-4-turbo": {
    name: "GPT-4 Turbo",
    description: "Versión turbo de GPT-4",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.01,
      costPer1kOutput: 0.03,
    },
    supportedFlows: ["TEXT_FLOW", "UI_COMPONENT_FLOW"],
  },
  "gpt-4-turbo-preview": {
    name: "GPT-4 Turbo Preview",
    description: "Preview de GPT-4 Turbo",
    capabilities: {
      maxTokens: 128000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.01,
      costPer1kOutput: 0.03,
    },
    supportedFlows: ["TEXT_FLOW", "UI_COMPONENT_FLOW"],
  },
  "gpt-4": {
    name: "GPT-4",
    description: "GPT-4 clásico",
    capabilities: {
      maxTokens: 8192,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.03,
      costPer1kOutput: 0.06,
    },
    supportedFlows: ["TEXT_FLOW"],
  },
  "gpt-4-32k": {
    name: "GPT-4 32K",
    description: "GPT-4 con ventana de 32K",
    capabilities: {
      maxTokens: 32768,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.06,
      costPer1kOutput: 0.12,
    },
    supportedFlows: ["TEXT_FLOW"],
  },
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    description: "Modelo económico legacy",
    capabilities: {
      maxTokens: 16385,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0005,
      costPer1kOutput: 0.0015,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "gpt-3.5-turbo-16k": {
    name: "GPT-3.5 Turbo 16K",
    description: "GPT-3.5 con ventana extendida",
    capabilities: {
      maxTokens: 16385,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.001,
      costPer1kOutput: 0.002,
    },
    supportedFlows: ["TEXT_FLOW"],
  },
  "o3": {
    name: "o3",
    description: "Razonamiento avanzado",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.01,
      costPer1kOutput: 0.03,
    },
    supportedFlows: ["TEXT_FLOW"],
  },
  "o3-mini": {
    name: "o3 Mini",
    description: "Razonamiento económico",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0011,
      costPer1kOutput: 0.0044,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "o1": {
    name: "o1",
    description: "Razonamiento complejo",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.015,
      costPer1kOutput: 0.06,
    },
    supportedFlows: ["TEXT_FLOW"],
  },
  "o1-mini": {
    name: "o1 Mini",
    description: "Razonamiento económico",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0011,
      costPer1kOutput: 0.0044,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "o1-preview": {
    name: "o1 Preview",
    description: "Preview de razonamiento",
    capabilities: {
      maxTokens: 128000,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.015,
      costPer1kOutput: 0.06,
    },
    supportedFlows: ["TEXT_FLOW"],
    isExperimental: true,
  },
};

// Modelos a excluir del discovery (embedding, audio, etc)
const EXCLUDED_MODELS = [
  "dall-e",
  "whisper",
  "tts",
  "text-embedding",
  "babbage",
  "davinci",
  "curie",
  "ada",
];

interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface OpenAIListResponse {
  object: string;
  data: OpenAIModel[];
}

export async function discoverOpenAIModels(apiKey: string): Promise<DiscoveryResult> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data: OpenAIListResponse = await response.json();

    // Filtrar y mapear modelos
    const models: ModelOption[] = data.data
      .filter((model) => {
        // Excluir modelos no útiles
        const isExcluded = EXCLUDED_MODELS.some((excluded) =>
          model.id.toLowerCase().includes(excluded.toLowerCase())
        );
        return !isExcluded && OPENAI_MODEL_CONFIGS[model.id];
      })
      .map((model) => {
        const config = OPENAI_MODEL_CONFIGS[model.id];
        return {
          id: model.id,
          name: config.name || model.id,
          provider: "openai" as const,
          description: config.description || "",
          capabilities: config.capabilities!,
          supportedFlows: config.supportedFlows as FlowType[],
          isRecommended: config.isRecommended,
          isExperimental: config.isExperimental,
        };
      })
      .sort((a, b) => {
        // Ordenar: recomendados primero, luego por nombre
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return a.name.localeCompare(b.name);
      });

    return {
      models,
      lastUpdated: new Date().toISOString(),
      provider: "openai",
    };
  } catch (error) {
    console.error("Error discovering OpenAI models:", error);
    throw error;
  }
}
