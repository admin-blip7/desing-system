import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const brandBriefInputSchema = z.object({
  brandName: nonEmptyString.max(120),
  industry: nonEmptyString.max(80),
  description: nonEmptyString.min(20).max(2000),
  audience: nonEmptyString.min(10).max(1000),
  goals: z.array(nonEmptyString).min(1).max(12),
  personality: z.array(nonEmptyString).min(1).max(10),
  competitors: z.array(nonEmptyString).max(15).optional(),
  constraints: z.array(nonEmptyString).max(20).optional(),
  locale: z.string().trim().min(2).max(35).optional(),
  outputPreference: z.enum(["concise", "detailed"]).optional(),
});

export const brandContextSchema = z.object({
  brandId: nonEmptyString,
  brandName: nonEmptyString,
  locale: z.string().trim().min(2).max(35),
  promptProfile: nonEmptyString,
  voice: z.object({
    tone: nonEmptyString,
    do: z.array(nonEmptyString).min(1),
    dont: z.array(nonEmptyString).min(1),
    lexicalPreferences: z.array(nonEmptyString).min(1),
  }),
  style: z.object({
    archetype: nonEmptyString,
    visualKeywords: z.array(nonEmptyString).min(1),
    colorMood: nonEmptyString,
    typographyMood: nonEmptyString,
  }),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const retryPolicySchema = z.object({
  maxAttempts: z.number().int().min(1).max(8),
  initialDelayMs: z.number().int().min(50).max(30_000),
  backoffMultiplier: z.number().min(1).max(5),
  maxDelayMs: z.number().int().min(100).max(60_000),
});

export const resilienceSchema = z.object({
  rateLimit: z
    .object({
      limit: z.number().int().min(1).max(2000),
      windowMs: z.number().int().min(100).max(3_600_000),
    })
    .partial()
    .optional(),
  circuitBreaker: z
    .object({
      failureThreshold: z.number().int().min(1).max(20),
      successThreshold: z.number().int().min(1).max(10),
      cooldownMs: z.number().int().min(100).max(600_000),
      timeoutMs: z.number().int().min(250).max(60_000),
    })
    .partial()
    .optional(),
  requestTimeoutMs: z.number().int().min(500).max(120_000).optional(),
});

export const sessionCreateRequestSchema = z.object({
  brandId: nonEmptyString,
  moduleKey: nonEmptyString.optional(),
  input: brandBriefInputSchema,
  brandContext: brandContextSchema.optional(),
  config: z
    .object({
      budgetUsd: z.number().min(0.001).max(50).optional(),
      maxRefinementCycles: z.number().int().min(1).max(5).optional(),
      outputPreference: z.enum(["concise", "detailed"]).optional(),
      retryPolicy: retryPolicySchema.partial().optional(),
      runtime: z
        .record(
          z.string(),
          z.object({
            model: nonEmptyString,
            temperature: z.number().min(0).max(2),
            maxTokens: z.number().int().min(128).max(8192),
          })
        )
        .optional(),
      prompts: z
        .record(
          z.string(),
          z.object({
            systemPrompt: nonEmptyString,
            instructionPrompt: nonEmptyString,
          })
        )
        .optional(),
      resilience: resilienceSchema.optional(),
      performance: z
        .object({
          targetLatencyMs: z.number().int().min(250).max(120_000).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const promptTemplateVersionSeedSchema = z.object({
  templateId: nonEmptyString,
  moduleId: nonEmptyString,
  brandId: nonEmptyString,
  version: nonEmptyString,
  systemTemplate: nonEmptyString,
  instructionTemplate: nonEmptyString,
  fewShotExamples: z
    .array(
      z.object({
        input: nonEmptyString,
        output: nonEmptyString,
        rationale: z.string().trim().optional(),
      })
    )
    .default([]),
  outputFormatHint: z.string().trim().optional(),
  tags: z.array(nonEmptyString).optional(),
});

export type SessionCreateRequest = z.infer<typeof sessionCreateRequestSchema>;
