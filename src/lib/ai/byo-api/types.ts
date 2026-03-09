/**
 * BYO API (Bring Your Own API) Module
 *
 * Permite que cada workspace configure sus propias credenciales de API
 * para cada tipo de flujo, reduciendo costos y dando flexibilidad total.
 */

// ============================================
// CORE TYPES
// ============================================

export type ApiProvider =
  | "openai"          // GPT-4, GPT-4o, GPT-3.5
  | "anthropic"       // Claude 3 (Opus, Sonnet, Haiku)
  | "azure"           // Azure OpenAI
  | "google"          // Gemini 1.5 (Pro, Flash)
  | "groq"            // Llama 3.1, Mixtral (ultra rápido)
  | "cohere"          // Command R+
  | "mistral"         // Mistral Large
  | "stability"       // Stable Diffusion XL
  | "replicate"       // Modelos custom
  | "custom";         // Endpoints propios

export type FlowType =
  | "TEXT_FLOW"
  | "VISUAL_IDENTITY_FLOW"
  | "UI_COMPONENT_FLOW"
  | "TEMPLATE_FLOW"
  | "MULTIMEDIA_FLOW"
  | "INTEGRATION_FLOW";

export interface ApiConfiguration {
  workspace_id: string;
  flows: Record<FlowType, FlowApiConfig>;
  default_provider: ApiProvider;
  default_model: string;
  created_at: string;
  updated_at: string;
}

export interface FlowApiConfig {
  enabled: boolean;
  provider: ApiProvider;
  model: string;
  credentials?: EncryptedCredentials;
  cost_tracking: CostTracking;
  fallback_chain: ApiProvider[];
  rate_limit?: RateLimit;
}

export interface EncryptedCredentials {
  api_key: string;        // Encriptado con AES-256
  api_key_encrypted_at: string;
  api_key_version: string;  // Para rotación de keys
  base_url?: string;       // Opcional para endpoints custom
  headers?: Record<string, string>;  // Headers adicionales
}

export interface CostTracking {
  enabled: boolean;
  budget_limit?: number;   // Límite mensual en USD
  current_spend: number;
  reset_date: string;      // ISO date cuando se resetea el spend
  cost_per_1k_tokens: number;
}

export interface RateLimit {
  requests_per_minute?: number;
  tokens_per_minute?: number;
  concurrent_requests?: number;
}

export interface ProviderModel {
  provider: ApiProvider;
  model: string;
  display_name: string;
  type: "text" | "image" | "multimodal";
  input_cost_per_1k: number;  // USD
  output_cost_per_1k: number;  // USD
  max_tokens?: number;
  features: string[];
}

