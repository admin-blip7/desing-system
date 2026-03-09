export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

export function sanitizeErrorMessage(message: string): string {
  if (message.toLowerCase().includes("api key")) {
    return "Error de configuración de API. Revisa credenciales del proveedor.";
  }

  if (message.toLowerCase().includes("rate")) {
    return "Límite de solicitudes alcanzado. Intenta más tarde.";
  }

  return message;
}
