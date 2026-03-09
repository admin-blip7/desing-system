"use server";

import { createClient } from "@/lib/supabase/server";
import { generateContent, generateImage } from "@/lib/ai/aiService";
import {
  b,
  type CustomerPersonasOutput,
  type PersonalityProfile as BamlPersonalityProfile,
} from "@bm/ai-shared/baml_client";
import {
  SYSTEM_PROMPT,
  getStoryPrompt,
  getVoicePrompt,
  getPersonasPrompt,
  getNamingPrompt,
  getValuesPrompt,
  getVisualPrompt,
  getPhase2Prompt,
  getPhase3Prompt,
  getPhase4Prompt,
  getPhase5Prompt,
  getPhase6Prompt,
  getPhase7Prompt,
} from "@/lib/ai/prompts/templates";
import { getDependencyModulesForModule } from "@/lib/utils/module-dependencies";
import { getModuleByIdentifier } from "@/lib/data/modules-definition";
import { phases } from "@/lib/data/phases";
import { personalities } from "@/lib/data/personalities";
import { ModuleDefinition } from "@/lib/types/module";
import { getMissingRequiredQuestions } from "@/lib/utils/question-validation";
import {
  buildBrandTextInstruction,
  buildBrandedImagePrompt,
  resolveBrandGovernanceProfile,
  validateBrandTextOutput,
  validateBrandedImagePrompt,
} from "@/lib/ai/brand-governance";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

const FOUNDATION_KEYS = ["logo", "colorPalette", "typography"] as const;

const FOUNDATION_LABELS: Record<(typeof FOUNDATION_KEYS)[number], string> = {
  logo: "Logo & Isotipo",
  colorPalette: "Paleta de Color",
  typography: "Tipografía",
};

const FOUNDATION_VALIDATION_TERMS: Record<(typeof FOUNDATION_KEYS)[number], string[]> = {
  logo: ["logo", "version", "area", "proteccion", "usos", "incorrect", "tamano", "minimo"],
  colorPalette: ["hex", "rgb", "hsl", "wcag", "contraste", "primar", "secundar", "accent"],
  typography: ["display", "body", "font", "peso", "weight", "line-height", "letter-spacing", "jerarquia"],
};

function isFoundationKey(value: string): value is (typeof FOUNDATION_KEYS)[number] {
  return (FOUNDATION_KEYS as readonly string[]).includes(value);
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim().length > 0;
}

function toObjectRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function toStringMap(value: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(value)) {
    if (rawValue === null || rawValue === undefined) continue;
    if (Array.isArray(rawValue)) {
      result[key] = rawValue.map((item) => String(item)).join(", ");
      continue;
    }
    result[key] = String(rawValue);
  }
  return result;
}

function toBamlPersonalityProfile(
  profile: Record<string, unknown> | null,
): BamlPersonalityProfile {
  return {
    id: String(profile?.id || "default"),
    name: String(profile?.name || "Default"),
    archetype: String(profile?.archetype || "General"),
    tagline: String(profile?.tagline || ""),
    philosophy: String(profile?.philosophy || ""),
    key_principles: Array.isArray(profile?.keyPrinciples)
      ? profile.keyPrinciples.map((value) => String(value))
      : [],
    dna: String(profile?.dna || ""),
  };
}

function mapCustomerPersonasOutput(content: CustomerPersonasOutput) {
  return {
    personasData: {
      personas: content.personas.map((persona, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: persona.name,
        role: persona.role,
        age: persona.age,
        location: persona.location,
        income: persona.income,
        goals: persona.goals,
        painPoints: persona.pain_points,
        motivations: persona.motivations,
        objections: persona.objections,
        quote: persona.quote,
      })),
    },
    idealClientSuggestions: content.ideal_client_suggestions,
    acquisitionChannels: content.acquisition_channels,
    title: content.title,
    generatedBy: "baml",
  };
}

function countMatchedTerms(content: string, terms: string[]) {
  const normalized = normalizeText(content);
  return terms.reduce((acc, term) => (normalized.includes(term) ? acc + 1 : acc), 0);
}

function isFoundationContentValid(moduleKey: (typeof FOUNDATION_KEYS)[number], content: unknown) {
  const plainText = extractTextFromContent(content);
  if (!hasValue(plainText)) {
    return false;
  }

  const matches = countMatchedTerms(plainText, FOUNDATION_VALIDATION_TERMS[moduleKey]);
  return plainText.length >= 160 && matches >= 2;
}

