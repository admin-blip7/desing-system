import type { CircuitBreakerConfig } from "./types";
import { CircuitBreakerOpenError } from "./errors";

export type CircuitBreakerState = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: CircuitBreakerState = "closed";
  private failures = 0;
  private successes = 0;
  private openedAt = 0;

  constructor(private readonly config: CircuitBreakerConfig) {}

  getState(): CircuitBreakerState {
    if (this.state === "open" && Date.now() - this.openedAt >= this.config.cooldownMs) {
      this.state = "half-open";
      this.failures = 0;
      this.successes = 0;
    }

    return this.state;
  }

  private markFailure(): void {
    this.failures += 1;
    this.successes = 0;

    if (this.failures >= this.config.failureThreshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }

  private markSuccess(): void {
    if (this.state === "half-open") {
      this.successes += 1;
      if (this.successes >= this.config.successThreshold) {
        this.state = "closed";
        this.failures = 0;
        this.successes = 0;
      }
      return;
    }

    this.failures = 0;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    const state = this.getState();

    if (state === "open") {
      throw new CircuitBreakerOpenError("Circuit breaker is open", {
        cooldownMs: this.config.cooldownMs,
      });
    }

    try {
      const result = await operation();
      this.markSuccess();
      return result;
    } catch (error) {
      this.markFailure();
      throw error;
    }
  }
}
