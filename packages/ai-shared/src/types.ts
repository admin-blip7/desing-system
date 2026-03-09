export type AgentId =
  | "brand-strategy"
  | "competitive-research"
  | "visual-identity"
  | "copywriting"
  | "tone-analysis"
  | "brand-consistency-validator";

export type SessionStatus = "created" | "running" | "completed" | "failed";
export type OutputPreference = "concise" | "detailed";

export interface BrandBriefInput {
  brandName: string;
  industry: string;
  description: string;
  audience: string;
  goals: string[];
  personality: string[];
  competitors?: string[];
  constraints?: string[];
  locale?: string;
  outputPreference?: OutputPreference;
}

export interface BrandVoiceGuidelines {
  tone: string;
  do: string[];
  dont: string[];
  lexicalPreferences: string[];
}

export interface BrandStyleGuidelines {
  archetype: string;
  visualKeywords: string[];
  colorMood: string;
  typographyMood: string;
}

export interface BrandContext {
  brandId: string;
  brandName: string;
  locale: string;
  promptProfile: string;
  voice: BrandVoiceGuidelines;
  style: BrandStyleGuidelines;
  metadata?: Record<string, unknown>;
}

export interface StrategyOutput {
  brandEssence: string;
  positioningStatement: string;
  mission: string;
  vision: string;
  values: string[];
  differentiators: string[];
}

export interface CompetitiveResearchOutput {
  competitorInsights: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketSignals: string[];
  }>;
  whitespaceOpportunities: string[];
  strategicRisks: string[];
}

export interface VisualIdentityOutput {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    neutrals: string[];
  };
  typography: {
    headingFamily: string;
    bodyFamily: string;
    weights: string[];
  };
  logoDirections: string[];
  iconographySystem: {
    style: "outline" | "filled" | "duotone";
    strokeWeight: number;
    cornerStyle: "rounded" | "sharp" | "mixed";
    guidance: string;
  };
}

export interface CopywritingOutput {
  tagline: string;
  elevatorPitch: string;
  voicePillars: string[];
  messagingByChannel: Array<{
    channel: "web" | "social" | "email";
    headline: string;
    body: string;
    callToAction: string;
  }>;
}

export interface ToneAnalysisOutput {
  dominantTone: string;
  scores: {
    formal: number;
    playful: number;
    technical: number;
    emotional: number;
  };
  recommendations: string[];
}

export type ValidationSeverity = "low" | "medium" | "high";

export interface ConsistencyIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  affectedArea: string;
}

export interface ConsistencyValidationOutput {
  passed: boolean;
  score: number;
  issues: ConsistencyIssue[];
  recommendations: string[];
}

export interface BrandGenerationArtifacts {
  strategy: StrategyOutput;
  competitiveResearch: CompetitiveResearchOutput;
  visualIdentity: VisualIdentityOutput;
  copywriting: CopywritingOutput;
  toneAnalysis: ToneAnalysisOutput;
  consistency: ConsistencyValidationOutput;
}

export interface AgentMetrics {
  durationMs: number;
  estimatedTokens: number;
  estimatedCostUsd: number;
  retries: number;
}

export interface AgentExecutionResult<TPayload> {
  agentId: AgentId;
  payload: TPayload;
  metrics: AgentMetrics;
  warnings?: string[];
}

export interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

export interface AgentRuntimeConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export type AgentRuntimeConfigMap = Record<AgentId, AgentRuntimeConfig>;

export interface PromptTemplate {
  systemPrompt: string;
  instructionPrompt: string;
}

export interface FewShotExample {
  input: string;
  output: string;
  rationale?: string;
}

export interface PromptTemplateVersionSeed {
  templateId: string;
  moduleId: AgentId;
  brandId: string;
  version: string;
  systemTemplate: string;
  instructionTemplate: string;
  fewShotExamples: FewShotExample[];
  outputFormatHint?: string;
  tags?: string[];
}

