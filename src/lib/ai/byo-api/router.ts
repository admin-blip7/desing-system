/**
 * API Router Service
 *
 * Enruta las solicitudes de generación al provider correcto
 * según la configuración del workspace y el tipo de flujo.
 */

import type {
  ApiConfiguration,
  ApiProvider,
  ApiRequest,
  ApiResponse,
  FlowApiConfig,
  FlowType,
  ProviderCapabilities,
  TokenUsage,
  EncryptedCredentials,
} from "./types";

// ============================================
// TYPES FOR DYNAMIC IMPORTS
// ============================================

type ChatCompletionMessageParam = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionCreateParams = {
  model: string;
  messages: ChatCompletionMessageParam[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: "json_object" } | undefined;
};

type ChatCompletionCompletion = {
  choices: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// ============================================
// PROVIDER ADAPTERS
// ============================================

interface ProviderAdapter {
  name: ApiProvider;
  capabilities: ProviderCapabilities;
  generate(request: ApiRequest, config: FlowApiConfig): Promise<ApiResponse>;
}

// Placeholder imports para los SDKs (se cargan dinámicamente)
type OpenAI = any;
type Anthropic = any;
type Groq = any;

/**
 * Simula OpenAI client para evitar importación directa
 */
class OpenAIClientMock {
  chat = {
    completions: {
      create: async (params: ChatCompletionCreateParams) => {
        // Lógica de mock que se reemplaza en runtime
        return {} as ChatCompletionCompletion;
      }
    }
  };
}

/**
 * OpenAI Adapter
 */
class OpenAIAdapter implements ProviderAdapter {
  name = "openai" as const;
  capabilities = {
    streaming: true,
    function_calling: true,
    vision: true,
    json_mode: true,
  } as ProviderCapabilities;

  async generate(request: ApiRequest, config: FlowApiConfig): Promise<ApiResponse> {
    // Importación dinámica para no fallar si el paquete no está instalado
    let OpenAI: any;
    try {
      // @ts-ignore - Paquete opcional
      const module = await import("openai");
      OpenAI = module.OpenAI;
    } catch {
      // Fallback a mock si no está disponible
      OpenAI = OpenAIClientMock as any;
    }

    const apiKey = this.decryptCredentials(config.credentials?.api_key);
    const baseUrl = config.credentials?.base_url;

    const client = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    try {
      const completion: ChatCompletionCompletion = await client.chat.completions.create({
        model: config.model,
        messages: [
          ...(request.system_prompt
            ? [{ role: "system" as const, content: request.system_prompt }]
            : []),
          { role: "user" as const, content: request.prompt },
        ],
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature ?? 0.7,
        response_format: request.force_json ? { type: "json_object" as const } : undefined,
      } as any);

      const content = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return {
        success: true,
        content,
        usage: usage
          ? {
              prompt_tokens: usage.prompt_tokens,
              completion_tokens: usage.completion_tokens,
              total_tokens: usage.total_tokens,
            }
          : undefined,
        provider_used: this.name,
        model_used: config.model,
        cost_estimate: this.calculateCost(
          usage?.prompt_tokens || 0,
          usage?.completion_tokens || 0,
          config,
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error),
        provider_used: this.name,
        model_used: config.model,
      };
    }
  }

  private decryptCredentials(encryptedKey?: string): string {
    // TODO: Implementar desencriptación AES-256
    // Por ahora, asume que ya está desencriptado o es null
    return encryptedKey || process.env.OPENAI_API_KEY || "";
  }

  private parseError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown OpenAI error";
  }

  private calculateCost(
    promptTokens: number,
    completionTokens: number,
    config: FlowApiConfig,
  ): number {
    const inputCost = (promptTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    const outputCost =
      (completionTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    return inputCost + outputCost;
  }
}

/**
 * Anthropic/Claude Adapter
 */
class AnthropicAdapter implements ProviderAdapter {
  name = "anthropic" as const;
  capabilities = {
    streaming: true,
    function_calling: true,
    vision: true,
    json_mode: true,
  } as ProviderCapabilities;

  async generate(request: ApiRequest, config: FlowApiConfig): Promise<ApiResponse> {
    // Importación dinámica para evitar errores si no está instalado
    let Anthropic: any;
    try {
      // @ts-ignore - Paquete opcional
      const module = await import("@anthropic-ai/sdk");
      Anthropic = module.default;
    } catch {
      // Mock si no está disponible
      Anthropic = class {
        async messages() {
          return { content: [], usage: { input_tokens: 0, output_tokens: 0 } };
        }
      } as any;
    }

    const apiKey = this.decryptCredentials(config.credentials?.api_key);

    const client = new (Anthropic as any)({ apiKey });

    try {
      const messages = [
        ...(request.system_prompt
          ? [{ role: "user", content: `System: ${request.system_prompt}\n\n${request.prompt}` }]
          : [{ role: "user", content: request.prompt }]),
      ];

      const completion = await client.messages.create({
        model: config.model,
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature ?? 0.7,
        messages,
      });

      const contentBlock = completion.content.find((block: any) => block.type === "text");
      const content = contentBlock?.type === "text" ? contentBlock.text : "";

      return {
        success: true,
        content,
        usage: {
          prompt_tokens: completion.usage.input_tokens,
          completion_tokens: completion.usage.output_tokens,
          total_tokens: completion.usage.input_tokens + completion.usage.output_tokens,
        },
        provider_used: this.name,
        model_used: config.model,
        cost_estimate: this.calculateCost(
          completion.usage.input_tokens,
          completion.usage.output_tokens,
          config,
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error),
        provider_used: this.name,
        model_used: config.model,
      };
    }
  }

  private decryptCredentials(encryptedKey?: string): string {
    // TODO: Implementar desencriptación AES-256
    return encryptedKey || process.env.ANTHROPIC_API_KEY || "";
  }

  private parseError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown Anthropic error";
  }

  private calculateCost(
    promptTokens: number,
    completionTokens: number,
    config: FlowApiConfig,
  ): number {
    const inputCost = (promptTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    const outputCost =
      (completionTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    return inputCost + outputCost;
  }
}

/**
 * Groq Adapter (Llama, Mixtral ultra rápido)
 */
class GroqAdapter implements ProviderAdapter {
  name = "groq" as const;
  capabilities = {
    streaming: true,
    function_calling: true,
    vision: false,
    json_mode: true,
  } as ProviderCapabilities;

  async generate(request: ApiRequest, config: FlowApiConfig): Promise<ApiResponse> {
    // Importación dinámica
    let Groq: any;
    try {
      // @ts-ignore - Paquete opcional
      const module = await import("groq-sdk");
      Groq = module.Groq;
    } catch {
      // Mock si no está disponible
      Groq = class {
        async chat() {
          return { choices: [{ message: { content: "" } }], usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } };
        }
      };
    }

    const apiKey = this.decryptCredentials(config.credentials?.api_key);

    const client = new Groq({ apiKey });

    try {
      const completion = await client.chat.completions.create({
        model: config.model,
        messages: [
          ...(request.system_prompt
            ? [{ role: "system", content: request.system_prompt }]
            : []),
          { role: "user", content: request.prompt },
        ],
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature ?? 0.7,
        response_format: request.force_json ? { type: "json_object" } : undefined,
      });

      const content = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return {
        success: true,
        content,
        usage: usage
          ? {
              prompt_tokens: usage.prompt_tokens,
              completion_tokens: usage.completion_tokens,
              total_tokens: usage.total_tokens,
            }
          : undefined,
        provider_used: this.name,
        model_used: config.model,
        cost_estimate: this.calculateCost(
          usage?.prompt_tokens || 0,
          usage?.completion_tokens || 0,
          config,
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error),
        provider_used: this.name,
        model_used: config.model,
      };
    }
  }

  private decryptCredentials(encryptedKey?: string): string {
    return encryptedKey || process.env.GROQ_API_KEY || "";
  }

  private parseError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown Groq error";
  }

  private calculateCost(
    promptTokens: number,
    completionTokens: number,
    config: FlowApiConfig,
  ): number {
    const inputCost = (promptTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    const outputCost =
      (completionTokens / 1000) * config.cost_tracking.cost_per_1k_tokens;
    return inputCost + outputCost;
  }
}

// ============================================
// ROUTER CLASS
// ============================================

class ApiRouter {
  private adapters: Map<string, ProviderAdapter>;

  constructor() {
    this.adapters = new Map<string, ProviderAdapter>([
      ["openai", new OpenAIAdapter()],
      ["anthropic", new AnthropicAdapter()],
      ["groq", new GroqAdapter()],
      // Agregar más adapters según se necesiten
    ]);
  }

  /**
   * Enruta una solicitud al provider configurado
   */
  async routeRequest(
    flowType: FlowType,
    request: ApiRequest,
    config: ApiConfiguration,
  ): Promise<ApiResponse> {
    const flowConfig = config.flows[flowType];

    if (!flowConfig?.enabled) {
      // Usar configuración por defecto
      return this.useDefaultProvider(flowType, request);
    }

    // Intentar con el provider principal
    let result = await this.executeWithProvider(flowConfig, request);

    // Si falló y hay fallback chain, intentar alternativas
    if (!result.success && flowConfig.fallback_chain.length > 0) {
      for (const fallbackProvider of flowConfig.fallback_chain) {
        const fallbackConfig = { ...flowConfig, provider: fallbackProvider };
        result = await this.executeWithProvider(fallbackConfig, request);

        if (result.success) {
          break;
        }
      }
    }

    // Actualizar tracking de costos si fue exitoso
    if (result.success && result.cost_estimate) {
      flowConfig.cost_tracking.current_spend += result.cost_estimate;
    }

    return result;
  }

  /**
   * Ejecuta con un provider específico
   */
  private async executeWithProvider(
    config: FlowApiConfig,
    request: ApiRequest,
  ): Promise<ApiResponse> {
    const adapter = this.adapters.get(config.provider as string);

    if (!adapter) {
      return {
        success: false,
        error: `No adapter found for provider: ${config.provider}`,
        provider_used: config.provider as ApiProvider,
        model_used: config.model,
      };
    }

    // Check rate limit
    if (config.rate_limit) {
      const withinLimit = await this.checkRateLimit(config);
      if (!withinLimit) {
        return {
          success: false,
          error: "Rate limit exceeded for this provider",
          provider_used: config.provider,
          model_used: config.model,
        };
      }
    }

    // Check budget limit
    if (
      config.cost_tracking.budget_limit &&
      config.cost_tracking.current_spend >= config.cost_tracking.budget_limit
    ) {
      return {
        success: false,
        error: "Budget limit exceeded for this provider",
        provider_used: config.provider,
        model_used: config.model,
      };
    }

    return adapter.generate(request, config);
  }

  /**
   * Usa el provider por defecto de la aplicación
   */
  private async useDefaultProvider(
    flowType: FlowType,
    request: ApiRequest,
  ): Promise<ApiResponse> {
    // Fallback a OpenAI o Anthropic según disponibilidad
    const defaultProvider: ApiProvider = process.env.OPENAI_API_KEY ? ("openai" as const) : ("anthropic" as const);

    const adapter = this.adapters.get(defaultProvider);
    if (!adapter) {
      return {
        success: false,
        error: "No default provider available",
        provider_used: defaultProvider,
        model_used: "unknown",
      };
    }

    const defaultConfig: FlowApiConfig = {
      enabled: true,
      provider: defaultProvider,
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4o",
      cost_tracking: {
        enabled: false,
        current_spend: 0,
        reset_date: new Date().toISOString(),
        cost_per_1k_tokens: 0.01,
      },
      fallback_chain: [],
    };

    return adapter.generate(request, defaultConfig);
  }

  /**
   * Verifica si la solicitud está dentro del rate limit
   */
  private async checkRateLimit(config: FlowApiConfig): Promise<boolean> {
    // TODO: Implementar rate limiting con Redis o memoria compartida
    return true;
  }

  /**
   * Obtiene el adapter para un provider específico
   */
  getAdapter(provider: string): ProviderAdapter | undefined {
    return this.adapters.get(provider);
  }

  /**
   * Registra un nuevo adapter
   */
  registerAdapter(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.name as string, adapter);
  }
}

// Singleton instance
const router = new ApiRouter();

export default router;
export { ApiRouter, type ProviderAdapter };
