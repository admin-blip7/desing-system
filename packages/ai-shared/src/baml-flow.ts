import type { ZodType } from "zod";
import {
  CircuitBreakerOpenError,
  RateLimitExceededError,
  ValidationError,
  toAppError,
} from "./errors";
import { renderPromptTemplate } from "./template-engine";
import { InMemoryRateLimiter } from "./rate-limit";
import { withRetry } from "./retry";
import { validateOutput } from "./output-validator";
import { CircuitBreaker } from "./circuit-breaker";
import type {
  AgentExecutionResult,
  AgentId,
  AgentRuntimeConfig,
  AiProvider,
  BrandContext,
  Logger,
  PromptTemplateVersionSeed,
  PromptVersionRegistry,
  RetryPolicy,
  CircuitBreakerConfig,
  RateLimitConfig,
} from "./types";

export interface BamlModuleDefinition<TInput, TOutput> {
  moduleId: AgentId;
  inputSchema: ZodType<TInput>;
  outputSchema: ZodType<TOutput>;
  promptSeedFactory: (brandContext: BrandContext) => PromptTemplateVersionSeed;
  fallbackFactory: (params: {
    input: TInput;
    brandContext: BrandContext;
    dependencies: Record<string, unknown>;
  }) => TOutput;
}

export interface ExecuteBamlModuleParams<TInput, TOutput> {
  definition: BamlModuleDefinition<TInput, TOutput>;
  input: unknown;
  brandContext: BrandContext;
  dependencies?: Record<string, unknown>;
  runtime: AgentRuntimeConfig;
  retryPolicy: RetryPolicy;
  provider: AiProvider;
  promptRegistry: PromptVersionRegistry;
  logger: Logger;
  circuitBreakerConfig: CircuitBreakerConfig;
  rateLimitConfig: RateLimitConfig;
  rateLimitKey: string;
  mockResponseFactory?: (fallback: TOutput) => string;
}

const rateLimiter = new InMemoryRateLimiter();
const circuitBreakerByModule = new Map<string, CircuitBreaker>();

function getCircuitBreaker(key: string, config: CircuitBreakerConfig): CircuitBreaker {
  const existing = circuitBreakerByModule.get(key);
  if (existing) {
    return existing;
  }

  const created = new CircuitBreaker(config);
  circuitBreakerByModule.set(key, created);
  return created;
}

export async function executeBamlModule<TInput, TOutput>(
  params: ExecuteBamlModuleParams<TInput, TOutput>
): Promise<AgentExecutionResult<TOutput>> {
  const startedAt = Date.now();
  const {
    definition,
    brandContext,
    dependencies = {},
    runtime,
    retryPolicy,
    provider,
    promptRegistry,
    logger,
    circuitBreakerConfig,
    rateLimitConfig,
    rateLimitKey,
    mockResponseFactory,
  } = params;

  const parsedInput = definition.inputSchema.safeParse(params.input);
  if (!parsedInput.success) {
    throw new ValidationError("Module input validation failed", {
      moduleId: definition.moduleId,
      issues: parsedInput.error.flatten(),
    });
  }

  const input = parsedInput.data;

  const rateLimitResult = rateLimiter.check(rateLimitKey, rateLimitConfig.limit, rateLimitConfig.windowMs);
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError("Rate limit exceeded for module execution", {
      moduleId: definition.moduleId,
      resetAt: new Date(rateLimitResult.resetAt).toISOString(),
    });
  }

  const seed = definition.promptSeedFactory(brandContext);
  await promptRegistry.ensureTemplateVersion(seed);
  const activeTemplate = await promptRegistry.getActiveTemplate(brandContext.brandId, definition.moduleId);

  if (!activeTemplate) {
    throw new ValidationError("No active prompt template found", {
      moduleId: definition.moduleId,
      brandId: brandContext.brandId,
    });
  }

  const rendered = renderPromptTemplate({
    template: activeTemplate,
    brandContext,
    input: input as unknown as Record<string, unknown>,
    dependencies,
    metadata: {
      moduleId: definition.moduleId,
    },
  });

  const fallback = definition.fallbackFactory({
    input,
    brandContext,
    dependencies,
  });

  const breakerKey = `${brandContext.brandId}::${definition.moduleId}`;
  const breaker = getCircuitBreaker(breakerKey, circuitBreakerConfig);

  let retries = 0;
  let warnings: string[] = [];
  let validatedPayload: TOutput | null = null;

  try {
    const { value, retries: retryCount } = await withRetry(
      () =>
        breaker.execute(() =>
          provider.complete({
            model: runtime.model,
            temperature: runtime.temperature,
            maxTokens: runtime.maxTokens,
            systemPrompt: rendered.systemPrompt,
            userPrompt: rendered.userPrompt,
            timeoutMs: circuitBreakerConfig.timeoutMs,
            metadata: {
              moduleId: definition.moduleId,
              brandId: brandContext.brandId,
              mockResponse: mockResponseFactory ? mockResponseFactory(fallback) : JSON.stringify(fallback),
            },
          })
        ),
      retryPolicy,
      ({ attempt, maxAttempts, lastError }) => {
        logger.warn("Retrying baml module", {
          moduleId: definition.moduleId,
          attempt,
          maxAttempts,
          error: lastError instanceof Error ? lastError.message : "Unknown error",
        });
      }
    );

    retries = retryCount;
    validatedPayload = validateOutput(definition.outputSchema, value.content);

    return {
      agentId: definition.moduleId,
      payload: validatedPayload,
      metrics: {
        durationMs: Date.now() - startedAt,
        estimatedTokens: value.usage.inputTokens + value.usage.outputTokens,
        estimatedCostUsd: Number(((value.usage.inputTokens + value.usage.outputTokens) * 0.000002).toFixed(6)),
        retries,
      },
    };
  } catch (error) {
    const appError = toAppError(error, "BAML execution failed");

    if (appError instanceof CircuitBreakerOpenError || appError.retriable) {
      warnings = [
        `Fallback applied for ${definition.moduleId}: ${appError.message}`,
      ];
      logger.warn("BAML fallback applied", {
        moduleId: definition.moduleId,
        reason: appError.message,
        code: appError.code,
      });

      return {
        agentId: definition.moduleId,
        payload: fallback,
        warnings,
        metrics: {
          durationMs: Date.now() - startedAt,
          estimatedTokens: Math.ceil(JSON.stringify(fallback).length / 4),
          estimatedCostUsd: 0,
          retries,
        },
      };
    }

    throw appError;
  }
}
