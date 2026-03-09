"use client";

import { BrandTokens } from "@/lib/design-tokens/types";

interface SystemPreviewProps {
  content: any;
  brandTokens: BrandTokens;
  moduleName: string;
  brandName: string;
}

interface SystemData {
  type?: string;
  items?: any[];
  description?: string;
  rules?: any[];
  examples?: any[];
}

function extractSystemData(content: any): SystemData {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      return { description: content };
    }
  }

  if (content?.type || content?.items || content?.rules || content?.examples) {
    return content;
  }

  return {};
}

function TokenCard({
  label,
  value,
  brandTokens,
  preview,
}: {
  label: string;
  value: string;
  brandTokens: BrandTokens;
  preview?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.md || "8px",
        padding: brandTokens.spacing?.md || "16px",
        border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
      }}
    >
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: brandTokens.color?.textSecondary || "#888",
          marginBottom: brandTokens.spacing?.xs || "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: brandTokens.typography?.fontMono || "monospace",
          fontSize: "12px",
          color: brandTokens.color?.accent || "#000",
          marginBottom: brandTokens.spacing?.sm || "12px",
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
      {preview && (
        <div
          style={{
            marginTop: brandTokens.spacing?.sm || "12px",
            paddingTop: brandTokens.spacing?.sm || "12px",
            borderTop: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
          }}
        >
          {preview}
        </div>
      )}
    </div>
  );
}

function RuleItem({
  rule,
  index,
  brandTokens,
}: {
  rule: any;
  index: number;
  brandTokens: BrandTokens;
}) {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        gap: brandTokens.spacing?.md || "16px",
        padding: brandTokens.spacing?.md || "16px",
        background: brandTokens.color?.surface || "#f5f5f5",
        borderRadius: brandTokens.radius?.md || "8px",
        marginBottom: brandTokens.spacing?.sm || "12px",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: brandTokens.color?.accent || "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: brandTokens.typography?.weightMedium || "500",
        }}
      >
        {index + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: brandTokens.typography?.weightMedium || "500",
            color: brandTokens.color?.textPrimary || "#000",
            marginBottom: brandTokens.spacing?.xs || "4px",
          }}
        >
          {rule.title || rule.name || `Regla ${index + 1}`}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: brandTokens.color?.textSecondary || "#666",
            lineHeight: 1.5,
          }}
        >
          {rule.description || rule.rule || rule.text || JSON.stringify(rule)}
        </div>
      </div>
    </div>
  );
}

