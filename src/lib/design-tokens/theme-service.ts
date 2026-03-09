import { coreBrandTokens } from "@/lib/design-tokens/core";
import { getBrandTokenBundle } from "@/lib/design-tokens/registry";
import { BRAND_THEME_STORAGE_KEY, BRAND_THEME_VARS_STORAGE_KEY } from "@/lib/design-tokens/storage";
import { BrandThemeResolution, BrandTokens, DeepPartial, TokenPrimitive } from "@/lib/design-tokens/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  if (!isRecord(base) || !isRecord(override)) {
    return (override as T) ?? base;
  }

  const output: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override) as Array<keyof typeof override>) {
    const overrideValue = override[key];
    if (overrideValue === undefined) continue;

    const baseValue = output[key as string];
    if (isRecord(baseValue) && isRecord(overrideValue)) {
      output[key as string] = deepMerge(baseValue, overrideValue);
    } else {
      output[key as string] = overrideValue;
    }
  }

  return output as T;
}

function tokenToString(value: TokenPrimitive) {
  return typeof value === "number" ? String(value) : value;
}

export function resolveBrandTheme(brandId: string | null | undefined): BrandThemeResolution {
  const bundle = getBrandTokenBundle(brandId);
  const tokens = deepMerge<BrandTokens>(coreBrandTokens, bundle.tokens);

  return {
    brandId: bundle.id,
    tokens,
    bundle,
  };
}

export function tokensToCssVariables(tokens: BrandTokens) {
  return {
    "--bm-color-bg": tokenToString(tokens.color.background),
    "--bm-color-surface": tokenToString(tokens.color.surface),
    "--bm-color-surface-muted": tokenToString(tokens.color.surfaceMuted),
    "--bm-color-text-primary": tokenToString(tokens.color.textPrimary),
    "--bm-color-text-secondary": tokenToString(tokens.color.textSecondary),
    "--bm-color-accent": tokenToString(tokens.color.accent),
    "--bm-color-accent-muted": tokenToString(tokens.color.accentMuted),
    "--bm-color-accent-contrast": tokenToString(tokens.color.accentContrast),
    "--bm-color-border": tokenToString(tokens.color.border),
    "--bm-color-border-strong": tokenToString(tokens.color.borderStrong),
    "--bm-color-focus": tokenToString(tokens.color.focus),
    "--bm-color-success": tokenToString(tokens.color.success),
    "--bm-color-warning": tokenToString(tokens.color.warning),
    "--bm-color-danger": tokenToString(tokens.color.danger),
    "--bm-font-sans": tokenToString(tokens.typography.fontSans),
    "--bm-font-mono": tokenToString(tokens.typography.fontMono),
    "--bm-font-display": tokenToString(tokens.typography.fontDisplay),
    "--bm-font-weight-regular": tokenToString(tokens.typography.weightRegular),
    "--bm-font-weight-medium": tokenToString(tokens.typography.weightMedium),
    "--bm-font-weight-bold": tokenToString(tokens.typography.weightBold),
    "--bm-line-height-body": tokenToString(tokens.typography.lineHeightBody),
    "--bm-line-height-heading": tokenToString(tokens.typography.lineHeightHeading),
    "--bm-letter-spacing-body": tokenToString(tokens.typography.letterSpacingBody),
    "--bm-letter-spacing-heading": tokenToString(tokens.typography.letterSpacingHeading),
    "--bm-space-xxs": tokenToString(tokens.spacing.xxs),
    "--bm-space-xs": tokenToString(tokens.spacing.xs),
    "--bm-space-sm": tokenToString(tokens.spacing.sm),
    "--bm-space-md": tokenToString(tokens.spacing.md),
    "--bm-space-lg": tokenToString(tokens.spacing.lg),
    "--bm-space-xl": tokenToString(tokens.spacing.xl),
    "--bm-space-xxl": tokenToString(tokens.spacing.xxl),
    "--bm-radius-sm": tokenToString(tokens.radius.sm),
    "--bm-radius-md": tokenToString(tokens.radius.md),
    "--bm-radius-lg": tokenToString(tokens.radius.lg),
    "--bm-radius-xl": tokenToString(tokens.radius.xl),
    "--bm-radius-full": tokenToString(tokens.radius.full),
    "--bm-shadow-sm": tokenToString(tokens.shadow.sm),
    "--bm-shadow-md": tokenToString(tokens.shadow.md),
    "--bm-shadow-lg": tokenToString(tokens.shadow.lg),
    "--bm-shadow-glow": tokenToString(tokens.shadow.glow),
    "--bm-shadow-inset": tokenToString(tokens.shadow.inset),
    "--bm-motion-fast": tokenToString(tokens.motion.fast),
    "--bm-motion-normal": tokenToString(tokens.motion.normal),
    "--bm-motion-slow": tokenToString(tokens.motion.slow),
    "--bm-motion-easing-standard": tokenToString(tokens.motion.easingStandard),
    "--bm-motion-easing-emphasis": tokenToString(tokens.motion.easingEmphasis),
    "--bm-button-primary-bg": tokenToString(tokens.component.buttonPrimaryBg),
    "--bm-button-primary-text": tokenToString(tokens.component.buttonPrimaryText),
    "--bm-button-primary-border": tokenToString(tokens.component.buttonPrimaryBorder),
    "--bm-button-secondary-bg": tokenToString(tokens.component.buttonSecondaryBg),
    "--bm-button-secondary-text": tokenToString(tokens.component.buttonSecondaryText),
    "--bm-button-secondary-border": tokenToString(tokens.component.buttonSecondaryBorder),
    "--bm-card-bg": tokenToString(tokens.component.cardBg),
    "--bm-card-border": tokenToString(tokens.component.cardBorder),
    "--bm-input-bg": tokenToString(tokens.component.inputBg),
    "--bm-input-text": tokenToString(tokens.component.inputText),
    "--bm-input-border": tokenToString(tokens.component.inputBorder),
    "--bm-input-focus-ring": tokenToString(tokens.component.inputFocusRing),
    "--background": tokenToString(tokens.color.background),
    "--foreground": tokenToString(tokens.color.textPrimary),
  } as const;
}

