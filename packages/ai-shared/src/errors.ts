export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly retriable: boolean;

  constructor(params: {
    message: string;
    code: string;
    statusCode?: number;
    details?: Record<string, unknown>;
    retriable?: boolean;
  }) {
    super(params.message);
    this.name = "AppError";
    this.code = params.code;
    this.statusCode = params.statusCode ?? 500;
    this.details = params.details;
    this.retriable = params.retriable ?? false;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details,
      retriable: false,
    });
    this.name = "ValidationError";
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      message,
      code: "CONFIGURATION_ERROR",
      statusCode: 500,
      details,
      retriable: false,
    });
    this.name = "ConfigurationError";
  }
}

export class PromptRenderError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      message,
      code: "PROMPT_RENDER_ERROR",
      statusCode: 422,
      details,
      retriable: false,
    });
    this.name = "PromptRenderError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, retriable = true) {
    super({
      message,
      code: "PROVIDER_ERROR",
      statusCode: 502,
      details,
      retriable,
    });
    this.name = "ProviderError";
  }
}

export class CircuitBreakerOpenError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      message,
      code: "CIRCUIT_BREAKER_OPEN",
      statusCode: 503,
      details,
      retriable: true,
    });
    this.name = "CircuitBreakerOpenError";
  }
}

export class RateLimitExceededError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      message,
      code: "RATE_LIMIT_EXCEEDED",
      statusCode: 429,
      details,
      retriable: true,
    });
    this.name = "RateLimitExceededError";
  }
}

export function toAppError(error: unknown, fallbackMessage = "Unexpected error"): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      message: error.message,
      code: "UNEXPECTED_ERROR",
      statusCode: 500,
      retriable: false,
    });
  }

  return new AppError({
    message: fallbackMessage,
    code: "UNEXPECTED_ERROR",
    statusCode: 500,
    retriable: false,
  });
}
