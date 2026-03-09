"use client";

import { useState } from "react";
import { BrandTokens } from "@/lib/design-tokens/types";
import { Check } from "lucide-react";

interface ColorPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

interface ColorSwatch {
  name: string;
  hex: string;
  rgb?: string;
  hsl?: string;
  cmyk?: string;
  pantone?: string;
}

function extractColors(content: any): ColorSwatch[] {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed.colors) {
        return parsed.colors;
      }
      if (parsed.palette) {
        return parsed.palette;
      }
    } catch {
      // No es JSON, intentar extraer colores hex del texto
      const hexRegex = /#([0-9A-Fa-f]{6})/g;
      const matches = content.match(hexRegex);
      if (matches) {
        return matches.map((hex) => ({
          name: "Extracted Color",
          hex: hex,
        }));
      }
    }
  }

  if (content?.colors) {
    return content.colors;
  }
  if (content?.palette) {
    return content.palette;
  }
  if (content?.primary || content?.secondary) {
    const colors: ColorSwatch[] = [];
    if (content.primary) colors.push({ name: "Primary", hex: content.primary });
    if (content.secondary) colors.push({ name: "Secondary", hex: content.secondary });
    if (content.accent) colors.push({ name: "Accent", hex: content.accent });
    return colors;
  }

  // Colores por defecto basados en tokens de la marca
  return [
    { name: "Primary", hex: "#000000" },
    { name: "Secondary", hex: "#666666" },
    { name: "Accent", hex: "#F5C518" },
  ];
}

function ColorCard({ color, brandTokens }: { color: ColorSwatch; brandTokens: BrandTokens }) {
  const [copied, setCopied] = useState(false);

  const textColor = getContrastColor(color.hex);

  return (
    <div
      style={{
        background: color.hex,
        borderRadius: brandTokens.radius?.md || "8px",
        padding: brandTokens.spacing?.md || "16px",
        minWidth: "120px",
        textAlign: "center",
        border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => {
        navigator.clipboard.writeText(color.hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
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
          letterSpacing: "0.1em",
          opacity: 0.7,
          marginBottom: brandTokens.spacing?.xs || "4px",
          color: textColor,
        }}
      >
        {color.name}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: brandTokens.typography?.weightMedium || "500",
          color: textColor,
          marginBottom: brandTokens.spacing?.xs || "4px",
        }}
      >
        {color.hex}
      </div>
      {copied && (
        <div
          style={{
            fontSize: "10px",
            color: textColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <Check size={12} />
          Copiado
        </div>
      )}
    </div>
  );
}

function getContrastColor(hexColor: string): string {
  // Convertir hex a RGB
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default function ColorPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: ColorPreviewProps) {
  const colors = extractColors(content);

  // Agrupar colores por categoría
  const primaryColors = colors.slice(0, Math.min(3, colors.length));
  const secondaryColors = colors.length > 3 ? colors.slice(3, Math.min(6, colors.length)) : [];
  const accentColors = colors.length > 6 ? colors.slice(6) : [];

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
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
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

      {/* Primary Colors */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Colores Principales
        </h2>
        <div
          style={{
            display: "flex",
            gap: brandTokens.spacing?.md || "16px",
            flexWrap: "wrap",
          }}
        >
          {primaryColors.map((color, index) => (
            <ColorCard key={index} color={color} brandTokens={brandTokens} />
          ))}
        </div>
      </section>

      {/* Secondary Colors */}
      {secondaryColors.length > 0 && (
        <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: brandTokens.typography?.weightMedium || "500",
              color: brandTokens.color?.textPrimary || "#000",
              marginBottom: brandTokens.spacing?.md || "16px",
            }}
          >
            Colores Secundarios
          </h2>
          <div
            style={{
              display: "flex",
              gap: brandTokens.spacing?.md || "16px",
              flexWrap: "wrap",
            }}
          >
            {secondaryColors.map((color, index) => (
              <ColorCard key={index} color={color} brandTokens={brandTokens} />
            ))}
          </div>
        </section>
      )}

      {/* Application Examples */}
      <section>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Ejemplos de Aplicación
        </h2>

        {/* Botones de ejemplo */}
        <div
          style={{
            display: "flex",
            gap: brandTokens.spacing?.md || "16px",
            marginBottom: brandTokens.spacing?.lg || "32px",
            flexWrap: "wrap",
          }}
        >
          {primaryColors.slice(0, 2).map((color, index) => (
            <button
              key={index}
              style={{
                padding: "12px 24px",
                borderRadius: brandTokens.radius?.md || "8px",
                border: "none",
                background: color.hex,
                color: getContrastColor(color.hex),
                fontFamily: brandTokens.typography?.fontSans,
                fontSize: "14px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                cursor: "pointer",
              }}
            >
              Botón {color.name}
            </button>
          ))}
        </div>

        {/* Tarjetas de ejemplo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: brandTokens.spacing?.md || "16px",
          }}
        >
          {primaryColors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              style={{
                background: brandTokens.color?.surface || "#f5f5f5",
                borderRadius: brandTokens.radius?.lg || "12px",
                padding: brandTokens.spacing?.md || "16px",
                border: `1px solid ${color.hex}40`,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: color.hex,
                  marginBottom: brandTokens.spacing?.sm || "12px",
                }}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: brandTokens.color?.textPrimary || "#000",
                  marginBottom: brandTokens.spacing?.xs || "4px",
                }}
              >
                {color.name}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: brandTokens.color?.textSecondary || "#666",
                }}
              >
                {color.hex}
              </div>
            </div>
          ))}
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
        }}
      >
        <p style={{ margin: 0 }}>
          Generado con Brand Manual Generator · {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}