function fitToBudget(text: string, maxChars: number, suffix = "\n...[contexto recortado por límite de tokens]") {
  if (text.length <= maxChars) {
    return text;
  }

  const trimLimit = Math.max(0, maxChars - suffix.length);
  return `${text.slice(0, trimLimit)}${suffix}`;
}

function fitPromptToBudget(basePrompt: string, groundingBlock: string, maxChars = 23000) {
  const cleanBase = basePrompt.trim();
  const cleanGrounding = groundingBlock.trim();
  const fullPrompt = `${cleanBase}\n\n${cleanGrounding}`;

  if (fullPrompt.length <= maxChars) {
    return fullPrompt;
  }

  const reservedForGrounding = Math.max(1800, maxChars - cleanBase.length - 2);
  if (reservedForGrounding > 0) {
    return `${cleanBase}\n\n${fitToBudget(cleanGrounding, reservedForGrounding)}`;
  }

  return fitToBudget(fullPrompt, maxChars);
}

function applyDependencyBudget(outputs: Record<string, string>, totalBudget = 12000, perItemBudget = 2200) {
  const keys = Object.keys(outputs);
  if (keys.length === 0) {
    return outputs;
  }

  let remaining = totalBudget;
  const result: Record<string, string> = {};

  for (const key of keys) {
    const pendingKeys = keys.length - Object.keys(result).length;
    const budgetForItem = Math.max(500, Math.min(perItemBudget, Math.floor(remaining / Math.max(1, pendingKeys))));
    const clipped = fitToBudget(outputs[key], budgetForItem, "...");
    result[key] = clipped;
    remaining -= clipped.length;
  }

  return result;
}

const VISUAL_IMAGE_MODULE_KEYS = new Set([
  "logo",
  "colorPalette",
  "typography",
  "geometry",
  "motion",
  "dataVisualization",
  "designTokens",
  "buttons",
  "forms",
  "gridsLayouts",
  "navigation",
  "cardsContainers",
  "tagsStatus",
  "emptyErrorStates",
  "tablesLists",
  "landingPages",
  "productPage",
  "cartCheckout",
  "socialMediaKit",
  "socialProfiles",
  "seoMeta",
  "presentations",
  "videoTemplates",
  "stationery",
  "labeling",
  "packaging",
  "uniforms",
  "merchandising",
  "signage",
  "architectural",
  "vehicles",
  "illustration",
  "iconography",
  "qrCodes",
  "photography",
  "assetLibrary",
  "roadmapGenerator",
]);

function shouldGenerateImage(moduleKey: string) {
  return VISUAL_IMAGE_MODULE_KEYS.has(moduleKey);
}

function getImageGenerationOptions(moduleKey: string) {
  const defaults = { aspectRatio: "4:3", imageSize: "2K" };
  switch (moduleKey) {
    case "logo":
      return { aspectRatio: "1:1", imageSize: "2K" };
    case "colorPalette":
      return { aspectRatio: "5:4", imageSize: "2K" };
    case "typography":
      return { aspectRatio: "4:3", imageSize: "2K" };
    case "photography":
      return { aspectRatio: "5:4", imageSize: "2K" };
    case "illustration":
      return { aspectRatio: "4:3", imageSize: "2K" };
    case "iconography":
      return { aspectRatio: "1:1", imageSize: "2K" };
    case "geometry":
      return { aspectRatio: "1:1", imageSize: "2K" };
    case "qrCodes":
      return { aspectRatio: "1:1", imageSize: "2K" };
    case "motion":
    case "videoTemplates":
      return { aspectRatio: "16:9", imageSize: "2K" };
    case "presentations":
    case "landingPages":
    case "productPage":
    case "socialMediaKit":
    case "socialProfiles":
    case "seoMeta":
      return { aspectRatio: "16:9", imageSize: "2K" };
    case "buttons":
    case "forms":
    case "gridsLayouts":
    case "navigation":
    case "cardsContainers":
    case "tagsStatus":
    case "emptyErrorStates":
    case "tablesLists":
    case "designTokens":
      return { aspectRatio: "16:10", imageSize: "2K" };
    default:
      return defaults;
  }
}

function shouldForceJson(phaseId: number, normalizedModuleName: string) {
  if (phaseId === 3 || phaseId === 4 || phaseId === 5 || phaseId === 7) {
    return true;
  }

  if (phaseId === 2) {
    return includesAny(normalizedModuleName, [
      "iconografia",
      "motion",
      "animacion",
      "audio branding",
      "data visualization",
    ]);
  }

  return includesAny(normalizedModuleName, [
    "paleta de color",
    "color",
    "tipografia",
    "typography",
    "design tokens",
  ]);
}