export interface PromptTemplateVersionRecord extends PromptTemplateVersionSeed {
  createdAt: string;
  updatedAt: string;
  checksum: string;
  active: boolean;
}

export interface PromptRenderResult {
  systemPrompt: string;
  userPrompt: string;
  variables: Record<string, unknown>;
  usedTemplate: PromptTemplateVersionRecord;
}

export interface PromptTemplateMap {
  [key: string]: PromptTemplate;
}

export interface PromptVersionRegistry {
  ensureTemplateVersion(seed: PromptTemplateVersionSeed): Promise<PromptTemplateVersionRecord>;
  getActiveTemplate(brandId: string, moduleId: AgentId): Promise<PromptTemplateVersionRecord | null>;
  setActiveVersion(brandId: string, moduleId: AgentId, version: string): Promise<PromptTemplateVersionRecord>;
  listVersions(brandId: string, moduleId: AgentId): Promise<PromptTemplateVersionRecord[]>;
}

export interface AICompletionRequest {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  userPrompt: string;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  raw?: unknown;
}

export interface AiProvider {
  name: string;
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  cooldownMs: number;
  timeoutMs: number;
}

export interface ResilienceConfig {
  rateLimit: RateLimitConfig;
  circuitBreaker: CircuitBreakerConfig;
  requestTimeoutMs: number;
}

export interface PerformanceConfig {
  targetLatencyMs: number;
}

export interface BrandFlowConfig {
  budgetUsd: number;
  maxRefinementCycles: number;
  outputPreference: OutputPreference;
  retryPolicy: RetryPolicy;
  runtime: AgentRuntimeConfigMap;
  prompts: PromptTemplateMap;
  resilience: ResilienceConfig;
  performance: PerformanceConfig;
}

export interface BrandFlowConfigOverrides {
  budgetUsd?: number;
  maxRefinementCycles?: number;
  outputPreference?: OutputPreference;
  retryPolicy?: Partial<RetryPolicy>;
  runtime?: Partial<Record<AgentId, Partial<AgentRuntimeConfig>>>;
  prompts?: Partial<Record<AgentId, Partial<PromptTemplate>>>;
  resilience?: Partial<{
    rateLimit: Partial<RateLimitConfig>;
    circuitBreaker: Partial<CircuitBreakerConfig>;
    requestTimeoutMs: number;
  }>;
  performance?: Partial<PerformanceConfig>;
}

export interface LogEvent {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  sessionId: string;
  context?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  getEvents(): LogEvent[];
}

export interface OrchestratorExecutionContext {
  sessionId: string;
  logger: Logger;
  config: BrandFlowConfig;
  brandContext: BrandContext;
}

export interface CostLedgerEntry {
  agentId: AgentId;
  estimatedCostUsd: number;
  estimatedTokens: number;
}

export interface BrandFlowRunResult {
  sessionId: string;
  status: "completed" | "failed";
  artifacts: BrandGenerationArtifacts;
  cyclesUsed: number;
  costSummary: {
    totalEstimatedCostUsd: number;
    totalEstimatedTokens: number;
    byAgent: CostLedgerEntry[];
  };
  trace: LogEvent[];
  startedAt: string;
  completedAt: string;
}

export interface BrandGenerationSession {
  id: string;
  userId: string;
  brandId: string;
  moduleKey?: string;
  status: SessionStatus;
  input: BrandBriefInput;
  brandContext: BrandContext;
  config: BrandFlowConfig;
  result: BrandFlowRunResult | null;
  error: string | null;
  logs: LogEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandGenerationSessionInput {
  userId: string;
  brandId: string;
  moduleKey?: string;
  input: BrandBriefInput;
  brandContext: BrandContext;
  config?: BrandFlowConfigOverrides;
}

export interface BamlModuleManifest {
  id: AgentId;
  displayName: string;
  description: string;
  inputContract: string[];
  outputContract: string[];
  promptVersion: string;
}
