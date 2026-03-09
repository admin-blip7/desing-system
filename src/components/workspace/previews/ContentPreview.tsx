"use client";

import ReactMarkdown from "react-markdown";
import { BrandTokens } from "@/lib/design-tokens/types";

interface ContentPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

// Helper para extraer el contenido string
function getContentString(content: any): string {
  if (typeof content === "string") {
    return content;
  }
  if (content?.html) {
    return content.html;
  }
  if (content?.content) {
    return typeof content.content === "string"
      ? content.content
      : JSON.stringify(content.content, null, 2);
  }
  if (content?.__payload) {
    return typeof content.__payload === "string"
      ? content.__payload
      : JSON.stringify(content.__payload, null, 2);
  }
  return "";
}

export default function ContentPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: ContentPreviewProps) {
  const contentString = getContentString(content);

  // Helper to get color with fallback
  const getColor = (color: string | undefined, fallback: string) => color || fallback;
  const getTypography = (prop: string | undefined, fallback: string) => prop || fallback;

  // Estilos base aplicando tokens de la marca
  const containerStyle: React.CSSProperties = {
    fontFamily: brandTokens.typography?.fontSans || "var(--bm-font-sans, -apple-system, system-ui, sans-serif)",
    backgroundColor: brandTokens.color?.background || "#fff",
    color: brandTokens.color?.textPrimary || "#000",
    padding: brandTokens.spacing?.xl || "48px",
    minHeight: "600px",
    lineHeight: 1.6,
  };

  // Estilos para el markdown
  const markdownStyle = `
    .prose h1 {
      font-family: ${brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans};
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: ${brandTokens.typography?.weightBold || "600"};
      letter-spacing: ${brandTokens.typography?.letterSpacingHeading || "-0.02em"};
      line-height: ${brandTokens.typography?.lineHeightHeading || "1.2"};
      color: ${brandTokens.color?.textPrimary || "#000"};
      margin-bottom: ${brandTokens.spacing?.lg || "32px"};
      margin-top: 0;
    }

    .prose h2 {
      font-family: ${brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans};
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: ${brandTokens.typography?.weightMedium || "500"};
      letter-spacing: ${brandTokens.typography?.letterSpacingHeading || "-0.01em"};
      line-height: ${brandTokens.typography?.lineHeightHeading || "1.3"};
      color: ${brandTokens.color?.textPrimary || "#000"};
      margin-top: ${brandTokens.spacing?.xl || "48px"};
      margin-bottom: ${brandTokens.spacing?.md || "24px"};
      padding-bottom: ${brandTokens.spacing?.sm || "12px"};
      border-bottom: 1px solid ${brandTokens.color?.border || "#e5e5e5"};
    }

    .prose h3 {
      font-family: ${brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans};
      font-size: clamp(1.25rem, 3vw, 1.5rem);
      font-weight: ${brandTokens.typography?.weightMedium || "500"};
      color: ${brandTokens.color?.textPrimary || "#000"};
      margin-top: ${brandTokens.spacing?.lg || "32px"};
      margin-bottom: ${brandTokens.spacing?.sm || "16px"};
    }

    .prose p {
      font-family: ${brandTokens.typography?.fontSans || "var(--bm-font-sans)"};
      font-size: 16px;
      line-height: ${brandTokens.typography?.lineHeightBody || "1.6"};
      color: ${brandTokens.color?.textSecondary || "#333"};
      margin-bottom: ${brandTokens.spacing?.md || "24px"};
    }

    .prose strong {
      color: ${brandTokens.color?.accent || "#000"};
      font-weight: ${brandTokens.typography?.weightBold || "600"};
    }

    .prose em {
      font-style: italic;
    }

    .prose a {
      color: ${brandTokens.color?.accent || "#0066cc"};
      text-decoration: underline;
    }

    .prose ul, .prose ol {
      margin-bottom: ${brandTokens.spacing?.md || "24px"};
      padding-left: ${brandTokens.spacing?.lg || "28px"};
    }

    .prose li {
      margin-bottom: ${brandTokens.spacing?.xs || "8px"};
      color: ${brandTokens.color?.textSecondary || "#333"};
    }

    .prose blockquote {
      border-left: 4px solid ${brandTokens.color?.accent || "#000"};
      padding-left: ${brandTokens.spacing?.md || "24px"};
      margin: ${brandTokens.spacing?.md || "24px"} 0;
      font-style: italic;
      color: ${brandTokens.color?.textSecondary || "#666"};
    }

    .prose code {
      font-family: ${brandTokens.typography?.fontMono || "monospace"};
      background: ${brandTokens.color?.surfaceMuted || "#f5f5f5"};
      padding: "2px 6px";
      borderRadius: ${brandTokens.radius?.sm || "4px"};
      font-size: 0.9em;
    }

    .prose pre {
      background: ${brandTokens.color?.surface || "#f5f5f5"};
      padding: ${brandTokens.spacing?.md || "24px"};
      border-radius: ${brandTokens.radius?.md || "8px"};
      overflow-x: auto;
      margin-bottom: ${brandTokens.spacing?.md || "24px"};
    }

    .prose pre code {
      background: transparent;
      padding: 0;
    }

    .prose table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: ${brandTokens.spacing?.md || "24px"};
    }

    .prose th, .prose td {
      padding: ${brandTokens.spacing?.sm || "12px"} ${brandTokens.spacing?.xs || "8px"};
      text-align: left;
      border-bottom: 1px solid ${brandTokens.color?.border || "#e5e5e5"};
    }

    .prose th {
      font-weight: ${brandTokens.typography?.weightMedium || "500"};
      color: ${brandTokens.color?.textPrimary || "#000"};
    }
  `;

  return (
    <div style={containerStyle}>
      {/* Header del Preview con nombre de marca */}
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

      {/* Contenido Markdown con estilos */}
      <div className="prose">
        <style>{markdownStyle}</style>
        <ReactMarkdown>{contentString}</ReactMarkdown>
      </div>

      {/* Footer del Preview */}
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
