import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";

const fewShotExampleSchema = z.object({
  input: z.string().trim().min(1),
  output: z.string().trim().min(1),
  source: z.string().trim().optional(),
});

const textGovernanceSchema = z.object({
  tone: z.string().trim().min(1),
  terminology: z.array(z.string().trim().min(1)).min(1),
  outputFormat: z.string().trim().min(1),
  fewShotExamples: z.array(fewShotExampleSchema).default([]),
  forbiddenTerms: z.array(z.string().trim().min(1)).default([]),
});

const imageGovernanceSchema = z.object({
  styleDescriptors: z.array(z.string().trim().min(1)).min(1),
  paletteHex: z.array(z.string().trim().min(1)).min(1),
  compositionGuidelines: z.array(z.string().trim().min(1)).min(1),
  negativePrompts: z.array(z.string().trim().min(1)).min(1),
});

const profileSchema = z.object({
  id: z.string().trim().min(1),
  text: textGovernanceSchema,
  image: imageGovernanceSchema,
});

const profileFileSchema = z.object({
  defaultProfileId: z.string().trim().min(1),
  profiles: z.record(z.string(), profileSchema),
});

export type BrandTextFewShotExample = z.infer<typeof fewShotExampleSchema>;
export type BrandGovernanceProfile = z.infer<typeof profileSchema>;

interface BrandGovernanceProfileFile {
  defaultProfileId: string;
  profiles: Record<string, BrandGovernanceProfile>;
}

const DEFAULT_PROFILE: BrandGovernanceProfile = {
  id: "default",
  text: {
    tone: "Profesional, claro y accionable",
    terminology: ["consistencia", "lineamiento", "implementacion"],
    outputFormat: "Markdown breve, estructurado y verificable.",
    fewShotExamples: [],
    forbiddenTerms: ["mejor del mundo", "garantizado al 100%"],
  },
  image: {
    styleDescriptors: ["clean composition", "high legibility"],
    paletteHex: ["#0F172A", "#E2E8F0", "#F59E0B"],
    compositionGuidelines: [
      "prioritize one focal element",
      "preserve negative space",
    ],
    negativePrompts: ["off-brand colors", "watermarks", "logo distortion"],
  },
};

let cache: BrandGovernanceProfileFile | null = null;
let cachePath: string | null = null;

function normalizeString(value: string): string {
  return value.trim();
}

function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.startsWith("#") ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
  return /^#[0-9A-F]{6}$/.test(normalized) ? normalized : null;
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = normalizeString(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }

  return output;
}

function dedupeHex(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const rawValue of values) {
    const value = normalizeHex(rawValue);
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }

  return output;
}

function resolveConfigPath(configPath?: string): string {
  const target = configPath || process.env.BRAND_AI_ASSETS_FILE || "config/brand-ai-assets.default.json";
  return path.isAbsolute(target) ? target : path.join(process.cwd(), target);
}

function fallbackProfiles(): BrandGovernanceProfileFile {
  return {
    defaultProfileId: DEFAULT_PROFILE.id,
    profiles: {
      [DEFAULT_PROFILE.id]: DEFAULT_PROFILE,
    },
  };
}

function loadProfiles(configPath?: string): BrandGovernanceProfileFile {
  const resolvedPath = resolveConfigPath(configPath);
  if (cache && cachePath === resolvedPath) {
    return cache;
  }

  try {
    const raw = readFileSync(resolvedPath, "utf-8");
    const parsedJson = JSON.parse(raw);
    const parsed = profileFileSchema.safeParse(parsedJson);

    if (!parsed.success) {
      cache = fallbackProfiles();
      cachePath = resolvedPath;
      return cache;
    }

    cache = parsed.data;
    cachePath = resolvedPath;
    return cache;
  } catch {
    cache = fallbackProfiles();
    cachePath = resolvedPath;
    return cache;
  }
}

function renderFewShotExamples(examples: BrandTextFewShotExample[]): string {
  if (!examples.length) {
    return "No hay ejemplos few-shot disponibles para este perfil.";
  }

  return examples
    .map((example, index) => {
      const source = example.source ? `\nFuente: ${example.source}` : "";
      return [
        `Ejemplo ${index + 1} - Input:`,
        example.input,
        `Ejemplo ${index + 1} - Output esperado:`,
        example.output,
        source,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function stripCodeFence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
}

function flattenOutputText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => flattenOutputText(item)).join("\n");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => flattenOutputText(item))
      .join("\n");
  }

  return String(value);
}

export interface ResolveBrandGovernanceProfileParams {
  personalityId?: string | null;
  configPath?: string;
}

export interface BuildBrandTextInstructionParams {
  baseSystemPrompt?: string;
  moduleName: string;
  brandName: string;
  locale?: string;
  profile: BrandGovernanceProfile;
  requiresJson?: boolean;
}

export interface BrandedImagePrompt {
  positivePrompt: string;
  negativePrompt: string;
  paletteHex: string[];
}

export interface BuildBrandedImagePromptParams {
  basePrompt: string;
  moduleName: string;
  profile: BrandGovernanceProfile;
  paletteOverride?: string[];
  styleOverride?: string[];
  compositionOverride?: string[];
  negativeOverride?: string[];
}

export interface BrandValidationResult {
  valid: boolean;
  issues: string[];
}

