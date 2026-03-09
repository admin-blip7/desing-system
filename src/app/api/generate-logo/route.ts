import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runBamlText } from "@/lib/ai/bamlClient";
import {
  buildBrandedImagePrompt,
  buildBrandTextInstruction,
  resolveBrandGovernanceProfile,
  validateBrandedImagePrompt,
} from "@/lib/ai/brand-governance";

interface GenerateLogoInput {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  typography: "Serif" | "Sans-serif" | "Modern" | "Script" | "Bold" | "Light";
  tone: "Professional" | "Playful" | "Luxury" | "Minimalist" | "Bold" | "Elegant" | "Tech" | "Organic";
  industry?: string;
  iconStyle?: "abstract" | "geometric" | "typographic" | "symbolic" | "badge";
  layout?: "horizontal" | "stacked" | "icon-only";
}

interface VariantImage {
  imageUrl?: string;
  base64?: string;
}

interface LogoGuidelinesPayload {
  clearSpace: number;
  minSizes: {
    print: number;
    screen: number;
    favicon: number;
  };
  allowedBackgrounds: string[];
  prohibitedBackgrounds: string[];
  usageExamples: Array<{
    title: string;
    isCorrect: boolean;
    description: string;
  }>;
}

const DEAPI_API_URL = "https://api.deapi.ai/api/v1/client/txt2img";
const DEAPI_STATUS_URL = "https://api.deapi.ai/api/v1/client/request-status";

const logoGuidelinesSchema = z.object({
  clearSpace: z.number().min(5).max(100),
  minSizes: z.object({
    print: z.number().min(5).max(200),
    screen: z.number().min(16).max(2000),
    favicon: z.number().min(16).max(256),
  }),
  allowedBackgrounds: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(2).max(12),
  prohibitedBackgrounds: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).max(12),
  usageExamples: z
    .array(
      z.object({
        title: z.string().min(3).max(120),
        isCorrect: z.boolean(),
        description: z.string().min(8).max(320),
      }),
    )
    .min(4)
    .max(12),
});

function normalizeHex(hex: string): string {
  const trimmed = hex.trim().toUpperCase();
  if (trimmed.startsWith("#") && /^#[0-9A-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^[0-9A-F]{6}$/.test(trimmed)) {
    return `#${trimmed}`;
  }

  return "#111111";
}

function pickImageSource(image?: VariantImage): string | undefined {
  if (!image) return undefined;
  if (typeof image.imageUrl === "string" && image.imageUrl.trim().length > 0) {
    return image.imageUrl;
  }
  if (typeof image.base64 === "string" && image.base64.trim().length > 0) {
    return image.base64;
  }
  return undefined;
}

function stripCodeFence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
}

function parseJsonResponse<T>(raw: string): T {
  const direct = stripCodeFence(raw);

  try {
    return JSON.parse(direct) as T;
  } catch {
    const start = direct.indexOf("{");
    const end = direct.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(direct.slice(start, end + 1)) as T;
    }
    throw new Error("No se pudo parsear JSON de BAML");
  }
}