function extractTextFromContent(content: unknown): string {
  if (content === null || content === undefined) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item) => extractTextFromContent(item)).join("\n");
  }

  if (typeof content === "object") {
    const asRecord = content as Record<string, unknown>;
    const payload = "__payload" in asRecord ? asRecord.__payload : content;
    if (typeof payload === "string") {
      return payload;
    }

    if (payload && typeof payload === "object" && "content" in (payload as Record<string, unknown>)) {
      return extractTextFromContent((payload as Record<string, unknown>).content);
    }

    if ("content" in asRecord) {
      return extractTextFromContent(asRecord.content);
    }

    if ("text" in asRecord) {
      return extractTextFromContent(asRecord.text);
    }

    return JSON.stringify(payload, null, 2);
  }

  return String(content);
}

function buildPromptForModule(phaseId: number, moduleName: string, brandContext: Record<string, unknown>) {
  const normalizedModuleName = normalizeText(moduleName);

  if (phaseId === 2) return getPhase2Prompt(moduleName, brandContext);
  if (phaseId === 3) return getPhase3Prompt(moduleName, brandContext);
  if (phaseId === 4) return getPhase4Prompt(moduleName, brandContext);
  if (phaseId === 5) return getPhase5Prompt(moduleName, brandContext);
  if (phaseId === 6) return getPhase6Prompt(moduleName, brandContext);
  if (phaseId === 7) return getPhase7Prompt(moduleName, brandContext);
  if (includesAny(normalizedModuleName, ["story"])) return getStoryPrompt(brandContext);
  if (includesAny(normalizedModuleName, ["filosof", "valor"])) return getValuesPrompt(brandContext);
  if (includesAny(normalizedModuleName, ["voice", "voz"])) return getVoicePrompt(brandContext);
  if (includesAny(normalizedModuleName, ["persona", "cliente"])) return getPersonasPrompt(brandContext);
  if (includesAny(normalizedModuleName, ["naming"])) return getNamingPrompt(brandContext);
  if (includesAny(normalizedModuleName, ["color", "logo", "tipo", "geom"])) return getVisualPrompt(moduleName, brandContext);

  return `Genera el contenido para el módulo "${moduleName}" de la marca ${String(brandContext.name || "")}.
Usa como contexto la personalidad ${String(brandContext.personalityId || "")} y los siguientes datos:
${JSON.stringify(brandContext)}`;
}

