"use client";

import ReactMarkdown from "react-markdown";
import { BrandTokens } from "@/lib/design-tokens/types";

interface DefaultPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

function getContentString(content: any): string {
  if (typeof content === "string") {
    // Check if it's HTML
    if (content.trim().startsWith("<")) {
      return content;
    }
    // Check if it's JSON
    try {
      const parsed = JSON.parse(content);
      if (parsed.html) return parsed.html;
      if (parsed.content) return typeof parsed.content === "string" ? parsed.content : JSON.stringify(parsed.content);
      if (parsed.__payload) return typeof parsed.__payload === "string" ? parsed.__payload : JSON.stringify(parsed.__payload);
      // If it's a JSON object with a message or text field
      if (parsed.message) return parsed.message;
      if (parsed.text) return parsed.text;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  }

  if (content?.html) return content.html;
  if (content?.content) return typeof content.content === "string" ? content.content : JSON.stringify(content.content);
  if (content?.__payload) return typeof content.__payload === "string" ? content.__payload : JSON.stringify(content.__payload);
  if (content?.message) return content.message;
  if (content?.text) return content.text;

  return JSON.stringify(content, null, 2);
}

function isHtml(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith("<") && (trimmed.includes("</") || trimmed.endsWith(">"));
}

export default function DefaultPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: DefaultPreviewProps) {
  const contentString = getContentString(content);
  const isHtmlContent = isHtml(contentString);

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

      {/* Content */}
      <section>
        {isHtmlContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: contentString }}
            style={{
              lineHeight: brandTokens.typography?.lineHeightBody || "1.6",
            }}
          />
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: brandTokens.typography?.weightBold || "600",
                    letterSpacing: brandTokens.typography?.letterSpacingHeading || "-0.02em",
                    color: brandTokens.color?.textPrimary || "#000",
                    marginTop: brandTokens.spacing?.xl || "48px",
                    marginBottom: brandTokens.spacing?.lg || "24px",
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: brandTokens.typography?.weightMedium || "500",
                    letterSpacing: brandTokens.typography?.letterSpacingHeading || "-0.01em",
                    color: brandTokens.color?.textPrimary || "#000",
                    marginTop: brandTokens.spacing?.xl || "48px",
                    marginBottom: brandTokens.spacing?.md || "16px",
                    paddingBottom: brandTokens.spacing?.sm || "12px",
                    borderBottom: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontFamily: brandTokens.typography?.fontDisplay || brandTokens.typography?.fontSans,
                    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                    fontWeight: brandTokens.typography?.weightMedium || "500",
                    color: brandTokens.color?.textPrimary || "#000",
                    marginTop: brandTokens.spacing?.lg || "32px",
                    marginBottom: brandTokens.spacing?.sm || "12px",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  style={{
                    fontFamily: brandTokens.typography?.fontSans,
                    fontSize: "16px",
                    lineHeight: brandTokens.typography?.lineHeightBody || "1.6",
                    color: brandTokens.color?.textSecondary || "#333",
                    marginBottom: brandTokens.spacing?.md || "16px",
                  }}
                >
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong
                  style={{
                    color: brandTokens.color?.accent || "#000",
                    fontWeight: brandTokens.typography?.weightBold || "600",
                  }}
                >
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em>{children}</em>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  style={{
                    color: brandTokens.color?.accent || "#0066cc",
                    textDecoration: "underline",
                  }}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul
                  style={{
                    marginBottom: brandTokens.spacing?.md || "16px",
                    paddingLeft: brandTokens.spacing?.lg || "28px",
                  }}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  style={{
                    marginBottom: brandTokens.spacing?.md || "16px",
                    paddingLeft: brandTokens.spacing?.lg || "28px",
                  }}
                >
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li
                  style={{
                    marginBottom: brandTokens.spacing?.xs || "8px",
                    color: brandTokens.color?.textSecondary || "#333",
                  }}
                >
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: `4px solid ${brandTokens.color?.accent || "#000"}`,
                    paddingLeft: brandTokens.spacing?.md || "16px",
                    margin: `${brandTokens.spacing?.md || "16px"} 0`,
                    fontStyle: "italic",
                    color: brandTokens.color?.textSecondary || "#666",
                  }}
                >
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code
                  style={{
                    fontFamily: brandTokens.typography?.fontMono || "monospace",
                    background: brandTokens.color?.surfaceMuted || "#f5f5f5",
                    padding: "2px 6px",
                    borderRadius: brandTokens.radius?.sm || "4px",
                    fontSize: "0.9em",
                  }}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre
                  style={{
                    background: brandTokens.color?.surface || "#f5f5f5",
                    padding: brandTokens.spacing?.md || "16px",
                    borderRadius: brandTokens.radius?.md || "8px",
                    overflowX: "auto",
                    marginBottom: brandTokens.spacing?.md || "16px",
                  }}
                >
                  {children}
                </pre>
              ),
            }}
          >
            {contentString}
          </ReactMarkdown>
        )}
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
