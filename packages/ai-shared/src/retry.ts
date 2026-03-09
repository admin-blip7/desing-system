import type { RetryPolicy } from "./types";

export interface RetryContext {
  attempt: number;
  maxAttempts: number;
  lastError: unknown;
}

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function withRetry<T>(
  task: () => Promise<T>,
  policy: RetryPolicy,
  onRetry?: (context: RetryContext) => void
): Promise<{ value: T; retries: number }> {
  let attempt = 0;
  let currentDelay = policy.initialDelayMs;
  let lastError: unknown = null;

  while (attempt < policy.maxAttempts) {
    try {
      const value = await task();
      return {
        value,
        retries: Math.max(0, attempt),
      };
    } catch (error) {
      attempt += 1;
      lastError = error;

      if (attempt >= policy.maxAttempts) {
        throw error;
      }

      if (onRetry) {
        onRetry({
          attempt,
          maxAttempts: policy.maxAttempts,
          lastError,
        });
      }

      await wait(currentDelay);
      currentDelay = Math.min(
        policy.maxDelayMs,
        Math.round(currentDelay * policy.backoffMultiplier)
      );
    }
  }

  throw lastError;
}
