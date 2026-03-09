/**
 * Discovery de modelos Groq
 */

import { ModelOption, DiscoveryResult, FlowType } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/models";

// Configuración de modelos Groq
const GROQ_MODEL_CONFIGS: Record<string, Partial<ModelOption>> = {
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    description: "Open source ultra-rápido",
    capabilities: {
      maxTokens: 131072,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00059,
      costPer1kOutput: 0.00079,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
    isRecommended: true,
  },
  "llama-3.1-70b-versatile": {
    name: "Llama 3.1 70B",
    description: "Versión anterior de Llama 70B",
    capabilities: {
      maxTokens: 131072,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00059,
      costPer1kOutput: 0.00079,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B",
    description: "Versión ligera ultra-rápida",
    capabilities: {
      maxTokens: 131072,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00005,
      costPer1kOutput: 0.00008,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "mixtral-8x7b-32768": {
    name: "Mixtral 8x7B",
    description: "Económico y versátil",
    capabilities: {
      maxTokens: 32768,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00024,
      costPer1kOutput: 0.00024,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "gemma-7b-it": {
    name: "Gemma 7B",
    description: "Modelo ligero de Google",
    capabilities: {
      maxTokens: 8192,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.00007,
      costPer1kOutput: 0.00007,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
  "gemma2-9b-it": {
    name: "Gemma 2 9B",
    description: "Versión mejorada de Gemma",
    capabilities: {
      maxTokens: 8192,
      supportsVision: false,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.0002,
      costPer1kOutput: 0.0002,
    },
    supportedFlows: ["TEXT_FLOW", "TEMPLATE_FLOW"],
  },
};

interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  active: boolean;
  context_window: number;
}

interface GroqListResponse {
  object: string;
  data: GroqModel[];
}

export async function discoverGroqModels(apiKey: string): Promise<DiscoveryResult> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data: GroqListResponse = await response.json();

    // Mapear modelos activos
    const models: ModelOption[] = data.data
      .filter((model) => model.active && GROQ_MODEL_CONFIGS[model.id])
      .map((model) => {
        const config = GROQ_MODEL_CONFIGS[model.id];
        return {
          id: model.id,
          name: config.name || model.id,
          provider: "groq" as const,
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
      provider: "groq",
    };
  } catch (error) {
    console.error("Error discovering Groq models:", error);
    throw error;
  }
}