function buildLogoPrompt(input: GenerateLogoInput): string {
  const {
    brandName,
    primaryColor,
    secondaryColor,
    typography,
    tone,
    industry = "business",
    iconStyle = "geometric",
    layout = "horizontal",
  } = input;

  const typographyStyles: Record<GenerateLogoInput["typography"], string> = {
    Serif: "elegant serif font with classic traditional styling",
    "Sans-serif": "clean modern sans-serif font with geometric proportions",
    Modern: "contemporary minimalist font with sleek lines",
    Script: "elegant cursive script font with flowing strokes",
    Bold: "heavy bold font with strong impact",
    Light: "delicate thin font with refined elegance",
  };

  const toneDescriptors: Record<GenerateLogoInput["tone"], string> = {
    Professional: "corporate professional trustworthy reliable established",
    Playful: "fun playful energetic friendly cheerful whimsical",
    Luxury: "luxurious premium elegant sophisticated exclusive high-end",
    Minimalist: "minimalist clean simple streamlined uncluttered",
    Bold: "bold powerful strong confident dynamic",
    Elegant: "elegant graceful refined chic polished",
    Tech: "futuristic technological innovative digital cutting-edge",
    Organic: "natural organic eco-friendly sustainable earthy",
  };

  const iconStyleDescriptors: Record<NonNullable<GenerateLogoInput["iconStyle"]>, string> = {
    abstract: "abstract geometric shapes with modern artistic interpretation",
    geometric: "precise geometric forms with clean lines and mathematical proportions",
    typographic: "creative typographic treatment focusing on the brand initials",
    symbolic: "symbolic icon representing the brand essence",
    badge: "badge-style logo with contained elements",
  };

  const layoutDescriptions: Record<NonNullable<GenerateLogoInput["layout"]>, string> = {
    horizontal: "horizontal layout with icon beside text",
    stacked: "vertical stacked layout with icon above text",
    "icon-only": "icon-only standalone symbol mark",
  };

  return `Professional brand logo design for "${brandName}" in ${industry}. ${typographyStyles[typography]}. ${iconStyleDescriptors[iconStyle]}. ${toneDescriptors[tone]}. Main colors: ${primaryColor} and ${secondaryColor}. ${layoutDescriptions[layout]}. Clean vector style, white background, minimal and memorable mark suitable for identity systems.`;
}

async function pollDeapiResult(requestId: string, apiKey: string): Promise<VariantImage> {
  const maxAttempts = 30;

  for (let attempts = 0; attempts < maxAttempts; attempts += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollResponse = await fetch(`${DEAPI_STATUS_URL}/${requestId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!pollResponse.ok) {
      continue;
    }

    const pollData = (await pollResponse.json()) as {
      data?: {
        status?: string;
        result_url?: string;
      };
    };

    if (pollData.data?.status === "done" && pollData.data.result_url) {
      const imageUrl = pollData.data.result_url;
      try {
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString("base64")}`;
          return { imageUrl, base64 };
        }
      } catch {
        return { imageUrl };
      }

      return { imageUrl };
    }

    if (pollData.data?.status === "failed") {
      throw new Error("La generacion de imagen fallo en DEAPI");
    }
  }

  throw new Error("La generacion de imagen excedio el tiempo de espera");
}

async function generateLogoVariant({
  prompt,
  negativePrompt,
  apiKey,
  seed,
  width = 768,
  height = 768,
}: {
  prompt: string;
  negativePrompt: string;
  apiKey: string;
  seed: number;
  width?: number;
  height?: number;
}): Promise<VariantImage> {
  const requestBody = {
    prompt,
    model: process.env.DEAPI_MODEL || "ZImageTurbo_INT8",
    width,
    height,
    guidance: 7.5,
    steps: 8,
    negative_prompt: negativePrompt,
    seed,
  };

  const response = await fetch(DEAPI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`DEAPI ${response.status}: ${details}`);
  }

  const data = (await response.json()) as {
    data?: {
      request_id?: string;
      url?: string;
      image?: string;
      base64?: string;
    };
    url?: string;
    image?: string;
    base64?: string;
  };

  if (data.data?.request_id) {
    return pollDeapiResult(data.data.request_id, apiKey);
  }

  const imageUrl = data.url || data.image || data.data?.url || data.data?.image;
  const base64 = data.base64 || data.data?.base64;

  if (!imageUrl && !base64) {
    throw new Error("DEAPI no devolvio imagen");
  }

  return { imageUrl, base64 };
}

