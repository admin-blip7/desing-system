import type { AgentId, CostLedgerEntry } from "./types";

export class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BudgetExceededError";
  }
}

export class CostManager {
  private readonly maxBudgetUsd: number;
  private readonly ledger: CostLedgerEntry[] = [];

  constructor(maxBudgetUsd: number) {
    this.maxBudgetUsd = maxBudgetUsd;
  }

  consume(agentId: AgentId, estimatedCostUsd: number, estimatedTokens: number): void {
    if (!Number.isFinite(estimatedCostUsd) || estimatedCostUsd < 0) {
      throw new Error(`Invalid estimated cost for ${agentId}`);
    }

    if (!Number.isFinite(estimatedTokens) || estimatedTokens < 0) {
      throw new Error(`Invalid estimated token count for ${agentId}`);
    }

    const projected = this.getTotalCostUsd() + estimatedCostUsd;
    if (projected > this.maxBudgetUsd) {
      throw new BudgetExceededError(
        `Estimated budget exceeded: $${projected.toFixed(4)} > $${this.maxBudgetUsd.toFixed(4)}`
      );
    }

    this.ledger.push({
      agentId,
      estimatedCostUsd,
      estimatedTokens,
    });
  }

  getTotalCostUsd(): number {
    return this.ledger.reduce((sum, item) => sum + item.estimatedCostUsd, 0);
  }

  getTotalTokens(): number {
    return this.ledger.reduce((sum, item) => sum + item.estimatedTokens, 0);
  }

  getByAgent(): CostLedgerEntry[] {
    return [...this.ledger];
  }
}
