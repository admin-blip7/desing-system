"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { roadmapPhases, RoadmapPhase } from "@/lib/data/roadmap-phases";
import { useBrandTokens } from "@/lib/hooks/useBrandTokens";
import type { BrandTokens } from "@/lib/design-tokens/types";

interface ModuleData {
  status: "locked" | "pending" | "generating" | "completed" | "error";
  content?: unknown;
}

interface BrandManualRoadmapProps {
  brandId: string;
  brandName: string;
  selectedIdentity: string;
  initialData?: Record<string, ModuleData>;
}

type ViewMode = "roadmap" | "audit" | "all";
type ColorTokenKey = keyof BrandTokens["color"];
type ColorViewMode = "primary" | "all";

const primaryColorKeys: ColorTokenKey[] = [
  "accent",
  "background",
  "textPrimary",
];

const editableColorKeys: ColorTokenKey[] = [
  "accent",
  "background",
  "surface",
  "surfaceMuted",
  "textPrimary",
  "textSecondary",
  "border",
  "borderStrong",
  "focus",
  "success",
  "warning",
  "danger",
];

const isValidHexColor = (value: string): boolean =>
  /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim());

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.trim().replace("#", "");
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : sanitized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function PhaseTimeline({
  phases,
  activePhase,
  setActivePhase,
}: {
  phases: RoadmapPhase[];
  activePhase: number;
  setActivePhase: (id: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "2px",
        padding: "0 40px",
        background: "#050505",
        borderBottom: "1px solid #141414",
      }}
    >
      {phases.map((p) => {
        const isActive = activePhase === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setActivePhase(p.id)}
            style={{
              flex: 1,
              padding: "14px 8px 12px",
              border: "none",
              cursor: "pointer",
              background: isActive ? "#0D0D0D" : "transparent",
              borderBottom: `2px solid ${isActive ? p.color : "transparent"}`,
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: isActive ? p.color : "#333",
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {p.phase}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: isActive ? "#aaa" : "#444",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Status indicator component
function StatusIndicator({ status }: { status: string }) {
  const statusConfig = {
    completed: { color: "#10B981", label: "Completado" },
    generating: { color: "#F5C518", label: "Generando..." },
    pending: { color: "#666", label: "Pendiente" },
    locked: { color: "#444", label: "Bloqueado" },
    error: { color: "#EF4444", label: "Error" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "9px",
        padding: "2px 6px",
        borderRadius: "3px",
        background: `${config.color}20`,
        color: config.color,
        fontWeight: 600,
        letterSpacing: "0.1em",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: config.color,
        }}
      />
      {config.label}
    </div>
  );
}

export default function BrandManualRoadmap({
  brandId,
  brandName,
  selectedIdentity,
  initialData = {},
}: BrandManualRoadmapProps) {
  const [activePhase, setActivePhase] = useState(1);
  const [view, setView] = useState<ViewMode>("roadmap");
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [colorViewMode, setColorViewMode] = useState<ColorViewMode>("primary");
  const { brandTokens, saveTokens } = useBrandTokens(brandId);
  const [colorOverrides, setColorOverrides] = useState<
    Partial<Record<ColorTokenKey, string>>
  >({});

  const currentPhase = roadmapPhases.find((p) => p.id === activePhase);

  // Calculate stats based on actual data
  const stats = useMemo(() => {
    const totalModules = roadmapPhases.reduce(
      (acc, p) => acc + p.modules.length,
      0
    );
    const newModules = roadmapPhases.reduce(
      (acc, p) => acc + p.modules.filter((m) => m.isNew).length,
      0
    );
    const originalModules = totalModules - newModules;

    // Count completed modules
    const completedCount = Object.values(initialData).filter(
      (m) => m.status === "completed"
    ).length;

    return {
      totalModules,
      newModules,
      originalModules,
      completedCount,
    };
  }, [initialData]);

  const filteredModules = currentPhase
    ? showOnlyNew
      ? currentPhase.modules.filter((m) => m.isNew)
      : currentPhase.modules
    : [];

  // Get module status helper
  const getModuleStatus = (moduleKey: string): string => {
    return initialData[moduleKey]?.status || "pending";
  };

  const handleColorTextChange = (key: ColorTokenKey, value: string) => {
    setColorOverrides((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleColorPickerChange = (key: ColorTokenKey, value: string) => {
    setColorOverrides((prev) => ({
      ...prev,
      [key]: value.toUpperCase(),
    }));
  };

  const getColorDraftValue = (key: ColorTokenKey): string =>
    colorOverrides[key] ?? brandTokens.color[key];

  const handleSaveBrandColors = async () => {
    if (isSavingColors) return;

    const hasInvalidColor = editableColorKeys.some(
      (key) => !isValidHexColor(getColorDraftValue(key))
    );

    if (hasInvalidColor) return;

    setIsSavingColors(true);
    const accent = getColorDraftValue("accent");
    const mergedColorUpdates = editableColorKeys.reduce(
      (acc, key) => {
        acc[key] = getColorDraftValue(key);
        return acc;
      },
      {} as Record<ColorTokenKey, string>
    );

    const updatedTokens: BrandTokens = {
      ...brandTokens,
      color: {
        ...brandTokens.color,
        ...mergedColorUpdates,
        accentMuted: isValidHexColor(accent)
          ? hexToRgba(accent, 0.2)
          : brandTokens.color.accentMuted,
      },
    };

    const ok = await saveTokens(updatedTokens);
    if (ok) {
      setColorOverrides({});
    }
    setIsSavingColors(false);
  };

  const hasInvalidColor = editableColorKeys.some(
    (key) => !isValidHexColor(getColorDraftValue(key))
  );
  const displayedColorKeys =
    colorViewMode === "primary" ? primaryColorKeys : editableColorKeys;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#E5E5E5",
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #141414",
          padding: "28px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: "#444",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Brand Manual Generator App
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 200,
                letterSpacing: "-0.03em",
                color: "#fff",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {brandName}
              <span
                style={{
                  fontSize: "13px",
                  color: "#F5C518",
                  fontWeight: 500,
                  marginLeft: 12,
                  verticalAlign: "middle",
                }}
              >
                {selectedIdentity}
              </span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {(
              [
                { key: "roadmap" as ViewMode, label: "Roadmap" },
                { key: "audit" as ViewMode, label: "Auditoría" },
                { key: "all" as ViewMode, label: "Todos" },
              ]
            ).map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 5,
                  border: "1px solid",
                  borderColor: view === v.key ? "#F5C518" : "#1A1A1A",
                  background:
                    view === v.key ? "#F5C51810" : "transparent",
                  color: view === v.key ? "#F5C518" : "#555",
                  fontSize: "11px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "28px", marginTop: "20px" }}>
          {[
            { label: "Fases", value: roadmapPhases.length, color: "#fff" },
            { label: "Módulos Total", value: stats.totalModules, color: "#fff" },
            {
              label: "Originales",
              value: stats.originalModules,
              color: "#888",
            },
            { label: "Nuevos", value: stats.newModules, color: "#F5C518" },
            { label: "Completados", value: stats.completedCount, color: "#10B981" },
            { label: "Semanas", value: "28", color: "#fff" },
          ].map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 300,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Brand Colors */}
        <div
          style={{
            marginTop: 22,
            padding: 16,
            borderRadius: 8,
            border: "1px solid #1A1A1A",
            background: "#0D0D0D",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: "#F5C518",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Colores de Marca
                </div>
                <div style={{ fontSize: "11px", color: "#666", marginTop: 4 }}>
                  {colorViewMode === "primary"
                    ? "Mostrando 3 principales."
                    : "Mostrando paleta completa."}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  border: "1px solid #1E1E1E",
                  borderRadius: 6,
                  padding: 3,
                  background: "#090909",
                }}
              >
                {[
                  { key: "primary" as ColorViewMode, label: "Principales" },
                  { key: "all" as ColorViewMode, label: "Todos" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setColorViewMode(tab.key)}
                    style={{
                      padding: "5px 9px",
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor:
                        colorViewMode === tab.key ? "#F5C518" : "transparent",
                      background:
                        colorViewMode === tab.key ? "#F5C51815" : "transparent",
                      color: colorViewMode === tab.key ? "#F5C518" : "#666",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveBrandColors}
              disabled={isSavingColors || hasInvalidColor}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor:
                  isSavingColors || hasInvalidColor ? "#2A2A2A" : "#F5C518",
                background:
                  isSavingColors || hasInvalidColor ? "#151515" : "#F5C51815",
                color:
                  isSavingColors || hasInvalidColor ? "#555" : "#F5C518",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor:
                  isSavingColors || hasInvalidColor ? "not-allowed" : "pointer",
              }}
            >
              {isSavingColors ? "Guardando..." : "Guardar colores"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 10,
            }}
          >
            {displayedColorKeys.map((key) => {
              const value = getColorDraftValue(key);
              const isValid = isValidHexColor(value);

              return (
                <div
                  key={key}
                  style={{
                    border: "1px solid #1A1A1A",
                    background: "#0A0A0A",
                    borderRadius: 6,
                    padding: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    {key}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        border: "1px solid #2A2A2A",
                        background: isValid ? value : "#111111",
                      }}
                    />
                    <input
                      type="color"
                      value={isValid ? value : "#000000"}
                      onChange={(event) =>
                        handleColorPickerChange(key, event.target.value)
                      }
                      style={{
                        width: 30,
                        height: 22,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(event) =>
                        handleColorTextChange(key, event.target.value)
                      }
                      placeholder="#FFFFFF"
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 5,
                        border: `1px solid ${isValid ? "#27272A" : "#EF4444"}`,
                        background: "#111111",
                        color: "#E5E5E5",
                        fontSize: "11px",
                        padding: "0 8px",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {hasInvalidColor && (
            <div
              style={{
                marginTop: 10,
                fontSize: "11px",
                color: "#EF4444",
              }}
            >
              Corrige los colores inválidos. Formato permitido: #RGB o #RRGGBB.
            </div>
          )}
        </div>
      </div>

      {/* Phase Timeline */}
      <PhaseTimeline
        phases={roadmapPhases}
        activePhase={activePhase}
        setActivePhase={setActivePhase}
      />

      {/* Roadmap View */}
      {view === "roadmap" && currentPhase && (
        <div style={{ padding: "28px 40px" }}>
          {/* Phase Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: currentPhase.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: currentPhase.color,
                    fontWeight: 600,
                  }}
                >
                  {currentPhase.phase} — {currentPhase.weeks}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    padding: "2px 8px",
                    borderRadius: 3,
                    background: currentPhase.color + "15",
                    color: currentPhase.color,
                  }}
                >
                  {currentPhase.modules.length} módulos ·{" "}
                  {currentPhase.modules.filter((m) => m.isNew).length} nuevos
                </span>
              </div>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 300,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {currentPhase.title}
              </h2>
              <p style={{ color: "#444", fontSize: "12px", marginTop: 4 }}>
                {currentPhase.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowOnlyNew(!showOnlyNew)}
              style={{
                padding: "6px 12px",
                borderRadius: 5,
                border: "1px solid",
                borderColor: showOnlyNew ? "#F5C518" : "#1A1A1A",
                background: showOnlyNew ? "#F5C51815" : "transparent",
                color: showOnlyNew ? "#F5C518" : "#555",
                fontSize: "10px",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              {showOnlyNew ? "✦ Solo nuevos" : "Mostrar todos"}
            </button>
          </div>

          {/* Module Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "12px",
            }}
          >
            {filteredModules.map((m, i) => {
              const status = getModuleStatus(m.key);
              const moduleIndex = currentPhase.modules.indexOf(m) + 1;

              return (
                <Link
                  key={i}
                  href={`/dashboard/brands/${brandId}/modules/${m.key}`}
                  style={{
                    background: "#0F0F0F",
                    borderRadius: 8,
                    padding: 20,
                    border: `1px solid ${
                      m.isNew ? currentPhase.color + "30" : "#151515"
                    }`,
                    transition: "all 0.2s",
                    position: "relative",
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      currentPhase.color + "50";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = m.isNew
                      ? currentPhase.color + "30"
                      : "#151515";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {m.isNew && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontSize: "8px",
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: "#F5C51820",
                        color: "#F5C518",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                      }}
                    >
                      NUEVO
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                    }}
                  >
                    <StatusIndicator status={status} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: 10,
                      marginTop: 20,
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: 5,
                        background: currentPhase.color + "12",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: currentPhase.color,
                      }}
                    >
                      {String(moduleIndex).padStart(2, "0")}
                    </div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#fff",
                        margin: 0,
                      }}
                    >
                      {m.name}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      lineHeight: 1.65,
                      margin: "0 0 10px",
                    }}
                  >
                    {m.desc}
                  </p>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#333",
                      fontFamily: "monospace",
                      padding: "3px 6px",
                      background: "#080808",
                      borderRadius: 3,
                      display: "inline-block",
                    }}
                  >
                    → {m.output}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Audit View */}
      {view === "audit" && (
        <div style={{ padding: "28px 40px", maxWidth: 900 }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 300,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            Auditoría: ¿Qué se agregó y por qué?
          </h2>
          <p style={{ color: "#444", fontSize: "12px", marginBottom: 28 }}>
            {stats.newModules} módulos nuevos identificados comparando contra
            manuales de Apple, Google, NASA, Mailchimp, Netflix, IBM y Airbus
          </p>

          {roadmapPhases.map((p) => {
            const newOnes = p.modules.filter((m) => m.isNew);
            if (newOnes.length === 0) return null;
            return (
              <div key={p.id} style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: p.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      color: p.color,
                      fontWeight: 600,
                    }}
                  >
                    {p.phase}
                  </span>
                  <span style={{ fontSize: "13px", color: "#ccc" }}>
                    {p.title}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: "#F5C51815",
                      color: "#F5C518",
                      marginLeft: 8,
                    }}
                  >
                    +{newOnes.length}
                  </span>
                </div>
                {newOnes.map((m, i) => {
                  const status = getModuleStatus(m.key);
                  return (
                    <Link
                      key={i}
                      href={`/dashboard/brands/${brandId}/modules/${m.key}`}
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "12px 16px",
                        background: i % 2 === 0 ? "#0D0D0D" : "transparent",
                        borderRadius: 6,
                        marginBottom: 2,
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <div style={{ minWidth: 180 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#ddd",
                            fontWeight: 500,
                          }}
                        >
                          {m.name}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#555",
                          lineHeight: 1.6,
                          flex: 1,
                        }}
                      >
                        {m.desc}
                      </div>
                      <StatusIndicator status={status} />
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Why section */}
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: "#0D0D0D",
              borderRadius: 8,
              border: "1px solid #1A1A1A",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#F5C518",
                margin: "0 0 12px",
              }}
            >
              ¿Por qué estos módulos son críticos?
            </h3>
            {[
              {
                area: "Fotografía & Ilustración",
                why: "Sin dirección visual, cada diseñador interpreta diferente. Apple y Airbus lo documentan exhaustivamente.",
              },
              {
                area: "Motion & Audio",
                why: "Spotify, Google y Netflix definen cómo se mueve y suena la marca. Es lo que separa una marca amateur de una profesional.",
              },
              {
                area: "Voice & Tone",
                why: "Mailchimp es famoso por su matriz de tono por canal. Sin esto, la marca habla diferente en cada punto de contacto.",
              },
              {
                area: "Customer Personas",
                why: "Todo diseño responde a alguien. Sin personas definidas, diseñas para nadie.",
              },
              {
                area: "Design Tokens",
                why: "Spacing, shadows, radii — son la infraestructura invisible que hace consistente al sistema.",
              },
              {
                area: "Print Guidelines",
                why: "Sin CMYK/Pantone la marca se ve diferente en cada imprenta. Error muy común en PyMEs.",
              },
              {
                area: "Co-branding",
                why: "Netflix y Instacart definen cómo aparecen junto a otros. Crítico cuando creces.",
              },
              {
                area: "Brand Audit",
                why: "El manual no sirve si nadie verifica que se cumpla. El checklist automático lo resuelve.",
              },
              {
                area: "Employee Onboarding",
                why: "IBM y Airbus capacitan a cada empleado nuevo en marca. Sin esto, solo marketing la entiende.",
              },
              {
                area: "Asset Library",
                why: "Bang & Olufsen y Cash App tienen centros de descarga. Si los assets no son fáciles de encontrar, nadie los usa.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: i < 9 ? "1px solid #141414" : "none",
                }}
              >
                <div
                  style={{
                    minWidth: 180,
                    fontSize: "12px",
                    color: "#aaa",
                    fontWeight: 500,
                  }}
                >
                  {item.area}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All View */}
      {view === "all" && (
        <div style={{ padding: "28px 40px" }}>
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              Mapa completo — {stats.totalModules} módulos
            </h2>
            <p style={{ color: "#444", fontSize: "12px" }}>
              {roadmapPhases.length} fases · 28 semanas · {stats.newModules}{" "}
              nuevos
            </p>
          </div>
          {roadmapPhases.map((p) => (
            <div key={p.id} style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: p.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: p.color,
                    fontWeight: 600,
                  }}
                >
                  {p.phase}
                </span>
                <span style={{ fontSize: "13px", color: "#ddd" }}>
                  {p.title}
                </span>
                <span style={{ fontSize: "10px", color: "#333" }}>
                  · {p.weeks} · {p.modules.length} módulos
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "6px",
                }}
              >
                {p.modules.map((m, i) => {
                  const status = getModuleStatus(m.key);
                  return (
                    <Link
                      key={i}
                      href={`/dashboard/brands/${brandId}/modules/${m.key}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#0D0D0D",
                        borderRadius: 5,
                        padding: "8px 12px",
                        border: `1px solid ${
                          m.isNew ? p.color + "20" : "#131313"
                        }`,
                        fontSize: "12px",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ color: "#ccc" }}>{m.name}</span>
                        {m.isNew && (
                          <span
                            style={{
                              fontSize: "7px",
                              padding: "1px 4px",
                              borderRadius: 2,
                              background: "#F5C51820",
                              color: "#F5C518",
                              fontWeight: 700,
                            }}
                          >
                            NEW
                          </span>
                        )}
                        <StatusIndicator status={status} />
                      </div>
                      <span
                        style={{
                          fontSize: "9px",
                          color: "#333",
                          fontFamily: "monospace",
                        }}
                      >
                        {m.output.split(".").pop() || "app"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