function getFallbackGuidelines(input: GenerateLogoInput): LogoGuidelinesPayload {
  const primary = normalizeHex(input.primaryColor);
  const secondary = normalizeHex(input.secondaryColor);

  return {
    clearSpace: 50,
    minSizes: {
      print: 20,
      screen: 120,
      favicon: 32,
    },
    allowedBackgrounds: ["#FFFFFF", "#000000", primary, secondary],
    prohibitedBackgrounds: ["#FF00FF", "#00FFFF"],
    usageExamples: [
      {
        title: "Logo principal sobre fondo blanco",
        isCorrect: true,
        description: "Version principal con area de proteccion completa y contraste optimo.",
      },
      {
        title: "Version negativa sobre fondo oscuro",
        isCorrect: true,
        description: "Usar la variante negativa cuando el fondo oscuro compromete legibilidad.",
      },
      {
        title: "Logo distorsionado horizontalmente",
        isCorrect: false,
        description: "No estirar ni comprimir el logotipo; siempre mantener proporcion original.",
      },
      {
        title: "Logo con sombra y efectos",
        isCorrect: false,
        description: "No aplicar sombras, biseles ni efectos no aprobados por el sistema de marca.",
      },
    ],
  };
}

async function generateGuidelinesWithBaml(input: GenerateLogoInput): Promise<LogoGuidelinesPayload> {
  const fallback = getFallbackGuidelines(input);
  const governanceProfile = resolveBrandGovernanceProfile({ personalityId: null });

  const systemPrompt = buildBrandTextInstruction({
    moduleName: "logo-guidelines",
    brandName: input.brandName,
    locale: "es-ES",
    profile: governanceProfile,
    requiresJson: true,
  });

  const userPrompt = [
    "Genera JSON estricto para completar todas las areas del flujo de logotipo de una sola vez.",
    "No incluyas markdown ni texto fuera de JSON.",
    "Usa estos datos de entrada:",
    JSON.stringify(
      {
        brandName: input.brandName,
        industry: input.industry || "business",
        tone: input.tone,
        typography: input.typography,
        iconStyle: input.iconStyle || "geometric",
        layout: input.layout || "horizontal",
        primaryColor: normalizeHex(input.primaryColor),
        secondaryColor: normalizeHex(input.secondaryColor),
      },
      null,
      2,
    ),
    "Schema requerido:",
    JSON.stringify(
      {
        clearSpace: 50,
        minSizes: { print: 20, screen: 120, favicon: 32 },
        allowedBackgrounds: ["#FFFFFF", "#000000", "#1E3A8A"],
        prohibitedBackgrounds: ["#FF00FF", "#00FFFF"],
        usageExamples: [
          {
            title: "Texto",
            isCorrect: true,
            description: "Explicacion tecnica breve",
          },
        ],
      },
      null,
      2,
    ),
    "Reglas: allowedBackgrounds/prohibitedBackgrounds en HEX #RRGGBB, usageExamples minimo 4 (2 correctos y 2 incorrectos).",
  ].join("\n\n");

  try {
    const response = await runBamlText({
      prompt: userPrompt,
      systemPrompt,
      forceJson: true,
      inputs: {
        brand_tone: governanceProfile.text.tone,
        corporate_terms: governanceProfile.text.terminology.join(","),
        output_contract: "JSON estricto y valido",
      },
    });

    const parsed = parseJsonResponse<unknown>(response.content);
    const safe = logoGuidelinesSchema.safeParse(parsed);
    if (!safe.success) {
      return fallback;
    }

    return safe.data;
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateLogoInput;

    const DEAPI_API_KEY =
      process.env.DEAPI_API_KEY ||
      process.env.DEAPI_AI_KEY ||
      process.env.IMAGE_GENERATION_API_KEY;

    if (!DEAPI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Logo generation service is not configured. Please contact support.",
          errorType: "server",
        },
        { status: 500 },
      );
    }

    if (!body.brandName || !body.primaryColor || !body.secondaryColor) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: brandName, primaryColor, secondaryColor",
          errorType: "validation",
        },
        { status: 400 },
      );
    }

    const basePrompt = buildLogoPrompt(body);
    const governanceProfile = resolveBrandGovernanceProfile({
      personalityId: null,
    });

    const brandedPrompt = buildBrandedImagePrompt({
      basePrompt,
      moduleName: "logo",
      profile: governanceProfile,
      paletteOverride: [body.primaryColor, body.secondaryColor],
      styleOverride: [`brand tone: ${body.tone}`, `industry: ${body.industry || "business"}`],
      compositionOverride: [
        `layout preference: ${body.layout || "horizontal"}`,
        `icon style: ${body.iconStyle || "geometric"}`,
      ],
    });

    const promptValidation = validateBrandedImagePrompt(brandedPrompt);
    if (!promptValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Brand prompt validation failed: ${promptValidation.issues.join(" | ")}`,
          errorType: "validation",
        },
        { status: 422 },
      );
    }

    const primaryVariant = await generateLogoVariant({
      prompt: brandedPrompt.positivePrompt,
      negativePrompt: brandedPrompt.negativePrompt,
      apiKey: DEAPI_API_KEY,
      seed: Math.floor(Math.random() * 1_000_000_000),
    });

    const [secondaryResult, monochromeResult, iconResult, guidelinesResult] = await Promise.allSettled([
      generateLogoVariant({
        prompt: `${brandedPrompt.positivePrompt}\n\nCreate the NEGATIVE version of the same logo for dark backgrounds. White foreground, high contrast, keep structure identical to primary version.`,
        negativePrompt: `${brandedPrompt.negativePrompt}, colorful gradients`,
        apiKey: DEAPI_API_KEY,
        seed: Math.floor(Math.random() * 1_000_000_000),
      }),
      generateLogoVariant({
        prompt: `${brandedPrompt.positivePrompt}\n\nCreate a MONOCHROME black logo version suitable for one-ink print. Keep readability and visual balance.`,
        negativePrompt: `${brandedPrompt.negativePrompt}, multiple colors`,
        apiKey: DEAPI_API_KEY,
        seed: Math.floor(Math.random() * 1_000_000_000),
      }),
      generateLogoVariant({
        prompt: `${brandedPrompt.positivePrompt}\n\nCreate ICON-ONLY symbol extracted from the same logo system. No wordmark, centered composition, app-icon ready.`,
        negativePrompt: `${brandedPrompt.negativePrompt}, long text`,
        apiKey: DEAPI_API_KEY,
        seed: Math.floor(Math.random() * 1_000_000_000),
        width: 512,
        height: 512,
      }),
      generateGuidelinesWithBaml(body),
    ]);

    const secondaryVariant = secondaryResult.status === "fulfilled" ? secondaryResult.value : undefined;
    const monochromeVariant = monochromeResult.status === "fulfilled" ? monochromeResult.value : undefined;
    const iconVariant = iconResult.status === "fulfilled" ? iconResult.value : undefined;

    const guidelines =
      guidelinesResult.status === "fulfilled"
        ? guidelinesResult.value
        : getFallbackGuidelines(body);

    const primarySource = pickImageSource(primaryVariant);
    if (!primarySource) {
      return NextResponse.json({
        success: false,
        error: "No image data received from the generation service.",
        errorType: "api",
      });
    }

    const secondarySource = pickImageSource(secondaryVariant) || primarySource;
    const monochromeSource = pickImageSource(monochromeVariant) || primarySource;
    const iconSource = pickImageSource(iconVariant) || primarySource;

    return NextResponse.json({
      success: true,
      imageUrl: primaryVariant.imageUrl,
      base64: primaryVariant.base64,
      variants: {
        primary: primarySource,
        secondary: secondarySource,
        monochrome: monochromeSource,
        icon: iconSource,
      },
      guidelines,
    });
  } catch (error) {
    console.error("[LogoGenerator API] Request failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Network error occurred while generating the logo. Please check your connection and try again.",
        errorType: "server",
      },
      { status: 500 },
    );
  }
}
