"use client";

import { useState } from "react";
import { BrandTokens } from "@/lib/design-tokens/types";
import { Download, Maximize2, Check } from "lucide-react";

interface LogoPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

interface LogoVariant {
  name: string;
  url?: string;
  description?: string;
  format?: string;
  bgColor?: string;
}

function extractLogos(content: any): { primary?: string; variants?: LogoVariant[]; guidelines?: string } {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // Si es una URL de imagen
      if (content.startsWith("http") || content.startsWith("data:image")) {
        return { primary: content };
      }
    }
  }

  if (content?.primary || content?.variants || content?.guidelines) {
    return content;
  }

  if (content?.url) {
    return { primary: content.url, variants: [content] };
  }

  return {};
}

function LogoDisplay({
  url,
  name,
  brandTokens,
  bgColor,
  onDownload,
  brandName,
}: {
  url?: string;
  name: string;
  brandTokens: BrandTokens;
  bgColor?: string;
  onDownload?: () => void;
  brandName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        background: bgColor || brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.lg || "12px",
        padding: brandTokens.spacing?.xl || "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
        position: "relative",
      }}
    >
      {url && !imageError ? (
        <>
          <img
            src={url}
            alt={name}
            style={{
              maxWidth: "100%",
              maxHeight: "180px",
              objectFit: "contain",
            }}
            onError={() => setImageError(true)}
          />
          <div
            style={{
              position: "absolute",
              top: brandTokens.spacing?.sm || "12px",
              right: brandTokens.spacing?.sm || "12px",
              display: "flex",
              gap: brandTokens.spacing?.xs || "8px",
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                background: brandTokens.color?.background || "#fff",
                border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                borderRadius: brandTokens.radius?.sm || "4px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = brandTokens.color?.surface || "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = brandTokens.color?.background || "#fff";
              }}
            >
              {copied ? (
                <Check size={16} style={{ color: brandTokens.color?.accent || "#000" }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
            {onDownload && (
              <button
                onClick={onDownload}
                style={{
                  background: brandTokens.color?.background || "#fff",
                  border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                  borderRadius: brandTokens.radius?.sm || "4px",
                  padding: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Download size={16} />
              </button>
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: brandTokens.color?.textSecondary || "#888",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: brandTokens.spacing?.sm || "12px",
              opacity: 0.5,
            }}
          >
            {brandName?.charAt(0) || "?"}
          </div>
          <div style={{ fontSize: "14px" }}>
            {imageError ? "Error al cargar imagen" : "Logo no disponible"}
          </div>
        </div>
      )}
    </div>
  );
}

function UsageExample({
  title,
  good,
  bad,
  brandTokens,
  logoUrl,
}: {
  title: string;
  good: string;
  bad: string;
  brandTokens: BrandTokens;
  logoUrl?: string;
}) {
  return (
    <div
      style={{
        marginBottom: brandTokens.spacing?.lg || "32px",
      }}
    >
      <h4
        style={{
          fontFamily: brandTokens.typography?.fontSans,
          fontSize: "14px",
          fontWeight: brandTokens.typography?.weightMedium || "500",
          color: brandTokens.color?.textPrimary || "#000",
          marginBottom: brandTokens.spacing?.md || "16px",
        }}
      >
        {title}
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: brandTokens.spacing?.md || "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#10B981",
              marginBottom: brandTokens.spacing?.xs || "8px",
            }}
          >
            ✓ Recomendado
          </div>
          <div
            style={{
              background: good,
              padding: brandTokens.spacing?.lg || "32px",
              borderRadius: brandTokens.radius?.md || "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
              border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
            }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" style={{ maxHeight: "60px" }} />
            ) : (
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>Logo</span>
            )}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: brandTokens.color?.textSecondary || "#666",
              marginTop: brandTokens.spacing?.xs || "8px",
            }}
          >
            {good}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#EF4444",
              marginBottom: brandTokens.spacing?.xs || "8px",
            }}
          >
            ✗ Evitar
          </div>
          <div
            style={{
              background: bad,
              padding: brandTokens.spacing?.lg || "32px",
              borderRadius: brandTokens.radius?.md || "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
              border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
            }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" style={{ maxHeight: "60px", filter: "grayscale(100%)" }} />
            ) : (
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>Logo</span>
            )}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: brandTokens.color?.textSecondary || "#666",
              marginTop: brandTokens.spacing?.xs || "8px",
            }}
          >
            {bad}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LogoPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: LogoPreviewProps) {
  const logoData = extractLogos(content);

  const handleDownload = (url?: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `logo-${brandName.toLowerCase().replace(/\s+/g, "-")}`;
      link.click();
    }
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

      {/* Primary Logo */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "18px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Logo Principal
        </h2>
        <LogoDisplay
          url={logoData.primary}
          name={`${brandName} - Logo Principal`}
          brandTokens={brandTokens}
          bgColor="#ffffff"
          onDownload={() => handleDownload(logoData.primary)}
          brandName={brandName}
        />
      </section>

      {/* Logo Variants */}
      {logoData.variants && logoData.variants.length > 0 && (
        <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
          <h2
            style={{
              fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
              fontSize: "18px",
              fontWeight: brandTokens.typography?.weightMedium || "500",
              color: brandTokens.color?.textPrimary || "#000",
              marginBottom: brandTokens.spacing?.md || "16px",
            }}
          >
            Variantes del Logo
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: brandTokens.spacing?.md || "16px",
            }}
          >
            {logoData.variants.map((variant, index) => (
              <div key={index}>
                <LogoDisplay
                  url={variant.url}
                  name={variant.name}
                  brandTokens={brandTokens}
                  bgColor={variant.bgColor}
                  brandName={brandName}
                />
                {variant.description && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: brandTokens.color?.textSecondary || "#666",
                      marginTop: brandTokens.spacing?.sm || "12px",
                      textAlign: "center",
                    }}
                  >
                    {variant.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Usage Examples */}
      <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "18px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Uso del Logo
        </h2>

        <UsageExample
          title="Fondo de color"
          good={brandTokens.color?.accent || "#000000"}
          bad="#ffffff"
          brandTokens={brandTokens}
          logoUrl={logoData.primary}
        />

        <UsageExample
          title="Fondo claro"
          good="#ffffff"
          bad={brandTokens.color?.accent || "#000000"}
          brandTokens={brandTokens}
          logoUrl={logoData.primary}
        />

        <UsageExample
          title="Espacio mínimo"
          good="#ffffff"
          bad="#f0f0f0"
          brandTokens={brandTokens}
          logoUrl={logoData.primary}
        />
      </section>

      {/* Guidelines */}
      {logoData.guidelines && (
        <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
          <h2
            style={{
              fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
              fontSize: "18px",
              fontWeight: brandTokens.typography?.weightMedium || "500",
              color: brandTokens.color?.textPrimary || "#000",
              marginBottom: brandTokens.spacing?.md || "16px",
            }}
          >
            Directrices de Uso
          </h2>
          <div
            style={{
              background: brandTokens.color?.surface || "#f5f5f5",
              padding: brandTokens.spacing?.lg || "24px",
              borderRadius: brandTokens.radius?.md || "8px",
              lineHeight: 1.7,
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: brandTokens.color?.textSecondary || "#666",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {logoData.guidelines}
            </p>
          </div>
        </section>
      )}

      {/* Color Variations */}
      <section>
        <h2
          style={{
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "18px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Variaciones de Color
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: brandTokens.spacing?.md || "16px",
          }}
        >
          <LogoDisplay
            url={logoData.primary}
            name="Color completo"
            brandTokens={brandTokens}
            bgColor="#ffffff"
            brandName={brandName}
          />
          <LogoDisplay
            url={logoData.primary}
            name="Blanco y negro"
            brandTokens={brandTokens}
            bgColor="#ffffff"
            brandName={brandName}
          />
          <LogoDisplay
            url={logoData.primary}
            name="Monocromo"
            brandTokens={brandTokens}
            bgColor={brandTokens.color?.accent || "#000000"}
            brandName={brandName}
          />
          <LogoDisplay
            url={logoData.primary}
            name="Fondo oscuro"
            brandTokens={brandTokens}
            bgColor="#1a1a1a"
            brandName={brandName}
          />
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
