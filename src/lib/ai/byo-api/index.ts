/**
 * BYO API (Bring Your Own API) Module - Main Export
 *
 * Este módulo permite que cada workspace configure sus propias
 * credenciales de API para cada tipo de flujo.
 */

export * from "./types";
export * from "./router";
export * from "./config-storage";

// Re-exportar el router como default
export { default as apiRouter } from "./router";

// Convenience re-exports
export type {
  ApiConfiguration,
  ApiProvider,
  ApiRequest,
  ApiResponse,
  FlowApiConfig,
  FlowType,
  EncryptedCredentials,
  CostTracking,
  ProviderModel,
} from "./types";

export {
  saveFlowApiConfig,
  getWorkspaceApiConfig,
  getFlowApiConfig,
  deleteFlowApiConfig,
  updateSpendTracking,
  getApiUsageStats,
  encryptCredentials,
  decryptCredentials,
} from "./config-storage";
