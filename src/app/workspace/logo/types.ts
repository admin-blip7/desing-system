import type { BrandTokens } from "@/lib/design-tokens/types";

export type LogoTypographyStyle =
  | "Serif"
  | "Sans-serif"
  | "Modern"
  | "Script"
  | "Bold"
  | "Light";

export type LogoToneStyle =
  | "Professional"
  | "Playful"
  | "Luxury"
  | "Minimalist"
  | "Bold"
  | "Elegant"
  | "Tech"
  | "Organic";

export type LogoIconStyle = "abstract" | "geometric" | "typographic" | "symbolic" | "badge";
export type LogoLayout = "horizontal" | "stacked" | "icon-only";

export type BamlStepId = "market" | "identity" | "prompt" | "review";

export interface MarketCompetitorInsight {
  id: string;
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketSignals: string[];
}

export interface MarketData {
  source: "brand-generation-session" | "brief-fallback";
  brandName: string;
  industry: string;
  updatedAt: string;
  sessionId?: string;
  competitors: MarketCompetitorInsight[];
  marketSignals: string[];
  whitespaceOpportunities: string[];
  strategicRisks: string[];
}

export interface BrandIdentity {
  brandId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    monoFont: string;
    bodyLineHeight: number;
    headingLineHeight: number;
  };
  spacing: BrandTokens["spacing"];
  radius: BrandTokens["radius"];
  shadow: BrandTokens["shadow"];
}

export interface BamlFormState {
  brandName: string;
  industry: string;
  selectedCompetitors: string[];
  selectedSignals: string[];
  selectedOpportunities: string[];
  selectedRisks: string[];
  typography: LogoTypographyStyle;
  tone: LogoToneStyle;
  iconStyle: LogoIconStyle;
  layout: LogoLayout;
  userPrompt: string;
  negativePrompt: string;
}

export interface BamlGeneratedResult {
  imageUrl: string;
  prompt: string;
  generatedAt: string;
}

export interface BrandGenerationSessionListResponse {
  success: boolean;
  sessions?: BrandGenerationSessionPayload[];
  error?: string;
}

export interface BrandGenerationSessionPayload {
  id: string;
  brandId: string;
  status: "created" | "running" | "in_progress" | "completed" | "failed";
  updatedAt: string;
  input: {
    brandName: string;
    industry: string;
    competitors?: string[];
  };
  result: {
    artifacts?: {
      competitiveResearch?: {
        competitorInsights?: Array<{
          name: string;
          strengths?: string[];
          weaknesses?: string[];
          marketSignals?: string[];
        }>;
        whitespaceOpportunities?: string[];
        strategicRisks?: string[];
      };
    };
  } | null;
}

export interface GenerateLogoApiResponse {
  success: boolean;
  imageUrl?: string;
  base64?: string;
  error?: string;
  errorType?: "validation" | "api" | "server" | "unauthorized";
}
