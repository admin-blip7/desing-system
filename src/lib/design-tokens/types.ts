export type TokenPrimitive = string | number;

export interface BrandTokens {
  color: {
    background: string;
    surface: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentMuted: string;
    accentContrast: string;
    border: string;
    borderStrong: string;
    focus: string;
    success: string;
    warning: string;
    danger: string;
  };
  typography: {
    fontSans: string;
    fontMono: string;
    fontDisplay: string;
    weightRegular: number;
    weightMedium: number;
    weightBold: number;
    lineHeightBody: number;
    lineHeightHeading: number;
    letterSpacingBody: string;
    letterSpacingHeading: string;
  };
  spacing: {
    xxs: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    glow: string;
    inset: string;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
    easingStandard: string;
    easingEmphasis: string;
  };
  component: {
    buttonPrimaryBg: string;
    buttonPrimaryText: string;
    buttonPrimaryBorder: string;
    buttonSecondaryBg: string;
    buttonSecondaryText: string;
    buttonSecondaryBorder: string;
    cardBg: string;
    cardBorder: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    inputFocusRing: string;
  };
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends TokenPrimitive ? T[K] : DeepPartial<T[K]>;
};

export interface BrandTokenBundle {
  id: string;
  version: string;
  tokens: DeepPartial<BrandTokens>;
  metadata: {
    source: "personality" | "manual" | "hybrid";
    updatedAt: string;
    description?: string;
  };
}

export interface BrandThemeResolution {
  brandId: string;
  tokens: BrandTokens;
  bundle: BrandTokenBundle;
}