export default function SystemPreview({
  content,
  brandTokens,
  moduleName,
  brandName,
}: SystemPreviewProps) {
  const systemData = extractSystemData(content);

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

      {/* Description */}
      {systemData.description && (
        <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: brandTokens.color?.textSecondary || "#666",
            }}
          >
            {systemData.description}
          </p>
        </section>
      )}

      {/* System Type */}
      {systemData.type && (
        <section style={{ marginBottom: brandTokens.spacing?.xl || "48px" }}>
          <div
            style={{
              display: "inline-block",
              padding: `${brandTokens.spacing?.xs || "8px"} ${brandTokens.spacing?.md || "16px"}`,
              background: brandTokens.color?.accent || "#000",
              color: "#fff",
              borderRadius: brandTokens.radius?.md || "8px",
              fontSize: "13px",
              fontWeight: brandTokens.typography?.weightMedium || "500",
            }}
          >
            {systemData.type}
          </div>
        </section>
      )}

      {/* Design Tokens Overview */}
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
          Tokens de Diseño
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: brandTokens.spacing?.md || "16px",
          }}
        >
          {/* Colors */}
          <TokenCard
            label="Color Primario"
            value={brandTokens.color?.accent || "#000000"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  background: brandTokens.color?.accent || "#000000",
                  borderRadius: brandTokens.radius?.sm || "4px",
                }}
              />
            }
          />
          <TokenCard
            label="Color Secundario"
            value={brandTokens.color?.surface || "#666666"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  background: brandTokens.color?.surface || "#666666",
                  borderRadius: brandTokens.radius?.sm || "4px",
                }}
              />
            }
          />
          <TokenCard
            label="Color de Acento"
            value={brandTokens.color?.accent || "#F5C518"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  background: brandTokens.color?.accent || "#F5C518",
                  borderRadius: brandTokens.radius?.sm || "4px",
                }}
              />
            }
          />

          {/* Typography */}
          <TokenCard
            label="Fuente Display"
            value={brandTokens.typography?.fontDisplay || "sans-serif"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  fontFamily: brandTokens.typography?.fontDisplay || "sans-serif",
                  fontSize: "18px",
                  fontWeight: brandTokens.typography?.weightBold || "600",
                  color: brandTokens.color?.textPrimary || "#000",
                }}
              >
                Aa Bb Cc
              </div>
            }
          />
          <TokenCard
            label="Fuente Body"
            value={brandTokens.typography?.fontSans || "sans-serif"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  fontFamily: brandTokens.typography?.fontSans || "sans-serif",
                  fontSize: "14px",
                  color: brandTokens.color?.textPrimary || "#000",
                }}
              >
                El veloz murciélago hindú
              </div>
            }
          />

          {/* Spacing */}
          <TokenCard
            label="Espaciado Base"
            value={`${brandTokens.spacing?.md || "16px"}`}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  height: brandTokens.spacing?.md || "16px",
                  background: brandTokens.color?.accent || "#000",
                  borderRadius: brandTokens.radius?.sm || "4px",
                }}
              />
            }
          />

          {/* Radius */}
          <TokenCard
            label="Border Radius"
            value={brandTokens.radius?.md || "8px"}
            brandTokens={brandTokens}
            preview={
              <div
                style={{
                  display: "flex",
                  gap: brandTokens.spacing?.xs || "8px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: brandTokens.color?.border || "#e5e5e5",
                    borderRadius: brandTokens.radius?.sm || "4px",
                  }}
                />
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: brandTokens.color?.border || "#e5e5e5",
                    borderRadius: brandTokens.radius?.md || "8px",
                  }}
                />
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: brandTokens.color?.border || "#e5e5e5",
                    borderRadius: brandTokens.radius?.lg || "12px",
                  }}
                />
              </div>
            }
          />
        </div>
      </section>

      {/* System Rules */}
      {(systemData.rules || systemData.items) && (
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
            Reglas del Sistema
          </h2>
          {(systemData.rules || systemData.items || []).map((rule: any, index: number) => (
            <RuleItem key={index} rule={rule} index={index} brandTokens={brandTokens} />
          ))}
        </section>
      )}

      {/* Examples */}
      {systemData.examples && systemData.examples.length > 0 && (
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
            Ejemplos de Aplicación
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: brandTokens.spacing?.md || "16px",
            }}
          >
            {systemData.examples.map((example: any, index: number) => (
              <div
                key={index}
                style={{
                  background: brandTokens.color?.surface || "#f5f5f5",
                  padding: brandTokens.spacing?.lg || "24px",
                  borderRadius: brandTokens.radius?.lg || "12px",
                  border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                }}
              >
                {typeof example === "string" ? (
                  <p
                    style={{
                      fontSize: "14px",
                      color: brandTokens.color?.textSecondary || "#666",
                      margin: 0,
                    }}
                  >
                    {example}
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: brandTokens.typography?.weightMedium || "500",
                        color: brandTokens.color?.textPrimary || "#000",
                        marginBottom: brandTokens.spacing?.xs || "8px",
                      }}
                    >
                      {example.title || example.name || `Ejemplo ${index + 1}`}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: brandTokens.color?.textSecondary || "#666",
                      }}
                    >
                      {example.description || example.text}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Component Examples */}
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
          Componentes del Sistema
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: brandTokens.spacing?.lg || "24px",
          }}
        >
          {/* Buttons */}
          <div>
            <div
              style={{
                fontSize: "12px",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.sm || "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Botones
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: brandTokens.spacing?.sm || "12px",
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: brandTokens.radius?.md || "8px",
                  border: "none",
                  background: brandTokens.color?.accent || "#000",
                  color: "#fff",
                  fontFamily: brandTokens.typography?.fontSans,
                  fontSize: "14px",
                  fontWeight: brandTokens.typography?.weightMedium || "500",
                  cursor: "pointer",
                }}
              >
                Botón Primario
              </button>
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: brandTokens.radius?.md || "8px",
                  border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                  background: "transparent",
                  color: brandTokens.color?.textPrimary || "#000",
                  fontFamily: brandTokens.typography?.fontSans,
                  fontSize: "14px",
                  fontWeight: brandTokens.typography?.weightMedium || "500",
                  cursor: "pointer",
                }}
              >
                Botón Secundario
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <div
              style={{
                fontSize: "12px",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.sm || "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Campos de entrada
            </div>
            <input
              type="text"
              placeholder="Escribe aquí..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: brandTokens.radius?.md || "8px",
                border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
                background: brandTokens.color?.background || "#fff",
                color: brandTokens.color?.textPrimary || "#000",
                fontFamily: brandTokens.typography?.fontSans,
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Cards */}
          <div>
            <div
              style={{
                fontSize: "12px",
                color: brandTokens.color?.textSecondary || "#888",
                marginBottom: brandTokens.spacing?.sm || "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Tarjetas
            </div>
            <div
              style={{
                padding: brandTokens.spacing?.md || "16px",
                background: brandTokens.color?.surface || "#f5f5f5",
                borderRadius: brandTokens.radius?.lg || "12px",
                border: `1px solid ${brandTokens.color?.border || "#e5e5e5"}`,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: brandTokens.color?.accent || "#000",
                  marginBottom: brandTokens.spacing?.sm || "12px",
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: brandTokens.typography?.weightMedium || "500",
                  color: brandTokens.color?.textPrimary || "#000",
                  marginBottom: brandTokens.spacing?.xs || "4px",
                }}
              >
                Título de tarjeta
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: brandTokens.color?.textSecondary || "#666",
                }}
              >
                Descripción breve
              </div>
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
