"use client";

import { BrandTokens } from "@/lib/design-tokens/types";

interface TemplatePreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

interface TemplateData {
  type?: string;
  platform?: string;
  templates?: Array<{
    name?: string;
    title?: string;
    description?: string;
    image?: string;
    content?: string;
    dimensions?: string;
  }>;
  guidelines?: string;
}

function extractTemplateData(content: any): TemplateData {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      return { guidelines: content };
    }
  }

  if (content?.templates || content?.type || content?.platform) {
    return content;
  }

  return {};
}

function TemplateCard({
  template,
  brandTokens,
  index,
}: {
  template: any;
  brandTokens: BrandTokens;
  index: number;
}) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      style={{
        background: brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.lg || "12px",
        overflow: "hidden",
        border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = brandTokens.shadow?.lg || "0 10px 30px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {template.image && !imageError ? (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: brandTokens.color?.border || "#e5e5e5",
            position: "relative",
          }}
        >
          <img
            src={template.image}
            alt={template.name || template.title || `Template ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: `linear-gradient(135deg, ${brandTokens.color?.accent || "#000"} 0%, ${brandTokens.color?.surface || "#666"} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "24px",
            fontWeight: brandTokens.typography?.weightBold || "600",
          }}
        >
          {(template.name || template.title || "T")[0]}
        </div>
      )}
      <div style={{ padding: brandTokens.spacing?.md || "16px" }}>
        <h3
          style={{
            fontFamily: brandTokens.typography?.fontSans,
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            margin: `0 0 ${brandTokens.spacing?.xs || "4px"} 0`,
          }}
        >
          {template.name || template.title || `Template ${index + 1}`}
        </h3>
        {template.dimensions && (
          <div
            style={{
              fontSize: "11px",
              color: brandTokens.color?.textSecondary || "#888",
              marginBottom: brandTokens.spacing?.xs || "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {template.dimensions}
          </div>
        )}
        {template.description && (
          <p
            style={{
              fontSize: "12px",
              color: brandTokens.color?.textSecondary || "#666",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {template.description}
          </p>
        )}
      </div>
    </div>
  );
}

function SocialMediaPreview({
  platform,
  brandTokens,
  brandName,
}: {
  platform: string;
  brandTokens: BrandTokens;
  brandName: string;
}) {
  const platformColors: Record<string, { bg: string; accent: string }> = {
    instagram: { bg: "#ffffff", accent: "#E4405F" },
    facebook: { bg: "#ffffff", accent: "#1877F2" },
    twitter: { bg: "#ffffff", accent: "#000000" },
    linkedin: { bg: "#ffffff", accent: "#0A66C2" },
    tiktok: { bg: "#000000", accent: "#00F2EA" },
  };

  const colors = platformColors[platform.toLowerCase()] || {
    bg: brandTokens.color?.background || "#fff",
    accent: brandTokens.color?.accent || "#000",
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        background: colors.bg,
        borderRadius: brandTokens.radius?.lg || "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: brandTokens.spacing?.md || "16px",
          borderBottom: `1px solid ${colors.bg === "#000000" ? "#333" : "#e5e5e5"}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: brandTokens.spacing?.sm || "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: brandTokens.color?.accent || "#000",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                color: colors.bg === "#000000" ? "#fff" : "#000",
              }}
            >
              @{brandName?.toLowerCase().replace(/\s+/g, "") || "brand"}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: colors.bg === "#000000" ? "#888" : "#666",
              }}
            >
              {brandName || "Brand Name"}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          aspectRatio: "1",
          background: `linear-gradient(135deg, ${brandTokens.color?.accent || "#000"} 0%, ${brandTokens.color?.surface || "#666"} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: brandTokens.spacing?.lg || "24px",
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
              fontSize: "24px",
              fontWeight: brandTokens.typography?.weightBold || "600",
              color: "#fff",
              marginBottom: brandTokens.spacing?.sm || "12px",
            }}
          >
            {brandName || "Brand"}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Contenido de ejemplo para {platform}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: brandTokens.spacing?.md || "16px",
          display: "flex",
          gap: brandTokens.spacing?.lg || "24px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: colors.bg === "#000000" ? "#888" : "#666",
          }}
        >
          ❤️ Like
        </div>
        <div
          style={{
            fontSize: "12px",
            color: colors.bg === "#000000" ? "#888" : "#666",
          }}
        >
          💬 Comment
        </div>
        <div
          style={{
            fontSize: "12px",
            color: colors.bg === "#000000" ? "#888" : "#666",
          }}
        >
          ↗️ Share
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function TemplatePreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: TemplatePreviewProps) {
  const templateData = extractTemplateData(content);

  // Si hay templates específicos, mostrarlos
  if (templateData.templates && templateData.templates.length > 0) {
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

        {/* Platform Badge */}
        {templateData.platform && (
          <div style={{ marginBottom: brandTokens.spacing?.lg || "32px" }}>
            <span
              style={{
                padding: `${brandTokens.spacing?.xs || "8px"} ${brandTokens.spacing?.md || "16px"}`,
                background: brandTokens.color?.accent || "#000",
                color: "#fff",
                borderRadius: brandTokens.radius?.md || "8px",
                fontSize: "13px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                textTransform: "capitalize",
              }}
            >
              {templateData.platform}
            </span>
          </div>
        )}

        {/* Templates Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: brandTokens.spacing?.lg || "24px",
            marginBottom: brandTokens.spacing?.xl || "48px",
          }}
        >
          {templateData.templates.map((template, index) => (
            <TemplateCard
              key={index}
              template={template}
              brandTokens={brandTokens}
              index={index}
            />
          ))}
        </div>

        {/* Guidelines */}
        {templateData.guidelines && (
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
                {templateData.guidelines}
              </p>
            </div>
          </section>
        )}

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

  // Preview por defecto para templates de redes sociales
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

      {/* Social Media Previews */}
      <section>
        <h2
          style={{
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "18px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.lg || "24px",
          }}
        >
          Plantillas para Redes Sociales
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: brandTokens.spacing?.xl || "32px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                color: brandTokens.color?.textPrimary || "#000",
                marginBottom: brandTokens.spacing?.md || "16px",
              }}
            >
              Instagram / Facebook
            </div>
            <SocialMediaPreview platform="instagram" brandTokens={brandTokens} brandName={brandName} />
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                color: brandTokens.color?.textPrimary || "#000",
                marginBottom: brandTokens.spacing?.md || "16px",
              }}
            >
              Twitter / LinkedIn
            </div>
            <SocialMediaPreview platform="twitter" brandTokens={brandTokens} brandName={brandName} />
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: brandTokens.typography?.weightMedium || "500",
                color: brandTokens.color?.textPrimary || "#000",
                marginBottom: brandTokens.spacing?.md || "16px",
              }}
            >
              TikTok
            </div>
            <SocialMediaPreview platform="tiktok" brandTokens={brandTokens} brandName={brandName} />
          </div>
        </div>
      </section>

      {/* Format Specifications */}
      <section style={{ marginTop: brandTokens.spacing?.xl || "48px" }}>
        <h2
          style={{
            fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
            fontSize: "18px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.md || "16px",
          }}
        >
          Especificaciones de Formato
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: brandTokens.spacing?.md || "16px",
          }}
        >
          <div
            style={{
              background: brandTokens.color?.surface || "#f5f5f5",
              padding: brandTokens.spacing?.md || "16px",
              borderRadius: brandTokens.radius?.md || "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.xs || "4px",
              }}
            >
              Instagram Post
            </div>
            <div
              style={{
                fontSize: "14px",
                color: brandTokens.color?.textPrimary || "#000",
              }}
            >
              1080 x 1080 px
            </div>
          </div>
          <div
            style={{
              background: brandTokens.color?.surface || "#f5f5f5",
              padding: brandTokens.spacing?.md || "16px",
              borderRadius: brandTokens.radius?.md || "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.xs || "4px",
              }}
            >
              Instagram Story
            </div>
            <div
              style={{
                fontSize: "14px",
                color: brandTokens.color?.textPrimary || "#000",
              }}
            >
              1080 x 1920 px
            </div>
          </div>
          <div
            style={{
              background: brandTokens.color?.surface || "#f5f5f5",
              padding: brandTokens.spacing?.md || "16px",
              borderRadius: brandTokens.radius?.md || "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.xs || "4px",
              }}
            >
              Twitter Post
            </div>
            <div
              style={{
                fontSize: "14px",
                color: brandTokens.color?.textPrimary || "#000",
              }}
            >
              1200 x 675 px
            </div>
          </div>
          <div
            style={{
              background: brandTokens.color?.surface || "#f5f5f5",
              padding: brandTokens.spacing?.md || "16px",
              borderRadius: brandTokens.radius?.md || "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.xs || "4px",
              }}
            >
              LinkedIn Post
            </div>
            <div
              style={{
                fontSize: "14px",
                color: brandTokens.color?.textPrimary || "#000",
              }}
            >
              1200 x 627 px
            </div>
          </div>
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
