import test from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  ProviderError,
  createStructuredLogger,
  executeBamlModule,
  FilePromptVersionRegistry,
  loadBrandFlowEnv,
  renderPromptTemplate,
  type PromptTemplateVersionRecord,
} from "../src/index";

test("renderPromptTemplate injects variables and few-shot block", () => {
  const template: PromptTemplateVersionRecord = {
    templateId: "copy-core",
    moduleId: "copywriting",
    brandId: "brand_test",
    version: "1.0.0",
    systemTemplate: "Act as {{brand.style.archetype}} writer.",
    instructionTemplate: "Write tagline for {{brand.brandName}} with {{input.goal}}.",
    fewShotExamples: [
      {
        input: '{"goal":"Retención"}',
        output: '{"tagline":"..." }',
      },
    ],
    outputFormatHint: "JSON only",
    tags: ["test"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checksum: "abc",
    active: true,
  };

  const rendered = renderPromptTemplate({
    template,
    brandContext: {
      brandId: "brand_test",
      brandName: "Atlas",
      locale: "es-ES",
      promptProfile: "default",
      voice: {
        tone: "claro",
        do: ["ser concreto"],
        dont: ["sobreprometer"],
        lexicalPreferences: ["claridad"],
      },
      style: {
        archetype: "Builder",
        visualKeywords: ["moderno"],
        colorMood: "high contrast",
        typographyMood: "clean",
      },
    },
    input: {
      goal: "Retención",
    },
  });

  assert.match(rendered.systemPrompt, /Builder/);
  assert.match(rendered.userPrompt, /Atlas/);
  assert.match(rendered.userPrompt, /Few-shot examples/);
  assert.match(rendered.userPrompt, /Output format/);
});

test("FilePromptVersionRegistry can activate different versions", async () => {
  const filePath = path.join(
    process.cwd(),
    ".tmp",
    `prompt-registry-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
  );
  const registry = new FilePromptVersionRegistry(filePath);

  await registry.ensureTemplateVersion({
    templateId: "brand-strategy-core",
    moduleId: "brand-strategy",
    brandId: "brand_test",
    version: "1.0.0",
    systemTemplate: "v1",
    instructionTemplate: "v1",
    fewShotExamples: [],
  });

  await registry.ensureTemplateVersion({
    templateId: "brand-strategy-core",
    moduleId: "brand-strategy",
    brandId: "brand_test",
    version: "1.1.0",
    systemTemplate: "v2",
    instructionTemplate: "v2",
    fewShotExamples: [],
  });

  const before = await registry.getActiveTemplate("brand_test", "brand-strategy");
  assert.equal(before?.version, "1.0.0");

  await registry.setActiveVersion("brand_test", "brand-strategy", "1.1.0");
  const after = await registry.getActiveTemplate("brand_test", "brand-strategy");
  assert.equal(after?.version, "1.1.0");

  await rm(filePath, { force: true });
});

test("executeBamlModule applies fallback when provider fails retriable", async () => {
  const registry = new FilePromptVersionRegistry(
    path.join(process.cwd(), ".tmp", `prompt-registry-flow-${Date.now()}.json`)
  );

  const logger = createStructuredLogger("session_test");

  const result = await executeBamlModule({
    definition: {
      moduleId: "copywriting",
      inputSchema: z.object({ seed: z.string() }),
      outputSchema: z.object({ value: z.string() }),
      promptSeedFactory: (brandContext) => ({
        templateId: "copy-core",
        moduleId: "copywriting",
        brandId: brandContext.brandId,
        version: "1.0.0",
        systemTemplate: "System {{brand.brandName}}",
        instructionTemplate: "Instruction {{input.seed}}",
        fewShotExamples: [],
      }),
      fallbackFactory: () => ({
        value: "fallback",
      }),
    },
    input: { seed: "hello" },
    brandContext: {
      brandId: "brand_fallback_test",
      brandName: "Fallback Brand",
      locale: "es-ES",
      promptProfile: "default",
      voice: {
        tone: "neutral",
        do: ["claridad"],
        dont: ["hype"],
        lexicalPreferences: ["sistema"],
      },
      style: {
        archetype: "Builder",
        visualKeywords: ["clean"],
        colorMood: "neutral",
        typographyMood: "simple",
      },
    },
    dependencies: {},
    runtime: {
      model: "gpt-5-mini",
      temperature: 0.5,
      maxTokens: 200,
    },
    retryPolicy: {
      maxAttempts: 2,
      initialDelayMs: 1,
      backoffMultiplier: 2,
      maxDelayMs: 10,
    },
    provider: {
      name: "failing-provider",
      complete: async () => {
        throw new ProviderError("Temporary upstream error", { provider: "failing-provider" }, true);
      },
    },
    promptRegistry: registry,
    logger,
    circuitBreakerConfig: {
      failureThreshold: 2,
      successThreshold: 1,
      cooldownMs: 10,
      timeoutMs: 500,
    },
    rateLimitConfig: {
      limit: 10,
      windowMs: 30_000,
    },
    rateLimitKey: `rate:${Date.now()}:${Math.random()}`,
  });

  assert.equal(result.payload.value, "fallback");
  assert.ok(result.warnings && result.warnings.length > 0);
});

test("loadBrandFlowEnv validates required api key for openai provider", () => {
  assert.throws(
    () =>
      loadBrandFlowEnv({
        NODE_ENV: "test",
        AI_PROVIDER: "openai",
        OPENAI_API_KEY: "",
      }),
    /OPENAI_API_KEY is required/
  );
});
