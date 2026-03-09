"use client";

import { ModuleType } from "@/lib/data/module-types";
import { BrandTokens } from "@/lib/design-tokens/types";
import ContentPreview from "@/components/workspace/previews/ContentPreview";
import ColorPreview from "@/components/workspace/previews/ColorPreview";
import TypographyPreview from "@/components/workspace/previews/TypographyPreview";
import LogoPreview from "@/components/workspace/previews/LogoPreview";
import SystemPreview from "@/components/workspace/previews/SystemPreview";
import TemplatePreview from "@/components/workspace/previews/TemplatePreview";
import DefaultPreview from "@/components/workspace/previews/DefaultPreview";

interface ModulePreviewProps {
  content: any;
  moduleType: ModuleType;
  moduleKey: string;
  brandTokens?: BrandTokens;
  moduleName: string;
  brandName: string;
}

// Default tokens for when brandTokens is not available
const defaultTokens: BrandTokens = {
  color: {
    background: "#ffffff",
    surface: "#f5f5f5",
    surfaceMuted: "#e5e5e5",
    textPrimary: "#000000",
    textSecondary: "#666666",
    accent: "#000000",
    accentMuted: "#cccccc",
    accentContrast: "#ffffff",
    border: "#e5e5e5",
    borderStrong: "#cccccc",
    focus: "#000000",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  typography: {
    fontSans: "sans-serif",
    fontMono: "monospace",
    fontDisplay: "sans-serif",
    weightRegular: 400,
    weightMedium: 500,
    weightBold: 600,
    lineHeightBody: 1.6,
    lineHeightHeading: 1.2,
    letterSpacingBody: "0em",
    letterSpacingHeading: "-0.02em",
  },
  spacing: {
    xxs: "4px",
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    glow: "0 0 20px rgba(0,0,0,0.1)",
    inset: "inset 0 2px 4px rgba(0,0,0,0.05)",
  },
  motion: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
    easingEmphasis: "cubic-bezier(0.4, 0, 0.6, 1)",
  },
  component: {
    buttonPrimaryBg: "#000000",
    buttonPrimaryText: "#ffffff",
    buttonPrimaryBorder: "#000000",
    buttonSecondaryBg: "transparent",
    buttonSecondaryText: "#000000",
    buttonSecondaryBorder: "#e5e5e5",
    cardBg: "#ffffff",
    cardBorder: "#e5e5e5",
    inputBg: "#ffffff",
    inputText: "#000000",
    inputBorder: "#e5e5e5",
    inputFocusRing: "rgba(0,0,0,0.1)",
  },
};

export default function ModulePreview({
  content,
  moduleType,
  moduleKey,
  brandTokens,
  moduleName,
  brandName,
}: ModulePreviewProps) {
  // Use brandTokens or fallback to defaults
  const tokens = brandTokens || defaultTokens;

  // Si no hay contenido, mostrar estado vacío
  if (!content) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <p>No hay contenido para previsualizar.</p>
        <p style={{ fontSize: "12px", marginTop: "8px" }}>
          Genera el contenido primero en la pestaña "Generate"
        </p>
      </div>
    );
  }

  // Preview especializado según tipo de módulo
  if (moduleType === "content") {
    return (
      <ContentPreview
        content={content}
        brandTokens={tokens}
        moduleName={moduleName}
        brandName={brandName}
      />
    );
  }

  if (moduleType === "visual") {
    // Previews específicos para módulos visuales
    switch (moduleKey) {
      case "colorPalette":
        return (
          <ColorPreview
            content={content}
            brandTokens={tokens}
            moduleName={moduleName}
            brandName={brandName}
          />
        );
      case "typography":
        return (
          <TypographyPreview
            content={content}
            brandTokens={tokens}
            moduleName={moduleName}
            brandName={brandName}
          />
        );
      case "logo":
        return (
          <LogoPreview
            content={content}
            brandTokens={tokens}
            moduleName={moduleName}
            brandName={brandName}
          />
        );
      default:
        return (
          <DefaultPreview
            content={content}
            brandTokens={tokens}
            moduleName={moduleName}
            brandName={brandName}
          />
        );
    }
  }

  if (moduleType === "system") {
    return (
      <SystemPreview
        content={content}
        brandTokens={tokens}
        moduleName={moduleName}
        brandName={brandName}
      />
    );
  }

  if (moduleType === "template") {
    return (
      <TemplatePreview
        content={content}
        brandTokens={tokens}
        moduleName={moduleName}
        brandName={brandName}
      />
    );
  }

  // Default preview
  return (
    <DefaultPreview
      content={content}
      brandTokens={tokens}
      moduleName={moduleName}
      brandName={brandName}
    />
  );
}