function buildImagePrompt(moduleKey: string, moduleName: string, brandContext: Record<string, unknown>) {
  if (moduleKey === "logo") {
    return `Minimalist, modern logo for ${String(brandContext.name || "the brand")}. Sector: ${String(
      brandContext.offering || "general business",
    )}. Style: ${String(brandContext.logoType || "clean")}. Color mood: ${String(
      brandContext.colorMood || "neutral",
    )}. High quality, white background.`;
  }

  if (moduleKey === "colorPalette") {
    return `Professional brand color palette board for ${String(
      brandContext.name || "the brand",
    )}. Include primary, secondary, accent and neutral swatches with clear visual grouping, high legibility labels and contrast-safe combinations.`;
  }

  if (moduleKey === "typography") {
    return `Typography styleboard for ${String(
      brandContext.name || "the brand",
    )}. Show heading/body/mono hierarchy, readable scale, spacing rhythm, and pairing recommendations aligned to brand personality.`;
  }

  if (moduleKey === "photography") {
    return `Professional photography direction board for ${String(
      brandContext.name || "the brand",
    )}. Product context: ${String(brandContext.offering || "general")}. Lighting style: ${String(
      brandContext.photoCreator || "natural",
    )}. Mood and palette aligned with the brand personality.`;
  }

  if (moduleKey === "illustration") {
    return `Brand illustration styleboard for ${String(brandContext.name || "the brand")}. Visual tone: ${String(
      brandContext.illustrationStyle || "clean vector",
    )}. Include character, icon and background style coherence.`;
  }

  if (moduleKey === "iconography") {
    return `Icon system styleboard for ${String(brandContext.name || "the brand")}. Style: ${String(
      brandContext.iconStyle || "outline",
    )}. Show consistency in stroke, corners and spacing grid.`;
  }

  if (moduleKey === "qrCodes") {
    return `QR code application mock for ${String(
      brandContext.name || "the brand",
    )}. Show high-contrast branded QR implementations in packaging and print contexts, preserving quiet zones and scan readability.`;
  }

  if (moduleKey === "geometry") {
    // Infer visual style from personality for better geometric generation
    const personality = personalities.find(p => p.id === brandContext.personalityId);
    const archetype = personality?.archetype?.toLowerCase() || "";

    const styleDescriptors: Record<string, string> = {
      "innovator": "bold geometric shapes with sharp angles, dynamic triangles, cutting-edge polygons",
      "caregiver": "soft rounded shapes, circles and ovals, organic curves, warm flowing forms",
      "ruler": "structured squares and rectangles, precise grids, symmetrical layouts, clean lines",
      "explorer": "asymmetrical compositions, dynamic shapes suggesting movement, forward-pointing triangles",
      "rebel": "unconventional breaking shapes, fragmented geometries, deconstructed forms, bold contrasts",
      "lover": "sensual curves, heart shapes, elegant flowing lines, harmonious proportions",
      "sage": "minimal geometric forms, balanced circles and squares, simple clean shapes",
      "hero": "strong solid shapes, powerful triangles, bold impactful forms, confident geometry",
    };

    const shapeStyle = styleDescriptors[archetype] || "balanced geometric shapes with clean lines";

    return `Professional geometric shape system board for ${String(
      brandContext.name || "the brand",
    )}. Show a curated collection of ${shapeStyle} arranged in a modern grid layout.

Include:
- 3-5 base geometric shapes (circles, squares, triangles, polygons) styled for the brand
- 2-3 repeating pattern examples using the base shapes
- Pure white background (#FFFFFF) with no gradients, textures, or decorative elements
- Isolated geometric shapes with clean edges
- Shapes should use brand-appropriate solid colors
- Professional design quality like a brand guidelines document

Style: ${shapeStyle}. Modern brand identity reference sheet with multiple shape variations shown in an organized layout on a solid white background. No shadows, no 3D effects, flat design only.`;
  }

  if (moduleKey === "motion") {
    return `Motion direction keyframes board for ${String(
      brandContext.name || "the brand",
    )}. Show transition style, easing feel, duration ranges and interaction rhythm in a branded visual storyboard.`;
  }

  if (moduleKey === "dataVisualization") {
    return `Data visualization style sheet for ${String(
      brandContext.name || "the brand",
    )}. Include branded charts, axis style, gridline hierarchy, labels and color mapping with high readability.`;
  }

  if (
    ["designTokens", "buttons", "forms", "gridsLayouts", "navigation", "cardsContainers", "tagsStatus", "emptyErrorStates", "tablesLists"].includes(
      moduleKey,
    )
  ) {
    return `UI system board for module "${moduleName}" of ${String(
      brandContext.name || "the brand",
    )}. Present a polished interface kit mockup with consistent spacing, typography, color and states aligned to brand identity.`;
  }

  if (
    ["landingPages", "productPage", "cartCheckout", "socialMediaKit", "socialProfiles", "seoMeta", "presentations", "videoTemplates"].includes(
      moduleKey,
    )
  ) {
    return `Digital template mockup for module "${moduleName}" of ${String(
      brandContext.name || "the brand",
    )}. Show high-fidelity composition, strong visual hierarchy, CTA emphasis and branded assets in real usage context.`;
  }

  if (["stationery", "labeling", "packaging", "uniforms", "merchandising"].includes(moduleKey)) {
    return `Print and physical application mockup for module "${moduleName}" of ${String(
      brandContext.name || "the brand",
    )}. Show production-ready visual examples, materials context and logo/color consistency.`;
  }

  if (["signage", "architectural", "vehicles"].includes(moduleKey)) {
    return `Environmental branding mockup for module "${moduleName}" of ${String(
      brandContext.name || "the brand",
    )}. Show real-world scale, placement logic and visibility of brand assets in physical spaces.`;
  }

  if (moduleKey === "assetLibrary") {
    return `Asset library preview board for ${String(
      brandContext.name || "the brand",
    )}. Show organized downloadable assets (logo variants, color swatches, typography and templates) with clear categorization.`;
  }

  if (moduleKey === "roadmapGenerator") {
    return `Strategic visual roadmap infographic for ${String(
      brandContext.name || "the brand",
    )}. Show phased milestones, dependencies and timeline in a clean branded visualization.`;
  }

  return `Abstract geometric composition for ${String(
    brandContext.name || "the brand",
  )}, representing brand identity through modern forms and balanced negative space.`;
}

function extractImageSourcesFromContent(content: unknown): string[] {
  const found = new Set<string>();

  const visit = (value: unknown) => {
    if (!value) return;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.startsWith("data:image/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        found.add(trimmed);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (typeof value === "object") {
      const record = value as Record<string, unknown>;
      const possibleKeys = ["imageUrl", "url", "src", "image"];
      for (const key of possibleKeys) {
        const possibleValue = record[key];
        if (typeof possibleValue === "string") {
          visit(possibleValue);
        }
      }
      Object.values(record).forEach(visit);
    }
  };

  visit(content);
  return Array.from(found);
}