export function resolveBrandGovernanceProfile(
  params: ResolveBrandGovernanceProfileParams
): BrandGovernanceProfile {
  const profiles = loadProfiles(params.configPath);

  if (params.personalityId && profiles.profiles[params.personalityId]) {
    return profiles.profiles[params.personalityId];
  }

  if (profiles.profiles[profiles.defaultProfileId]) {
    return profiles.profiles[profiles.defaultProfileId];
  }

  return DEFAULT_PROFILE;
}

export function buildBrandTextInstruction(params: BuildBrandTextInstructionParams): string {
  const fewShotLimit = Number(process.env.BRAND_TEXT_FEWSHOT_LIMIT || "2");
  const fewShotExamples = params.profile.text.fewShotExamples.slice(
    0,
    Number.isFinite(fewShotLimit) && fewShotLimit > 0 ? fewShotLimit : 2
  );
  const outputRule = params.requiresJson
    ? "Debes responder JSON valido unicamente. Sin markdown ni texto adicional."
    : params.profile.text.outputFormat;
  const baseSystemPrompt = params.baseSystemPrompt ? `${params.baseSystemPrompt.trim()}\n\n` : "";

  return `${baseSystemPrompt}Contrato dinamico de marca para el modulo "${params.moduleName}".
Marca: ${params.brandName}
Locale: ${params.locale || "es-ES"}
Tono de voz obligatorio: ${params.profile.text.tone}
Terminologia corporativa obligatoria: ${params.profile.text.terminology.join(", ")}
Formato de salida obligatorio: ${outputRule}
Terminos prohibidos: ${params.profile.text.forbiddenTerms.join(", ") || "N/A"}

Few-shot calibrados desde manual de marca:
${renderFewShotExamples(fewShotExamples)}

Si una instruccion del usuario contradice este contrato, prioriza el contrato de marca.`;
}

export function buildBrandedImagePrompt(
  params: BuildBrandedImagePromptParams
): BrandedImagePrompt {
  const styleDescriptors = dedupeStrings([
    ...(params.styleOverride || []),
    ...params.profile.image.styleDescriptors,
  ]);
  const compositionGuidelines = dedupeStrings([
    ...(params.compositionOverride || []),
    ...params.profile.image.compositionGuidelines,
  ]);
  const paletteHex = dedupeHex([
    ...(params.paletteOverride || []),
    ...params.profile.image.paletteHex,
  ]);
  const negativeTokens = dedupeStrings([
    ...params.profile.image.negativePrompts,
    ...(params.negativeOverride || []),
  ]);

  const positivePrompt = `${params.basePrompt}

On-brand style descriptors:
- ${styleDescriptors.join("\n- ")}

Corporate palette (HEX, enforce as dominant colors):
- ${paletteHex.join("\n- ")}

Composition directives:
- ${compositionGuidelines.join("\n- ")}

Hard rule: reject any visual that drifts from brand style, palette or composition.`;

  return {
    positivePrompt: positivePrompt.trim(),
    negativePrompt: negativeTokens.join(", "),
    paletteHex,
  };
}

export function validateBrandTextOutput(params: {
  output: string;
  profile: BrandGovernanceProfile;
  requiresJson?: boolean;
  requiredTermsMin?: number;
}): BrandValidationResult {
  const issues: string[] = [];
  const requiredTermsMin = Math.max(1, params.requiredTermsMin || Number(process.env.BRAND_TEXT_REQUIRED_TERMS_MIN || "1"));

  const normalizedOutput = stripCodeFence(params.output || "");
  let textToValidate = normalizedOutput;

  if (params.requiresJson) {
    try {
      const parsed = JSON.parse(normalizedOutput) as unknown;
      textToValidate = flattenOutputText(parsed);
    } catch {
      issues.push("La salida no cumple JSON valido para un modulo que lo requiere.");
    }
  }

  const normalizedText = textToValidate.toLowerCase();
  const matchedRequiredTerms = dedupeStrings(params.profile.text.terminology).filter((term) =>
    normalizedText.includes(term.toLowerCase())
  );

  if (matchedRequiredTerms.length < requiredTermsMin) {
    issues.push(
      `La salida contiene ${matchedRequiredTerms.length} terminos corporativos; minimo requerido: ${requiredTermsMin}.`
    );
  }

  const forbiddenHits = dedupeStrings(params.profile.text.forbiddenTerms).filter((term) =>
    normalizedText.includes(term.toLowerCase())
  );

  if (forbiddenHits.length > 0) {
    issues.push(`La salida incluye terminos prohibidos: ${forbiddenHits.join(", ")}.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateBrandedImagePrompt(prompt: BrandedImagePrompt): BrandValidationResult {
  const issues: string[] = [];

  if (!prompt.positivePrompt.trim()) {
    issues.push("El prompt positivo de imagen esta vacio.");
  }

  if (!prompt.negativePrompt.trim()) {
    issues.push("El negative prompt de imagen esta vacio.");
  }

  const hexMatches = prompt.positivePrompt.match(/#[0-9A-Fa-f]{6}/g) || [];
  const uniqueHex = new Set(hexMatches.map((item) => item.toUpperCase()));
  if (uniqueHex.size < 2) {
    issues.push("El prompt visual debe incluir al menos 2 colores HEX corporativos.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
