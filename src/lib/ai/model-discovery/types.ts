/**
 * Tipos para el sistema de discovery de modelos de IA
 */

export type FlowType =
  | "TEXT_FLOW"
  | "VISUAL_IDENTITY_FLOW"
  | "UI_COMPONENT_FLOW"
  | "TEMPLATE_FLOW"
  | "MULTIMEDIA_FLOW"
  | "INTEGRATION_FLOW";

export interface ModelCapability {
  maxTokens: number;
  supportsVision: boolean;
  supportsStreaming: boolean;
  supportsJson: boolean;
  costPer1kInput: number;
  costPer1kOutput: number;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "groq" | "openrouter";
  description: string;
  capabilities: ModelCapability;
  supportedFlows: FlowType[];
  isRecommended?: boolean;
  isExperimental?: boolean;
}

export interface DiscoveryResult {
  models: ModelOption[];
  lastUpdated: string;
  provider: string;
}

export interface DiscoveryError {
  provider: string;
  error: string;
  code: string;
}

// Cache configuration
export const DISCOVERY_CACHE_KEY = "ai-model-discovery-cache";
export const DISCOVERY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedDiscovery {
  data: DiscoveryResult;
  timestamp: number;
}

// Modelos estáticos de respaldo (cuando no se puede hacer discovery)
export const STATIC_MODELS: ModelOption[] = [
  // OpenAI Models - Actualizados según especificaciones 2026
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
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
  {
    id: "gpt-5.3-codex",
    name: "GPT-5.3 Codex",
    provider: "openai",
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
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
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
  {
    id: "gpt-5-nano",
    name: "GPT-5 Nano",
    provider: "openai",
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
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
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
  {
    id: "o3",
    name: "o3",
    provider: "openai",
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
  {
    id: "o3-mini",
    name: "o3 Mini",
    provider: "openai",
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
  // Anthropic Models
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
    provider: "anthropic",
    description: "Mejor balance calidad/velocidad",
    capabilities: {
      maxTokens: 200000,
      supportsVision: true,
      supportsStreaming: true,
      supportsJson: true,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    },
    supportedFlows: ["TEXT_FLOW", "VISUAL_IDENTITY_FLOW", "MULTIMEDIA_FLOW", "TEMPLATE_FLOW"],
    isRecommended: true,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
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
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
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
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
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
  // Groq Models
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
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
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
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
];

// Mapeo de modelos a flujos recomendados - Actualizado 2026 según especificaciones
export const FLOW_MODEL_RECOMMENDATIONS: Record<FlowType, string[]> = {
  // TEXT_FLOW: gpt-5.2 como flagship, alternativas por costo, y claude-opus-4-6 para contraste
  TEXT_FLOW: ["gpt-5.2", "gpt-5-mini", "gpt-5-nano", "claude-opus-4-6"],
  
  // VISUAL_IDENTITY_FLOW: visión + razonamiento, gpt-4o solo como fallback
  VISUAL_IDENTITY_FLOW: ["gpt-5.2", "claude-opus-4-6", "gpt-4o"],
  
  // UI_COMPONENT_FLOW: coding fuerte, con opción Codex para workflows asistidos
  UI_COMPONENT_FLOW: ["gpt-5.2", "gpt-5.3-codex", "claude-opus-4-6"],
  
  // TEMPLATE_FLOW: velocidad + costo, nuevo claude-haiku-4-5 (reemplaza haiku 3.5)
  TEMPLATE_FLOW: ["gpt-5-nano", "gpt-5-mini", "claude-haiku-4-5-20251001"],
  
  // MULTIMEDIA_FLOW: visión + contexto largo, trabajo agentic
  MULTIMEDIA_FLOW: ["claude-opus-4-6", "gpt-5.2", "claude-3-7-sonnet-20250219"],
  
  // INTEGRATION_FLOW: tool-use + razonamiento + robustez
  INTEGRATION_FLOW: ["gpt-5.2", "claude-opus-4-6", "gpt-5-mini"],
}; 