function buildGroundingContextBlock(
  moduleDefinition: ModuleDefinition,
  dependencyOutputs: Record<string, string>,
  personalityProfile: Record<string, unknown> | null,
  moduleAnswers: Record<string, unknown>,
) {
  const dependencyLines = Object.entries(dependencyOutputs).map(
    ([dependencyKey, dependencyText]) => `- ${dependencyKey}: ${dependencyText}`,
  );

  const hasModuleAnswers = Object.keys(moduleAnswers).length > 0;

  return `
## CONTEXTO OBLIGATORIO DE MARCA
Módulo objetivo: ${moduleDefinition.name} (${moduleDefinition.key})

Debes mantener consistencia estricta con:
1. Logo, color, tipografía y reglas base de identidad.
2. Personalidad seleccionada y su DNA de diseño/voz.
3. Outputs ya aprobados de módulos previos.

Perfil de personalidad seleccionado:
${personalityProfile ? JSON.stringify(personalityProfile, null, 2) : "No definido (modo manual o sin selección)."}

Módulos previos relevantes:
${dependencyLines.length ? dependencyLines.join("\n") : "- Sin dependencias previas registradas."}

Respuestas capturadas del formulario actual:
${hasModuleAnswers ? JSON.stringify(moduleAnswers, null, 2) : "No registradas para este módulo."}

Si algún output previo contradice tu propuesta, prioriza los módulos base (logo, color, tipografía) y explícitalo.
`.trim();
}

function isStrictGuardrailMode() {
  return (process.env.BRAND_GUARDRAIL_MODE || "strict").toLowerCase() !== "warn";
}

function buildComplianceRepairPrompt(originalPrompt: string, output: string, issues: string[]) {
  return `${originalPrompt}

---
La salida anterior incumple el contrato de marca por:
- ${issues.join("\n- ")}

Salida a corregir:
${output}

Reescribe la salida cumpliendo estrictamente las restricciones.`;
}

async function enforceTextBrandCompliance(params: {
  prompt: string;
  systemPrompt: string;
  output: string;
  requiresJson: boolean;
  profile: ReturnType<typeof resolveBrandGovernanceProfile>;
  model?: string;
}) {
  const initialValidation = validateBrandTextOutput({
    output: params.output,
    profile: params.profile,
    requiresJson: params.requiresJson,
  });

  if (initialValidation.valid) {
    return {
      success: true as const,
      content: params.output,
    };
  }

  const repairPrompt = buildComplianceRepairPrompt(
    params.prompt,
    params.output,
    initialValidation.issues,
  );

  const repaired = await generateContent(
    repairPrompt,
    params.systemPrompt,
    params.requiresJson,
    params.model,
  );
  if (!repaired.success || !repaired.content) {
    return {
      success: false as const,
      issues: initialValidation.issues,
    };
  }

  const repairedValidation = validateBrandTextOutput({
    output: repaired.content,
    profile: params.profile,
    requiresJson: params.requiresJson,
  });

  if (!repairedValidation.valid) {
    return {
      success: false as const,
      issues: repairedValidation.issues,
    };
  }

  return {
    success: true as const,
    content: repaired.content,
  };
}