export interface ProviderCapabilities {
  streaming: boolean;
  function_calling: boolean;
  vision: boolean;
  json_mode: boolean;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface ApiRequest {
  flow_type: FlowType;
  prompt: string;
  system_prompt?: string;
  force_json?: boolean;
  max_tokens?: number;
  temperature?: number;
  additional_params?: Record<string, unknown>;
}

export interface ApiResponse {
  success: boolean;
  content?: string;
  usage?: TokenUsage;
  error?: string;
  provider_used: ApiProvider;
  model_used: string;
  cost_estimate?: number;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// ============================================
// RECOMMENDED PROVIDERS BY FLOW
// ============================================

export const RECOMMENDED_PROVIDERS: Record<FlowType, ProviderModel[]> = {
  TEXT_FLOW: [
    {
      provider: "openai",
      model: "gpt-5",
      display_name: "GPT-5",
      type: "text",
      input_cost_per_1k: 0.005,
      output_cost_per_1k: 0.015,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-5-mini",
      display_name: "GPT-5 Mini",
      type: "text",
      input_cost_per_1k: 0.0005,
      output_cost_per_1k: 0.002,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-7-sonnet-20250219",
      display_name: "Claude 3.7 Sonnet",
      type: "text",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      display_name: "Claude 3.5 Sonnet",
      type: "text",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "groq",
      model: "llama-3.1-70b-versatile",
      display_name: "Llama 3.1 70B (Groq)",
      type: "text",
      input_cost_per_1k: 0.00059,
      output_cost_per_1k: 0.00079,
      max_tokens: 131072,
      features: ["streaming", "function_calling", "json_mode"],
    },
  ],

  VISUAL_IDENTITY_FLOW: [
    {
      provider: "openai",
      model: "gpt-4o",
      display_name: "GPT-4o",
      type: "multimodal",
      input_cost_per_1k: 0.0025,
      output_cost_per_1k: 0.01,
      max_tokens: 128000,
      features: ["streaming", "vision", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-4.5-preview",
      display_name: "GPT-4.5 Preview",
      type: "multimodal",
      input_cost_per_1k: 0.075,
      output_cost_per_1k: 0.15,
      max_tokens: 128000,
      features: ["streaming", "vision", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-7-sonnet-20250219",
      display_name: "Claude 3.7 Sonnet",
      type: "multimodal",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "vision", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-opus-20240229",
      display_name: "Claude 3 Opus",
      type: "multimodal",
      input_cost_per_1k: 0.015,
      output_cost_per_1k: 0.075,
      max_tokens: 200000,
      features: ["streaming", "vision", "json_mode"],
    },
  ],

  UI_COMPONENT_FLOW: [
    {
      provider: "openai",
      model: "gpt-4o",
      display_name: "GPT-4o",
      type: "text",
      input_cost_per_1k: 0.0025,
      output_cost_per_1k: 0.01,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-5-mini",
      display_name: "GPT-5 Mini",
      type: "text",
      input_cost_per_1k: 0.0005,
      output_cost_per_1k: 0.002,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-7-sonnet-20250219",
      display_name: "Claude 3.7 Sonnet",
      type: "text",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "function_calling", "json_mode"],
    },
  ],

  TEMPLATE_FLOW: [
    {
      provider: "anthropic",
      model: "claude-3-5-haiku-20241022",
      display_name: "Claude 3.5 Haiku",
      type: "text",
      input_cost_per_1k: 0.0008,
      output_cost_per_1k: 0.004,
      max_tokens: 200000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-5-nano",
      display_name: "GPT-5 Nano",
      type: "text",
      input_cost_per_1k: 0.0001,
      output_cost_per_1k: 0.0005,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      display_name: "GPT-4o Mini",
      type: "text",
      input_cost_per_1k: 0.00015,
      output_cost_per_1k: 0.0006,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
  ],

  MULTIMEDIA_FLOW: [
    {
      provider: "anthropic",
      model: "claude-3-7-sonnet-20250219",
      display_name: "Claude 3.7 Sonnet",
      type: "multimodal",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "vision", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      display_name: "Claude 3.5 Sonnet",
      type: "multimodal",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "vision", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-4o",
      display_name: "GPT-4o",
      type: "multimodal",
      input_cost_per_1k: 0.0025,
      output_cost_per_1k: 0.01,
      max_tokens: 128000,
      features: ["streaming", "vision", "json_mode"],
    },
  ],

  INTEGRATION_FLOW: [
    {
      provider: "openai",
      model: "gpt-5",
      display_name: "GPT-5",
      type: "text",
      input_cost_per_1k: 0.005,
      output_cost_per_1k: 0.015,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "openai",
      model: "gpt-4o",
      display_name: "GPT-4o",
      type: "text",
      input_cost_per_1k: 0.0025,
      output_cost_per_1k: 0.01,
      max_tokens: 128000,
      features: ["streaming", "function_calling", "json_mode"],
    },
    {
      provider: "anthropic",
      model: "claude-3-7-sonnet-20250219",
      display_name: "Claude 3.7 Sonnet",
      type: "text",
      input_cost_per_1k: 0.003,
      output_cost_per_1k: 0.015,
      max_tokens: 200000,
      features: ["streaming", "function_calling", "json_mode"],
    },
  ],
};

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

export const DEFAULT_FLOW_CONFIG: Record<FlowType, Omit<FlowApiConfig, 'credentials'>> = {
  TEXT_FLOW: {
    enabled: true,
    provider: "openai",
    model: "gpt-5",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.005,
    },
    fallback_chain: ["anthropic", "groq"],
    rate_limit: {
      requests_per_minute: 60,
      tokens_per_minute: 100000,
    },
  },

  VISUAL_IDENTITY_FLOW: {
    enabled: true,
    provider: "openai",
    model: "gpt-4o",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.0025,
    },
    fallback_chain: ["anthropic", "groq"],
    rate_limit: {
      requests_per_minute: 60,
      tokens_per_minute: 100000,
    },
  },

  UI_COMPONENT_FLOW: {
    enabled: true,
    provider: "openai",
    model: "gpt-4o",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.0025,
    },
    fallback_chain: ["anthropic", "groq"],
  },

  TEMPLATE_FLOW: {
    enabled: true,
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.0008,
    },
    fallback_chain: ["openai", "groq"],
  },

  MULTIMEDIA_FLOW: {
    enabled: true,
    provider: "anthropic",
    model: "claude-3-7-sonnet-20250219",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.003,
    },
    fallback_chain: ["openai", "groq"],
  },

  INTEGRATION_FLOW: {
    enabled: true,
    provider: "openai",
    model: "gpt-5",
    cost_tracking: {
      enabled: true,
      current_spend: 0,
      reset_date: getNextMonthStart(),
      cost_per_1k_tokens: 0.005,
    },
    fallback_chain: ["anthropic", "groq"],
  },
};

function getNextMonthStart(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
