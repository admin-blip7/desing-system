import test from "node:test";
import assert from "node:assert/strict";
import {
  buildBrandTextInstruction,
  buildBrandedImagePrompt,
  resolveBrandGovernanceProfile,
  validateBrandTextOutput,
  validateBrandedImagePrompt,
} from "@/lib/ai/brand-governance";

test("resolveBrandGovernanceProfile returns configured profile by personality id", () => {
  const profile = resolveBrandGovernanceProfile({ personalityId: "apple" });
  assert.equal(profile.id, "apple");
  assert.ok(profile.text.terminology.length > 0);
});

test("buildBrandTextInstruction injects tone, terminology and few-shot content", () => {
  const profile = resolveBrandGovernanceProfile({ personalityId: "default" });
  const systemPrompt = buildBrandTextInstruction({
    moduleName: "voice",
    brandName: "Acme",
    locale: "es-ES",
    profile,
    requiresJson: false,
  });

  assert.match(systemPrompt, /Tono de voz obligatorio/);
  assert.match(systemPrompt, /Terminologia corporativa obligatoria/);
  assert.match(systemPrompt, /Few-shot calibrados desde manual de marca/);
});

test("validateBrandTextOutput fails when forbidden terms appear", () => {
  const profile = resolveBrandGovernanceProfile({ personalityId: "default" });
  const validation = validateBrandTextOutput({
    output: "Esta oferta es la mejor del mundo y garantizado al 100%.",
    profile,
    requiresJson: false,
    requiredTermsMin: 1,
  });

  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.includes("terminos prohibidos")));
});

test("buildBrandedImagePrompt and validation include palette and negative prompts", () => {
  const profile = resolveBrandGovernanceProfile({ personalityId: "linear" });
  const prompt = buildBrandedImagePrompt({
    basePrompt: "Genera una portada para dashboard de producto.",
    moduleName: "visual-identity",
    profile,
    paletteOverride: ["#123456", "#ABCDEF"],
  });

  assert.match(prompt.positivePrompt, /Corporate palette/);
  assert.ok(prompt.negativePrompt.length > 0);

  const validation = validateBrandedImagePrompt(prompt);
  assert.equal(validation.valid, true);
});
