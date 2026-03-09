import { BrandTokenBundle, BrandTokens } from "@/lib/design-tokens/types";

export const CORE_BRAND_ID = "manual";

export const coreBrandTokens: BrandTokens = {
  color: {
    background: "#0a0a0a",
    surface: "#111111",
    surfaceMuted: "#18181b",
    textPrimary: "#f4f4f5",
    textSecondary: "#a1a1aa",
    accent: "#f5c518",
    accentMuted: "rgba(245, 197, 24, 0.2)",
    accentContrast: "#050505",
    border: "#27272a",
    borderStrong: "#3f3f46",
    focus: "#f5c518",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  typography: {
    fontSans: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontMono: "var(--font-geist-mono), 'SFMono-Regular', Menlo, monospace",
    fontDisplay: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weightRegular: 400,
    weightMedium: 500,
    weightBold: 700,
    lineHeightBody: 1.55,
    lineHeightHeading: 1.2,
    letterSpacingBody: "0em",
    letterSpacingHeading: "-0.02em",
  },
  spacing: {
    xxs: "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    xxl: "2rem",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "18px",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.35)",
    md: "0 8px 20px rgba(0, 0, 0, 0.3)",
    lg: "0 18px 40px rgba(0, 0, 0, 0.4)",
    glow: "0 0 0 1px rgba(245, 197, 24, 0.15), 0 0 22px rgba(245, 197, 24, 0.2)",
    inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  },
  motion: {
    fast: "120ms",
    normal: "220ms",
    slow: "360ms",
    easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
    easingEmphasis: "cubic-bezier(0.2, 0.7, 0.2, 1)",
  },
  component: {
    buttonPrimaryBg: "#f5c518",
    buttonPrimaryText: "#050505",
    buttonPrimaryBorder: "transparent",
    buttonSecondaryBg: "#18181b",
    buttonSecondaryText: "#f4f4f5",
    buttonSecondaryBorder: "#3f3f46",
    cardBg: "#111111",
    cardBorder: "#27272a",
    inputBg: "#09090b",
    inputText: "#f4f4f5",
    inputBorder: "#3f3f46",
    inputFocusRing: "#f5c518",
  },
};

export const coreTokenBundle: BrandTokenBundle = {
  id: CORE_BRAND_ID,
  version: "1.0.0",
  tokens: coreBrandTokens,
  metadata: {
    source: "manual",
    updatedAt: new Date().toISOString(),
    description: "Fallback token pack used when a brand has no explicit overrides.",
  },
};