export async function generateModuleAction(
  brandId: string,
  moduleIdentifier: string,
  moduleAnswersInput: Record<string, unknown> = {},
  options?: {
    modelConfig?: {
      provider?: string;
      model?: string;
    };
    mode?: "questions" | "auto";
  },
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("*")
      .eq("id", brandId)
      .eq("user_id", user.id)
      .single();

    if (brandError || !brand) {
      throw new Error("Brand not found or access denied");
    }

    const moduleDefinition = getModuleByIdentifier(moduleIdentifier);
    if (!moduleDefinition) {
      throw new Error("Module definition not found");
    }

    const moduleName = moduleDefinition.name;
    const canonicalModuleKey = moduleDefinition.key;
    const phaseId = moduleDefinition.phaseId;
    const normalizedModuleName = normalizeText(moduleName);
    const onboardingData = (brand.onboarding_data || {}) as Record<string, unknown>;
    const runtimeModuleAnswers = toObjectRecord(moduleAnswersInput);
    const { data: moduleRows, error: moduleRowsError } = await supabase
      .from("modules")
      .select("module_key, pre_answers")
      .eq("brand_id", brandId)
      .in("module_key", [canonicalModuleKey, moduleName])
      .order("updated_at", { ascending: false })
      .limit(1);

    if (moduleRowsError) {
      throw moduleRowsError;
    }

    const storedModuleAnswers = toObjectRecord((moduleRows || [])[0]?.pre_answers);
    const moduleAnswers = {
      ...storedModuleAnswers,
      ...runtimeModuleAnswers,
    };
    const selectedModel = options?.modelConfig?.model || process.env.OPENAI_TEXT_MODEL || "gpt-5-mini";
    const phaseDefinition = phases.find((item) => item.id === phaseId) || null;

    const isKnownPersonality = personalities.some((item) => item.id === brand.personality_id);
    if (!brand.personality_id || !isKnownPersonality) {
      return {
        success: false,
        error: "Identidad bloqueada. Selecciona y confirma una personalidad de marca antes de generar módulos.",
      };
    }

    if (phaseDefinition?.unlockQuestions?.length) {
      const missingPhaseQuestions = getMissingRequiredQuestions(phaseDefinition.unlockQuestions, onboardingData, {
        requireAll: true,
      });
      if (missingPhaseQuestions.length > 0) {
        return {
          success: false,
          error: `Fase bloqueada. Completa primero: ${missingPhaseQuestions
            .map((question) => question.q)
            .join(", ")}`,
        };
      }
    }

    const shouldEnforceFoundation = phaseId > 1 && !isFoundationKey(canonicalModuleKey);
    if (shouldEnforceFoundation) {
      const foundationModules = FOUNDATION_KEYS.map((foundationKey) => getModuleByIdentifier(foundationKey)).filter(
        (item): item is ModuleDefinition => Boolean(item),
      );
      const foundationIdentifiers = [
        ...new Set(foundationModules.flatMap((foundationModule) => [foundationModule.key, foundationModule.name])),
      ];

      const { data: foundationRows, error: foundationRowsError } = await supabase
        .from("modules")
        .select("module_key, status, content")
        .eq("brand_id", brandId)
        .in("module_key", foundationIdentifiers)
        .eq("status", "completed");

      if (foundationRowsError) {
        throw foundationRowsError;
      }

      const foundationRowMap = new Map((foundationRows || []).map((row) => [row.module_key, row.content]));
      const missingFoundation: string[] = [];
      const invalidFoundation: string[] = [];

      for (const foundationKey of FOUNDATION_KEYS) {
        const foundationDefinition = getModuleByIdentifier(foundationKey);
        if (!foundationDefinition) continue;

        const content =
          foundationRowMap.get(foundationDefinition.key) ?? foundationRowMap.get(foundationDefinition.name);

        if (content === undefined) {
          missingFoundation.push(FOUNDATION_LABELS[foundationKey]);
          continue;
        }

        if (!isFoundationContentValid(foundationKey, content)) {
          invalidFoundation.push(FOUNDATION_LABELS[foundationKey]);
        }
      }

      if (missingFoundation.length > 0 || invalidFoundation.length > 0) {
        const pieces: string[] = [];
        if (missingFoundation.length > 0) {
          pieces.push(`faltantes: ${missingFoundation.join(", ")}`);
        }
        if (invalidFoundation.length > 0) {
          pieces.push(`incompletos: ${invalidFoundation.join(", ")}`);
        }

        return {
          success: false,
          error: `Base de marca bloqueada (${pieces.join(" · ")}). Completa y valida logo, color y tipografía antes de continuar.`,
        };
      }
    }

    const dependencyModules = getDependencyModulesForModule(canonicalModuleKey);
    const dependencyIdentifiers = [...new Set(dependencyModules.flatMap((module) => [module.key, module.name]))];

    const { data: dependencyRows, error: dependencyRowsError } = dependencyIdentifiers.length
      ? await supabase
          .from("modules")
          .select("module_key, content, status")
          .eq("brand_id", brandId)
          .in("module_key", dependencyIdentifiers)
          .eq("status", "completed")
      : { data: [], error: null };

    if (dependencyRowsError) {
      throw dependencyRowsError;
    }

    const dependencyRowMap = new Map((dependencyRows || []).map((row) => [row.module_key, row.content]));
    const rawDependencyOutputs = dependencyModules.reduce<Record<string, string>>((acc, dependencyModule) => {
      const rawContent = dependencyRowMap.get(dependencyModule.key) ?? dependencyRowMap.get(dependencyModule.name);
      if (rawContent === undefined) return acc;
      const normalizedContent = extractTextFromContent(rawContent);
      acc[dependencyModule.key] = normalizedContent;
      return acc;
    }, {});
    const dependencyOutputs = applyDependencyBudget(rawDependencyOutputs);

    const missingDependencies = dependencyModules.filter(
      (dependencyModule) => !(dependencyModule.key in dependencyOutputs),
    );

    if (missingDependencies.length > 0) {
      return {
        success: false,
        error: `Módulo bloqueado. Completa primero: ${missingDependencies.map((item) => item.name).join(", ")}`,
      };
    }

    const selectedPersonality = personalities.find((item) => item.id === brand.personality_id) || null;
    const personalityProfile = selectedPersonality
      ? {
          id: selectedPersonality.id,
          name: selectedPersonality.name,
          archetype: selectedPersonality.archetype,
          tagline: selectedPersonality.tagline,
          philosophy: selectedPersonality.philosophy,
          keyPrinciples: selectedPersonality.keyPrinciples,
          dna: selectedPersonality.dna,
          ideal: selectedPersonality.ideal,
          notIdeal: selectedPersonality.notIdeal,
        }
      : null;

    const brandContext = {
      ...onboardingData,
      ...moduleAnswers,
      name: brand.name,
      personalityId: brand.personality_id,
      personalityProfile,
      dependencyOutputs,
      moduleAnswers,
    };
    const bamlUserAnswers = toStringMap(moduleAnswers);

    const basePrompt = buildPromptForModule(phaseId, moduleName, brandContext);
    const groundingBlock = buildGroundingContextBlock(
      moduleDefinition,
      dependencyOutputs,
      personalityProfile,
      moduleAnswers,
    );
    const prompt = fitPromptToBudget(basePrompt, groundingBlock);

    const isVisualModule = shouldGenerateImage(canonicalModuleKey);
    const requiresJson = shouldForceJson(phaseId, normalizedModuleName);
    const governanceProfile = resolveBrandGovernanceProfile({
      personalityId: brand.personality_id,
    });
    const governedSystemPrompt = buildBrandTextInstruction({
      baseSystemPrompt: SYSTEM_PROMPT,
      moduleName,
      brandName: brand.name,
      locale: String(onboardingData.locale || "es-ES"),
      profile: governanceProfile,
      requiresJson,
    });

    let aiResult: { success: boolean; content?: unknown; error?: string };

    if (isVisualModule) {
      const visualContextBlock = `
Brand personality profile:
${personalityProfile ? JSON.stringify(personalityProfile, null, 2) : "No definido"}

Foundation outputs to respect:
${Object.entries(dependencyOutputs)
  .map(([dependencyKey, dependencyValue]) => `- ${dependencyKey}: ${fitToBudget(dependencyValue, 550, "...")}`)
  .join("\n")}
      `.trim();
      const brandedImagePrompt = buildBrandedImagePrompt({
        basePrompt: fitToBudget(
          `${buildImagePrompt(canonicalModuleKey, moduleName, brandContext)}\n\n${visualContextBlock}`,
          7000
        ),
        moduleName,
        profile: governanceProfile,
        // For geometry, add specific negative prompts for clean backgrounds
        ...(canonicalModuleKey === "geometry" ? {
          negativeOverride: [
            "background patterns",
            "gradients",
            "textures",
            "shadows",
            "3D effects",
            "drop shadows",
            "decorative elements",
            "busy backgrounds",
            "colored backgrounds",
            "dark backgrounds"
          ]
        } : {})
      });
      const imagePromptValidation = validateBrandedImagePrompt(brandedImagePrompt);
      if (!imagePromptValidation.valid) {
        return {
          success: false,
          error: `Prompt visual fuera de contrato de marca: ${imagePromptValidation.issues.join(" | ")}`,
        };
      }

      const dependencyReferenceImages = dependencyModules
        .flatMap((dependencyModule) => {
          const rawContent =
            dependencyRowMap.get(dependencyModule.key) ?? dependencyRowMap.get(dependencyModule.name);
          return extractImageSourcesFromContent(rawContent);
        })
        .slice(0, 5);
      const imageOptions = getImageGenerationOptions(canonicalModuleKey);
      const imagePrompt = fitToBudget(brandedImagePrompt.positivePrompt, 8000);
      const [imageResult, textResult] = await Promise.all([
        generateImage(imagePrompt, {
          negativePrompt: brandedImagePrompt.negativePrompt,
          aspectRatio: imageOptions.aspectRatio,
          imageSize: imageOptions.imageSize,
          referenceImages: dependencyReferenceImages,
        }),
        generateContent(prompt, governedSystemPrompt, requiresJson, selectedModel),
      ]);

      if (!imageResult.success && !textResult.success) {
        return {
          success: false,
          error: imageResult.error || textResult.error || "No se pudo generar el módulo visual.",
        };
      }

      let visualText = textResult.success ? String(textResult.content || "") : "";
      if (visualText) {
        const compliance = await enforceTextBrandCompliance({
          prompt,
          systemPrompt: governedSystemPrompt,
          output: visualText,
          requiresJson,
          profile: governanceProfile,
          model: selectedModel,
        });

        if (!compliance.success && isStrictGuardrailMode()) {
          return {
            success: false,
            error: `Salida textual fuera de marca: ${(compliance.issues || []).join(" | ")}`,
          };
        }

        if (compliance.success) {
          visualText = compliance.content;
        }
      }

      aiResult = {
        success: true,
        content: {
          imageUrl: imageResult.success ? imageResult.content : null,
          text: visualText || "No se pudo generar el texto explicativo.",
          imagePrompt,
          negativePrompt: brandedImagePrompt.negativePrompt,
        },
      };
    } else {
      // Special handling for customerPersonas module
      if (canonicalModuleKey === "customerPersonas") {
        try {
          const personasResult = await b.GenerateCustomerPersonas(
            {
              module_key: canonicalModuleKey,
              module_name: moduleName,
              brand_context: {
                name: brand.name,
                personality_id: brand.personality_id,
                industry: String((onboardingData.industry as string) || ""),
                offering: String((onboardingData.offering as string) || ""),
              },
              personality_profile: toBamlPersonalityProfile(personalityProfile),
              user_answers: bamlUserAnswers,
              tone_profile: "Strategic and practical",
            },
            { client: "CustomGPT5Mini" },
          );

          aiResult = {
            success: true,
            content: mapCustomerPersonasOutput(personasResult),
          };
        } catch (error) {
          console.error("[BAML customerPersonas] fallback to generic text generation:", error);
          const textResult = await generateContent(prompt, governedSystemPrompt, requiresJson, selectedModel);
          if (!textResult.success || !textResult.content) {
            aiResult = textResult;
          } else {
            const compliance = await enforceTextBrandCompliance({
              prompt,
              systemPrompt: governedSystemPrompt,
              output: String(textResult.content),
              requiresJson,
              profile: governanceProfile,
              model: selectedModel,
            });

            if (!compliance.success && isStrictGuardrailMode()) {
              return {
                success: false,
                error: `Salida fuera de marca: ${(compliance.issues || []).join(" | ")}`,
              };
            }

            aiResult = {
              success: true,
              content: compliance.success ? compliance.content : textResult.content,
            };
          }
        }
      } else {
        const textResult = await generateContent(prompt, governedSystemPrompt, requiresJson, selectedModel);
        if (!textResult.success || !textResult.content) {
          aiResult = textResult;
        } else {
          const compliance = await enforceTextBrandCompliance({
            prompt,
            systemPrompt: governedSystemPrompt,
            output: String(textResult.content),
            requiresJson,
            profile: governanceProfile,
            model: selectedModel,
          });

          if (!compliance.success && isStrictGuardrailMode()) {
            return {
              success: false,
              error: `Salida fuera de marca: ${(compliance.issues || []).join(" | ")}`,
            };
          }

          aiResult = {
            success: true,
            content: compliance.success ? compliance.content : textResult.content,
          };
        }
      }
    }

    if (!aiResult.success) {
      return { success: false, error: aiResult.error };
    }

    const generatedResult = {
      title: `Generado: ${moduleName}`,
      content: aiResult.content,
      type: isVisualModule ? "visual" : "text",
      timestamp: new Date().toISOString(),
      model: selectedModel,
      dependencyKeys: Object.keys(dependencyOutputs),
      personalityId: brand.personality_id,
    };

    const { data: existingRows, error: existingRowsError } = await supabase
      .from("modules")
      .select("id, module_key")
      .eq("brand_id", brandId)
      .in("module_key", [canonicalModuleKey, moduleName])
      .order("updated_at", { ascending: false });

    if (existingRowsError) {
      throw existingRowsError;
    }

    const existingRow = (existingRows || [])[0];

    if (existingRow?.id) {
      const { error: updateError } = await supabase
        .from("modules")
        .update({
          name: moduleName,
          module_key: canonicalModuleKey,
          content: generatedResult,
          status: "completed",
          phase: phaseId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRow.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase.from("modules").insert({
        brand_id: brandId,
        name: moduleName,
        module_key: canonicalModuleKey,
        phase: phaseId,
        content: generatedResult,
        status: "completed",
      });

      if (insertError) {
        throw insertError;
      }
    }

    return { success: true, data: generatedResult };
  } catch (error: unknown) {
    console.error("Error generating module:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar módulo";
    return { success: false, error: errorMessage };
  }
}
