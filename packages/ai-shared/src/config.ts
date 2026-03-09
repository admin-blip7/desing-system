import type {
  AgentId,
  AgentRuntimeConfig,
  AgentRuntimeConfigMap,
  BrandFlowConfig,
  BrandFlowConfigOverrides,
  PromptTemplateMap,
  RetryPolicy,
  ResilienceConfig,
  PerformanceConfig,
} from "./types";

const AGENT_IDS: AgentId[] = [
  "brand-strategy",
  "competitive-research",
  "visual-identity",
  "copywriting",
  "tone-analysis",
  "brand-consistency-validator",
];

const DEFAULT_AGENT_RUNTIME: AgentRuntimeConfig = {
  model: "gpt-5-mini",
  temperature: 0.5,
  maxTokens: 1800,
};

function createRuntimeDefaults(): AgentRuntimeConfigMap {
  return AGENT_IDS.reduce<AgentRuntimeConfigMap>((acc, agentId) => {
    acc[agentId] = { ...DEFAULT_AGENT_RUNTIME };
    return acc;
  }, {} as AgentRuntimeConfigMap);
}

function createPromptDefaults(): PromptTemplateMap {
  return {
    "brand-strategy": {
      systemPrompt: "Act as a senior brand strategist.",
      instructionPrompt: "Return concise strategic brand foundations and differentiators.",
    },
    "competitive-research": {
      systemPrompt: "Act as a market intelligence analyst.",
      instructionPrompt: "Generate risk-aware competitor insights and whitespace opportunities.",
    },
    "visual-identity": {
      systemPrompt: "Act as a visual identity designer.",
      instructionPrompt: "Define coherent color, typography and iconography recommendations.",
    },
    copywriting: {
      systemPrompt: "Act as a brand copywriter.",
      instructionPrompt: "Draft messaging assets aligned to strategy and audience.",
    },
    "tone-analysis": {
      systemPrompt: "Act as a linguistic tone evaluator.",
      instructionPrompt: "Score tone dimensions and recommend actionable corrections.",
    },
    "brand-consistency-validator": {
      systemPrompt: "Act as a brand governance reviewer.",
      instructionPrompt: "Detect cross-artifact inconsistencies and assign severity.",
    },
  };
}

export function createDefaultRetryPolicy(): RetryPolicy {
  return {
    maxAttempts: 3,
    initialDelayMs: 250,
    backoffMultiplier: 2,
    maxDelayMs: 2000,
  };
}

export function createDefaultResilienceConfig(): ResilienceConfig {
  return {
    rateLimit: {
      limit: 30,
      windowMs: 60_000,
    },
    circuitBreaker: {
      failureThreshold: 3,
      successThreshold: 2,
      cooldownMs: 10_000,
      timeoutMs: 8_000,
    },
    requestTimeoutMs: 8_000,
  };
}

export function createDefaultPerformanceConfig(): PerformanceConfig {
  return {
    targetLatencyMs: 4_000,
  };
}

export function createDefaultBrandFlowConfig(): BrandFlowConfig {
  return {
    budgetUsd: 0.25,
    maxRefinementCycles: 2,
    outputPreference: "detailed",
    retryPolicy: createDefaultRetryPolicy(),
    runtime: createRuntimeDefaults(),
    prompts: createPromptDefaults(),
    resilience: createDefaultResilienceConfig(),
    performance: createDefaultPerformanceConfig(),
  };
}

function mergeRuntime(
  base: AgentRuntimeConfigMap,
  overrides?: Partial<Record<AgentId, Partial<AgentRuntimeConfig>>>
): AgentRuntimeConfigMap {
  if (!overrides) return base;

  const merged = { ...base };
  for (const agentId of AGENT_IDS) {
    merged[agentId] = {
      ...base[agentId],
      ...(overrides[agentId] || {}),
    };
  }

  return merged;
}

function mergePrompts(
  base: PromptTemplateMap,
  overrides?: Partial<Record<AgentId, Partial<PromptTemplateMap[AgentId]>>>
): PromptTemplateMap {
  if (!overrides) return base;

  const merged = { ...base };
  for (const agentId of AGENT_IDS) {
    merged[agentId] = {
      ...base[agentId],
      ...(overrides[agentId] || {}),
    };
  }

  return merged;
}

export function mergeBrandFlowConfig(overrides?: BrandFlowConfigOverrides): BrandFlowConfig {
  const defaults = createDefaultBrandFlowConfig();

  if (!overrides) {
    return defaults;
  }

  return {
    ...defaults,
    ...overrides,
    retryPolicy: {
      ...defaults.retryPolicy,
      ...(overrides.retryPolicy || {}),
    },
    runtime: mergeRuntime(defaults.runtime, overrides.runtime),
    prompts: mergePrompts(defaults.prompts, overrides.prompts),
    resilience: {
      ...defaults.resilience,
      ...(overrides.resilience || {}),
      rateLimit: {
        ...defaults.resilience.rateLimit,
        ...(overrides.resilience?.rateLimit || {}),
      },
      circuitBreaker: {
        ...defaults.resilience.circuitBreaker,
        ...(overrides.resilience?.circuitBreaker || {}),
      },
    },
    performance: {
      ...defaults.performance,
      ...(overrides.performance || {}),
    },
  };
}
