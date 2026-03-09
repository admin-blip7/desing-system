import { coreTokenBundle } from "@/lib/design-tokens/core";
import { BrandTokenBundle, DeepPartial, BrandTokens } from "@/lib/design-tokens/types";
import { BrandPersonality, personalities } from "@/lib/data/personalities";

const HEX_6_REGEX = /^#?[0-9a-f]{6}$/i;
const HEX_3_REGEX = /^#?[0-9a-f]{3}$/i;

function normalizeHex(input: string | null | undefined, fallback: string) {
  if (!input) return fallback;
  const value = input.trim();

  if (HEX_6_REGEX.test(value)) {
    return value.startsWith("#") ? value : `#${value}`;
  }

  if (HEX_3_REGEX.test(value)) {
    const source = value.startsWith("#") ? value.slice(1) : value;
    return `#${source
      .split("")
      .map((part) => `${part}${part}`)
      .join("")}`;
  }

  return fallback;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex, "#000000").replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  const clamped = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clamped})`;
}

function isDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.52;
}

function pickContrastText(hex: string) {
  return isDark(hex) ? "#f8fafc" : "#050505";
}

function normalizeRadius(rawRadius: string | null | undefined, fallback: string) {
  if (!rawRadius) return fallback;
  const trimmed = rawRadius.trim();
  if (!trimmed) return fallback;
  if (trimmed === "0" || trimmed === "0px") return "0px";
  return trimmed.endsWith("px") || trimmed.endsWith("rem") ? trimmed : fallback;
}

function getSpacingScale(personality: BrandPersonality): BrandTokens["spacing"] {
  const density = personality.dna?.layout?.density?.toLowerCase() || "";

  if (density.includes("ultra-m") || density.includes("ultra b")) {
    return {
      xxs: "0.25rem",
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem",
    };
  }

  if (density.includes("alta")) {
    return {
      xxs: "0.125rem",
      xs: "0.25rem",
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      xxl: "1.5rem",
    };
  }

  return {
    xxs: "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    xxl: "2rem",
  };
}

function getMotionScale(personality: BrandPersonality): BrandTokens["motion"] {
  const speed = personality.dna?.motion?.speed?.toLowerCase() || "";

  if (speed.includes("rap")) {
    return {
      fast: "90ms",
      normal: "160ms",
      slow: "250ms",
      easingStandard: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      easingEmphasis: "cubic-bezier(0.2, 0.9, 0.2, 1)",
    };
  }

  if (speed.includes("lento")) {
    return {
      fast: "180ms",
      normal: "320ms",
      slow: "520ms",
      easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingEmphasis: "cubic-bezier(0.1, 0.7, 0.1, 1)",
    };
  }

  return {
    fast: "120ms",
    normal: "220ms",
    slow: "360ms",
    easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
    easingEmphasis: "cubic-bezier(0.2, 0.7, 0.2, 1)",
  };
}

function createTokensFromPersonality(personality: BrandPersonality): DeepPartial<BrandTokens> {
  const preview = personality.cssPreview;

  const accent = normalizeHex(preview?.accent || personality.accentColor || personality.color, "#f5c518");
  const background = normalizeHex(preview?.background || "#0a0a0a", "#0a0a0a");
  const foreground = normalizeHex(preview?.foreground || "#f4f4f5", "#f4f4f5");
  const cardBg = normalizeHex(personality.cardBg || background, background);
  const border = withAlpha(accent, 0.25);
  const radiusMd = normalizeRadius(preview?.radius, "10px");

  const motion = getMotionScale(personality);
  const spacing = getSpacingScale(personality);

  return {
    color: {
      background,
      surface: cardBg,
      surfaceMuted: withAlpha(foreground, 0.07),
      textPrimary: foreground,
      textSecondary: withAlpha(foreground, 0.68),
      accent,
      accentMuted: withAlpha(accent, 0.2),
      accentContrast: pickContrastText(accent),
      border,
      borderStrong: withAlpha(accent, 0.4),
      focus: accent,
    },
    typography: {
      fontSans: preview?.fontFamily || "var(--font-geist-sans), sans-serif",
      fontDisplay: preview?.fontFamily || "var(--font-geist-sans), sans-serif",
      letterSpacingHeading:
        personality.dna?.typography?.letterSpacing?.toLowerCase().includes("tight") ? "-0.02em" : "0em",
    },
    spacing,
    radius: {
      sm: radiusMd === "0px" ? "0px" : "6px",
      md: radiusMd,
      lg: radiusMd === "0px" ? "0px" : "14px",
      xl: radiusMd === "0px" ? "0px" : "20px",
      full: "9999px",
    },
    shadow: {
      sm: preview?.shadow || `0 1px 2px ${withAlpha("#000000", 0.35)}`,
      md: preview?.shadow || `0 8px 20px ${withAlpha("#000000", 0.3)}`,
      glow: `0 0 0 1px ${withAlpha(accent, 0.24)}, 0 0 20px ${withAlpha(accent, 0.18)}`,
    },
    motion,
    component: {
      buttonPrimaryBg: accent,
      buttonPrimaryText: pickContrastText(accent),
      buttonPrimaryBorder: withAlpha(accent, 0.45),
      buttonSecondaryBg: withAlpha(foreground, 0.08),
      buttonSecondaryText: foreground,
      buttonSecondaryBorder: withAlpha(foreground, 0.2),
      cardBg,
      cardBorder: border,
      inputBg: withAlpha(background, 0.75),
      inputText: foreground,
      inputBorder: withAlpha(foreground, 0.24),
      inputFocusRing: accent,
    },
  };
}

function createBundle(personality: BrandPersonality): BrandTokenBundle {
  return {
    id: personality.id,
    version: "1.0.0",
    tokens: createTokensFromPersonality(personality),
    metadata: {
      source: personality.id === "manual" ? "manual" : "personality",
      updatedAt: new Date().toISOString(),
      description: personality.tagline,
    },
  };
}

const generatedBundles = personalities.map((personality) => createBundle(personality));

export const brandTokenRegistry = generatedBundles.reduce<Record<string, BrandTokenBundle>>(
  (acc, bundle) => {
    acc[bundle.id] = bundle;
    return acc;
  },
  { [coreTokenBundle.id]: coreTokenBundle },
);

export function getBrandTokenBundle(brandId: string | null | undefined) {
  if (brandId && brandTokenRegistry[brandId]) {
    return brandTokenRegistry[brandId];
  }

  return brandTokenRegistry.manual || coreTokenBundle;
}
