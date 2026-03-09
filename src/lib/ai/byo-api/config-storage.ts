/**
 * Configuration Storage for BYO API
 *
 * Maneja el almacenamiento y recuperación de configuraciones
 * de API por workspace, con encriptación de credenciales.
 *
 * NOTA: Este módulo es un placeholder funcional. Requiere:
 * - Tabla Supabase: workspace_api_configs
 * - Migración para crear la tabla
 */

import type {
  ApiConfiguration,
  EncryptedCredentials,
  FlowApiConfig,
  FlowType,
} from "./types";

// ============================================
// ENCRYPTION/DECRYPTION
// ============================================

const ENCRYPTION_KEY = process.env.API_CONFIG_ENCRYPTION_KEY || "default-key-change-in-production";
const ENCRYPTION_VERSION = "v1";

/**
 * Encripta credenciales usando AES-256 (simulado por ahora)
 * TODO: Implementar encriptación real con crypto module
 */
export function encryptCredentials(apiKey: string): string {
  // Por ahora, base64 encode + version prefix
  const payload = JSON.stringify({
    key: apiKey,
    version: ENCRYPTION_VERSION,
    timestamp: Date.now(),
  });

  return `${ENCRYPTION_VERSION}:${Buffer.from(payload).toString("base64")}`;
}

/**
 * Desencripta credenciales
 */
export function decryptCredentials(encrypted: string): string | null {
  try {
    if (!encrypted.includes(":")) {
      // Asumir formato antiguo sin encriptar
      return encrypted;
    }

    const [version, payload] = encrypted.split(":");

    if (version !== ENCRYPTION_VERSION) {
      console.warn(`Credentials version mismatch: ${version} vs ${ENCRYPTION_VERSION}`);
      return null;
    }

    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    return parsed.key;
  } catch (error) {
    console.error("Error decrypting credentials:", error);
    return null;
  }
}

/**
 * Rota las credenciales a una nueva versión de encriptación
 */
export function rotateCredentials(
  oldEncrypted: string,
  newVersion: string,
): string {
  const apiKey = decryptCredentials(oldEncrypted);
  if (!apiKey) {
    throw new Error("Cannot decrypt credentials for rotation");
  }

  // Actualizar versión globalmente
  // (ENCRYPTION_VERSION = newVersion)

  return encryptCredentials(apiKey);
}

// ============================================
// STORAGE OPERATIONS (PLACEHOLDER)
// ============================================

export interface SaveApiConfigOptions {
  workspaceId: string;
  flowType: FlowType;
  provider: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  enabled?: boolean;
}

/**
 * Guarda o actualiza la configuración de API para un flujo específico
 *
 * PLACEHOLDER: Esta función devuelve success=true pero no guarda en Supabase.
 * Requiere migración de base de datos para funcionar completamente.
 */
export async function saveFlowApiConfig(options: SaveApiConfigOptions): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // TODO: Implementar guardado real en Supabase
    // const supabase = await createClient();
    // ... lógica de guardado ...

    console.log("[PLACEHOLDER] saveFlowApiConfig called with:", {
      workspaceId: options.workspaceId,
      flowType: options.flowType,
      provider: options.provider,
      model: options.model,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving API config:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Obtiene toda la configuración de API de un workspace
 *
 * PLACEHOLDER: Devuelve configuración por defecto
 */
export async function getWorkspaceApiConfig(
  workspaceId: string,
): Promise<ApiConfiguration | null> {
  // TODO: Implementar lectura real de Supabase
  console.log("[PLACEHOLDER] getWorkspaceApiConfig called for:", workspaceId);

  return {
    workspace_id: workspaceId,
    flows: {
      TEXT_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
      VISUAL_IDENTITY_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
      UI_COMPONENT_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
      TEMPLATE_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
      MULTIMEDIA_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
      INTEGRATION_FLOW: {
        enabled: true,
        provider: "openai",
        model: "gpt-4o-mini",
        credentials: undefined,
        cost_tracking: {
          enabled: true,
          current_spend: 0,
          reset_date: getNextMonthStart(),
          cost_per_1k_tokens: 0.01,
        },
        fallback_chain: ["openai", "anthropic"],
      },
    } as Record<FlowType, FlowApiConfig>,
    default_provider: "openai",
    default_model: "gpt-4o-mini",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Obtiene la configuración para un flujo específico
 */
export async function getFlowApiConfig(
  workspaceId: string,
  flowType: FlowType,
): Promise<FlowApiConfig | null> {
  const config = await getWorkspaceApiConfig(workspaceId);
  return config?.flows[flowType] || null;
}

/**
 * Elimina la configuración de API de un flujo
 */
export async function deleteFlowApiConfig(
  workspaceId: string,
  flowType: FlowType,
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implementar eliminación real de Supabase
    console.log("[PLACEHOLDER] deleteFlowApiConfig called with:", workspaceId, flowType);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Actualiza el spending tracking después de una llamada API
 */
export async function updateSpendTracking(
  workspaceId: string,
  flowType: FlowType,
  cost: number,
): Promise<void> {
  // TODO: Implementar tracking real
  console.log("[PLACEHOLDER] updateSpendTracking called with:", workspaceId, flowType, cost);
}

/**
 * Obtiene estadísticas de uso de API de un workspace
 */
export async function getApiUsageStats(
  workspaceId: string,
  period: "month" | "week" | "day" = "month",
): Promise<{
  total_requests: number;
  total_cost: number;
  by_provider: Record<string, { requests: number; cost: number }>;
  by_flow: Record<string, { requests: number; cost: number }>;
}> {
  // TODO: Implementar con tabla de logs de API
  return {
    total_requests: 0,
    total_cost: 0,
    by_provider: {},
    by_flow: {},
  };
}

function getNextMonthStart(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
