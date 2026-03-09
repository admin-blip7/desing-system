"use client";

import { useState } from "react";
import { BrandTokens } from "@/lib/design-tokens/types";
import { Check } from "lucide-react";

interface TypographyPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

interface TypographySystem {
  fonts?: {
    display?: string;
    heading?: string;
    body?: string;
    mono?: string;
  };
  scale?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
    "3xl"?: string;
    "4xl"?: string;
  };
  weights?: {
    light?: number;
    regular?: number;
    medium?: number;
    semibold?: number;
    bold?: number;
  };
  lineHeights?: {
    tight?: string;
    normal?: string;
    relaxed?: string;
  };
}

function extractTypography(content: any): TypographySystem {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      return {};
    }
  }

  if (content?.fonts || content?.scale || content?.weights) {
    return content;
  }

  return {};
}

function FontSample({
  name,
  font,
  brandTokens,
  size = "24px",
  weight = 400,
}: {
  name: string;
  font: string;
  brandTokens: BrandTokens;
  size?: string;
  weight?: number;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      style={{
        marginBottom: brandTokens.spacing?.md || "16px",
        padding: brandTokens.spacing?.md || "16px",
        background: brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.md || "8px",
        border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => {
        navigator.clipboard.writeText(`font-family: ${font};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = brandTokens.shadow?.md || "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: brandTokens.color?.textSecondary || "#888",
          marginBottom: brandTokens.spacing?.xs || "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{name}</span>
        {copied && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: brandTokens.color?.accent || "#000",
            }}
          >
            <Check size={12} />
            Copiado
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          fontWeight: weight,
          color: brandTokens.color?.textPrimary || "#000",
          marginBottom: brandTokens.spacing?.xs || "8px",
        }}
      >
        Aa Bb Cc Dd Ee Ff Gg
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: "14px",
          color: brandTokens.color?.textSecondary || "#666",
        }}
      >
        {font}
      </div>
    </div>
  );
}

function TypeScale({
  label,
  size,
  brandTokens,
  font,
}: {
  label: string;
  size: string;
  brandTokens: BrandTokens;
  font?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        padding: `${brandTokens.spacing?.sm || "12px"} 0`,
        borderBottom: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
      }}
    >
      <div
        style={{
          fontFamily: font || brandTokens.typography?.fontMono || "monospace",
          fontSize: "12px",
          color: brandTokens.color?.textSecondary || "#888",
          width: "120px",
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: font || brandTokens.typography?.fontSans || "sans-serif",
          fontSize: size,
          fontWeight: brandTokens.typography?.weightRegular || "400",
          color: brandTokens.color?.textPrimary || "#000",
          flex: 1,
        }}
      >
        El veloz murciélago hindú comía feliz cardillo y kiwi
      </div>
      <div
        style={{
          fontFamily: brandTokens.typography?.fontMono || "monospace",
          fontSize: "12px",
          color: brandTokens.color?.textSecondary || "#888",
          width: "60px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {size}
      </div>
    </div>
  );
}

function WeightSample({
  label,
  weight,
  brandTokens,
  font,
}: {
  label: string;
  weight: number;
  brandTokens: BrandTokens;
  font?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: `${brandTokens.spacing?.sm || "12px"} ${brandTokens.spacing?.md || "16px"}`,
        background: brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.sm || "4px",
        marginBottom: brandTokens.spacing?.xs || "8px",
      }}
    >
      <div
        style={{
          fontFamily: brandTokens.typography?.fontMono || "monospace",
          fontSize: "11px",
          color: brandTokens.color?.textSecondary || "#888",
          width: "80px",
          flexShrink: 0,
        }}
      >
        {weight}
      </div>
      <div
        style={{
          fontFamily: font || brandTokens.typography?.fontSans || "sans-serif",
          fontSize: "16px",
          fontWeight: weight,
          color: brandTokens.color?.textPrimary || "#000",
          flex: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function TypographyPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: TypographyPreviewProps) {
  const typography = extractTypography(content);

  // Usar tokens de la marca o valores por defecto
  const fonts = {
    display: typography.fonts?.display || brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans || "sans-serif",
    heading: typography.fonts?.heading || brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans || "sans-serif",
    body: typography.fonts?.body || brandTokens.typography?.fontSans || "sans-serif",
    mono: typography.fonts?.mono || brandTokens.typography?.fontMono || "monospace",
  };

  const weights = {
    light: typography.weights?.light || 300,
    regular: typography.weights?.regular || 400,
    medium: typography.weights?.medium || 500,
    semibold: typography.weights?.semibold || 600,
    bold: typography.weights?.bold || 700,
  };

  return (
    <div
      style={{
        fontFamily: brandTokens.typography?.fontSans || "sans-serif",
        backgroundColor: brandTokens.color?.background || "#fff",
        color: brandTokens.color?.textPrimary || "#000",
        padding: brandTokens.spacing?.xl || "48px",
        minHeight: "600px",
      }}
    >
      {/* Header */}
      <header
        style={{
          marginBottom: brandTokens.spacing?.xl || "48px",
          paddingBottom: brandTokens.spacing?.md || "24px",
          borderBottom: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: brandTokens.color?.textSecondary || "#888",
            marginBottom: brandTokens.spacing?.xs || "8px",
          }}
        >
          Brand Manual Preview
        </div>
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: brandTokens.typography?.weightBold || "600",
            letterSpacing: brandTokens.typography?.letterSpacingHeading || "-0.02em",
            color: brandTokens.color?.textPrimary || "#000",
            margin: 0,
          }}
        >
          {moduleName}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: brandTokens.color?.textSecondary || "#666",
            margin: `${brandTokens.spacing?.xs || "4px"} 0 0 0`,
          }}
        >
          {brandName}
        </p>
      </header>

      {/* Font Families */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Familias Tipográficas
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: brandTokens.spacing?.md || "16px",
          }}
        >
          <FontSample
            name="Display"
            font={fonts.display}
            brandTokens={brandTokens}
            size="32px"
            weight={weights.bold}
          />
          <FontSample
            name="Heading"
            font={fonts.heading}
            brandTokens={brandTokens}
            size="24px"
            weight={weights.semibold}
          />
          <FontSample
            name="Body"
            font={fonts.body}
            brandTokens={brandTokens}
            size="16px"
            weight={weights.regular}
          />
          <FontSample
            name="Mono"
            font={fonts.mono}
            brandTokens={brandTokens}
            size="14px"
            weight={weights.regular}
          />
        </div>
      </section>

      {/* Type Scale */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Escala Tipográfica
        </h2>
        <div
          style={{
            background: brandTokens.color?.surface || "#f5f5f5",
            padding: brandTokens.spacing?.md || "16px",
            borderRadius: brandTokens.radius?.md || "8px",
          }}
        >
          <TypeScale
            label="Display 2XL"
            size="48px"
            brandTokens={brandTokens}
            font={fonts.display}
          />
          <TypeScale
            label="Display XL"
            size="36px"
            brandTokens={brandTokens}
            font={fonts.display}
          />
          <TypeScale
            label="Heading XL"
            size="24px"
            brandTokens={brandTokens}
            font={fonts.heading}
          />
          <TypeScale
            label="Heading LG"
            size="20px"
            brandTokens={brandTokens}
            font={fonts.heading}
          />
          <TypeScale
            label="Body LG"
            size="18px"
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <TypeScale
            label="Body Base"
            size="16px"
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <TypeScale
            label="Body SM"
            size="14px"
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <TypeScale
            label="Caption"
            size="12px"
            brandTokens={brandTokens}
            font={fonts.body}
          />
        </div>
      </section>

      {/* Font Weights */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
        Pesos Tipográficos
        </h2>
        <div style={{ maxWidth: "400px" }}>
          <WeightSample
            label="Light"
            weight={weights.light}
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <WeightSample
            label="Regular"
            weight={weights.regular}
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <WeightSample
            label="Medium"
            weight={weights.medium}
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <WeightSample
            label="Semibold"
            weight={weights.semibold}
            brandTokens={brandTokens}
            font={fonts.body}
          />
          <WeightSample
            label="Bold"
            weight={weights.bold}
            brandTokens={brandTokens}
            font={fonts.body}
          />
        </div>
      </section>

      {/* Application Example */}
      <section>
        <h2
          style={{
            fontFamily: fonts.heading,
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Ejemplo de Aplicación
        </h2>
        <div
          style={{
            background: brandTokens.color?.surface || "#f5f5f5",
            padding: brandTokens.spacing?.xl || "32px",
            borderRadius: brandTokens.radius?.lg || "12px",
          }}
        >
          <h3
            style={{
              fontFamily: fonts.display,
              fontSize: "32px",
              fontWeight: weights.bold,
              color: brandTokens.color?.textPrimary || "#000",
              margin: `0 0 ${brandTokens.spacing?.md || "16px"} 0`,
              letterSpacing: brandTokens.typography?.letterSpacingHeading || "-0.02em",
            }}
          >
            Título Principal
          </h3>
          <h4
            style={{
              fontFamily: fonts.heading,
              fontSize: "20px",
              fontWeight: weights.semibold,
              color: brandTokens.color?.textPrimary || "#000",
              margin: `0 0 ${brandTokens.spacing?.sm || "12px"} 0`,
            }}
          >
            Subtítulo de Sección
          </h4>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "16px",
              fontWeight: weights.regular,
              lineHeight: brandTokens.typography?.lineHeightBody || "1.6",
              color: brandTokens.color?.textSecondary || "#666",
              margin: `0 0 ${brandTokens.spacing?.md || "16px"} 0`,
            }}
          >
            Este es un ejemplo de párrafo con el estilo de cuerpo. La tipografía es
            fundamental para la identidad visual de la marca, transmitiendo personalidad
            y jerarquía visual a través del sistema tipográfico.
          </p>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: "16px",
              fontWeight: weights.medium,
              color: brandTokens.color?.accent || "#000",
              margin: 0,
            }}
          >
            <code
              style={{
                fontFamily: fonts.mono,
                background: brandTokens.color?.background || "#fff",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "14px",
                border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
              }}
            >
              code mono
            </code>
            &nbsp;destacado en medio del texto.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: brandTokens.spacing?.xl || "48px",
          paddingTop: brandTokens.spacing?.md || "24px",
          borderTop: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
          fontSize: "12px",
          color: brandTokens.color?.textSecondary || "#888",
          fontFamily: fonts.body,
        }}
      >
        <p style={{ margin: 0 }}>
          Generado con Brand Manual Generator · {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}