function writeThemeToStorage(brandId: string, variables: Record<string, string>) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(BRAND_THEME_STORAGE_KEY, brandId);
    window.localStorage.setItem(BRAND_THEME_VARS_STORAGE_KEY, JSON.stringify(variables));
  } catch {
    // Ignore storage errors.
  }
}

function readThemeIdFromStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(BRAND_THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readThemeVariablesFromStorage() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(BRAND_THEME_VARS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const entries = Object.entries(parsed).filter((entry) => typeof entry[1] === "string");
    return Object.fromEntries(entries) as Record<string, string>;
  } catch {
    return null;
  }
}

function applyVariables(target: HTMLElement, variables: Record<string, string>) {
  for (const [key, value] of Object.entries(variables)) {
    target.style.setProperty(key, value);
  }
}

export function applyBrandThemeToDocument(brandId: string, options?: { persist?: boolean }) {
  if (typeof document === "undefined") {
    return resolveBrandTheme(brandId);
  }

  const resolution = resolveBrandTheme(brandId);
  const root = document.documentElement;
  const variables = tokensToCssVariables(resolution.tokens);
  applyVariables(root, variables);
  root.setAttribute("data-brand-theme", resolution.brandId);

  if (options?.persist !== false) {
    writeThemeToStorage(resolution.brandId, variables);
  }

  return resolution;
}

export function restoreStoredBrandTheme() {
  if (typeof document === "undefined") return null;

  const root = document.documentElement;
  const storedThemeId = readThemeIdFromStorage();
  const storedVariables = readThemeVariablesFromStorage();

  if (storedVariables && Object.keys(storedVariables).length > 0) {
    applyVariables(root, storedVariables);
    if (storedThemeId) {
      root.setAttribute("data-brand-theme", storedThemeId);
    }
  }

  if (!storedThemeId) return null;

  const resolution = resolveBrandTheme(storedThemeId);
  if (!storedVariables || Object.keys(storedVariables).length === 0) {
    applyBrandThemeToDocument(storedThemeId, { persist: false });
  }

  return resolution;
}
