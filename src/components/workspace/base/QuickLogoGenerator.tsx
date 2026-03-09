"use client";

import React, { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Hospitality",
  "Education",
  "Food & Beverage",
] as const;

const LOGO_STYLE_OPTIONS = [
  "Minimalist",
  "Modern",
  "Luxury",
  "Playful",
  "Corporate",
  "Bold",
] as const;

const ICON_TYPE_OPTIONS = ["Abstract", "Geometric", "Symbolic", "Lettermark", "Badge"] as const;

const COLOR_PALETTES = [
  {
    id: "royal-blue",
    name: "Royal Blue",
    description: "Trust, clarity, confidence",
    colors: ["#1E3A8A", "#2563EB", "#93C5FD"] as const,
  },
  {
    id: "emerald-fresh",
    name: "Emerald Fresh",
    description: "Growth, sustainability, balance",
    colors: ["#065F46", "#10B981", "#A7F3D0"] as const,
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    description: "Energy, warmth, creativity",
    colors: ["#9A3412", "#F97316", "#FDBA74"] as const,
  },
  {
    id: "slate-mono",
    name: "Slate Mono",
    description: "Premium and neutral",
    colors: ["#111827", "#4B5563", "#D1D5DB"] as const,
  },
] as const;

type Industry = (typeof INDUSTRY_OPTIONS)[number];
type LogoStyle = (typeof LOGO_STYLE_OPTIONS)[number];
type IconType = (typeof ICON_TYPE_OPTIONS)[number];
type ColorPaletteId = (typeof COLOR_PALETTES)[number]["id"];

export interface QuickLogoFormValues {
  companyName: string;
  industry: Industry;
  logoStyle: LogoStyle;
  colorPalette: ColorPaletteId;
  iconType: IconType;
}

export interface QuickLogoSubmitPayload extends QuickLogoFormValues {
  palette: (typeof COLOR_PALETTES)[number];
}

export interface QuickLogoGeneratorProps {
  className?: string;
  disabled?: boolean;
  onGenerate?: (payload: QuickLogoSubmitPayload, result: QuickLogoGenerationResult) => Promise<void> | void;
}

interface FormErrors {
  companyName?: string;
}

interface GenerateLogoApiResponse {
  success: boolean;
  base64?: string;
  imageUrl?: string;
  variants?: {
    primary?: string;
    secondary?: string;
    monochrome?: string;
    icon?: string;
  };
  guidelines?: {
    clearSpace: number;
    minSizes: {
      print: number;
      screen: number;
      favicon: number;
    };
    allowedBackgrounds: string[];
    prohibitedBackgrounds: string[];
    usageExamples: Array<{
      title: string;
      isCorrect: boolean;
      description: string;
    }>;
  };
  error?: string;
}

type FlowStageKey = "input" | "generation" | "finalize";
type FlowStageStatus = "pending" | "in_progress" | "completed" | "error";

interface QuickLogoGenerationResult {
  imageSrc: string;
  generatedAt: string;
  variants?: GenerateLogoApiResponse["variants"];
  guidelines?: GenerateLogoApiResponse["guidelines"];
  rawResult: GenerateLogoApiResponse;
}

const FLOW_STAGES: ReadonlyArray<{
  key: FlowStageKey;
  label: string;
  description: string;
}> = [
  {
    key: "input",
    label: "Validación",
    description: "Validar parámetros del logo",
  },
  {
    key: "generation",
    label: "Generación",
    description: "Ejecutar solicitud a la API",
  },
  {
    key: "finalize",
    label: "Finalización",
    description: "Persistir y preparar descarga",
  },
];

const INITIAL_FLOW_STATE: Record<FlowStageKey, FlowStageStatus> = {
  input: "pending",
  generation: "pending",
  finalize: "pending",
};

const SMART_DEFAULTS: Omit<QuickLogoFormValues, "companyName"> = {
  industry: "Technology",
  logoStyle: "Minimalist",
  colorPalette: "royal-blue",
  iconType: "Symbolic",
};

const INITIAL_VALUES: QuickLogoFormValues = {
  companyName: "",
  ...SMART_DEFAULTS,
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

function validate(values: QuickLogoFormValues): FormErrors {
  const errors: FormErrors = {};
  const normalizedName = values.companyName.trim();

  if (!normalizedName) {
    errors.companyName = "Company Name is required.";
  } else if (normalizedName.length > 80) {
    errors.companyName = "Company Name must be 80 characters or less.";
  }

  return errors;
}

function normalizeImageSource(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) return trimmed;
  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Fallback when server returns raw base64 without data URL prefix.
  return `data:image/png;base64,${trimmed}`;
}

function mapStyleToTypographyAndTone(style: LogoStyle): {
  typography: "Serif" | "Sans-serif" | "Modern" | "Script" | "Bold" | "Light";
  tone: "Professional" | "Playful" | "Luxury" | "Minimalist" | "Bold" | "Elegant" | "Tech" | "Organic";
} {
  switch (style) {
    case "Minimalist":
      return { typography: "Modern", tone: "Minimalist" };
    case "Modern":
      return { typography: "Sans-serif", tone: "Tech" };
    case "Luxury":
      return { typography: "Serif", tone: "Luxury" };
    case "Playful":
      return { typography: "Script", tone: "Playful" };
    case "Corporate":
      return { typography: "Sans-serif", tone: "Professional" };
    case "Bold":
      return { typography: "Bold", tone: "Bold" };
    default:
      return { typography: "Modern", tone: "Professional" };
  }
}

function mapIconTypeToApiIconStyle(iconType: IconType): "abstract" | "geometric" | "typographic" | "symbolic" | "badge" {
  switch (iconType) {
    case "Abstract":
      return "abstract";
    case "Geometric":
      return "geometric";
    case "Symbolic":
      return "symbolic";
    case "Lettermark":
      return "typographic";
    case "Badge":
      return "badge";
    default:
      return "geometric";
  }
}

export default function QuickLogoGenerator({
  className = "",
  disabled = false,
  onGenerate,
}: QuickLogoGeneratorProps) {
  const [values, setValues] = useState<QuickLogoFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasHydratedDefaults, setHasHydratedDefaults] = useState(false);
  const [generatedImageSrc, setGeneratedImageSrc] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<Record<FlowStageKey, FlowStageStatus>>(INITIAL_FLOW_STATE);
  const stageInFlightRef = useRef<FlowStageKey>("input");

  useEffect(() => {
    if (hasHydratedDefaults) return;
    setValues((previous) => ({
      ...previous,
      ...SMART_DEFAULTS,
    }));
    setHasHydratedDefaults(true);
  }, [hasHydratedDefaults]);

  const selectedPalette = useMemo(
    () => COLOR_PALETTES.find((palette) => palette.id === values.colorPalette) ?? COLOR_PALETTES[0],
    [values.colorPalette],
  );

  const isLocked = disabled || isGenerating;

  function updateField<K extends keyof QuickLogoFormValues>(key: K, value: QuickLogoFormValues[K]) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function setStageStatus(stage: FlowStageKey, status: FlowStageStatus) {
    setFlowState((previous) => ({
      ...previous,
      [stage]: status,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setFlowState(INITIAL_FLOW_STATE);
    setStageStatus("input", "in_progress");
    stageInFlightRef.current = "input";

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStageStatus("input", "error");
      return;
    }

    const normalizedPayload: QuickLogoSubmitPayload = {
      ...values,
      companyName: values.companyName.trim(),
      palette: selectedPalette,
    };

    setIsGenerating(true);
    setGeneratedImageSrc(null);
    setStageStatus("input", "completed");
    setStageStatus("generation", "in_progress");
    stageInFlightRef.current = "generation";

    try {
      const { typography, tone } = mapStyleToTypographyAndTone(normalizedPayload.logoStyle);
      const iconStyle = mapIconTypeToApiIconStyle(normalizedPayload.iconType);

      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: normalizedPayload.companyName,
          industry: normalizedPayload.industry,
          primaryColor: normalizedPayload.palette.colors[0],
          secondaryColor: normalizedPayload.palette.colors[1],
          typography,
          tone,
          iconStyle,
          layout: "horizontal",
        }),
      });

      const result = (await response.json()) as GenerateLogoApiResponse;
      if (!response.ok || !result.success) {
        throw new Error(result.error || "The generation service returned an error.");
      }

      const rawSource = result.base64 || result.imageUrl;
      if (!rawSource) {
        throw new Error("Logo generation completed without image output.");
      }

      const imageSrc = normalizeImageSource(rawSource);
      const generationResult: QuickLogoGenerationResult = {
        imageSrc,
        generatedAt: new Date().toISOString(),
        variants: result.variants,
        guidelines: result.guidelines,
        rawResult: result,
      };

      setGeneratedImageSrc(imageSrc);
      setStageStatus("generation", "completed");
      setStageStatus("finalize", "in_progress");
      stageInFlightRef.current = "finalize";

      if (onGenerate) {
        await onGenerate(normalizedPayload, generationResult);
      }

      await sleep(300);
      setStageStatus("finalize", "completed");

      setStatusMessage(
        `Logo generated for ${normalizedPayload.companyName} using ${normalizedPayload.logoStyle} style and ${normalizedPayload.palette.name} palette.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start logo generation. Please try again.";
      setStageStatus(stageInFlightRef.current, "error");
      setStatusMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section
      className={[
        "w-full rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900 p-4 text-zinc-100 shadow-2xl sm:p-6",
        className.trim(),
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Quick Logo Generator"
    >
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Quick Logo Generator</p>
        <h2 className="text-xl font-semibold text-zinc-50 sm:text-2xl">Generate in one click</h2>
        <p className="text-sm text-zinc-400">
          Enter your company name. Everything else is pre-optimized and editable.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isGenerating}>
        <fieldset disabled={isLocked} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-zinc-200">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              aria-label="Company Name"
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={errors.companyName ? "companyName-error" : undefined}
              value={values.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
              placeholder="Acme Labs"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/35"
            />
            {errors.companyName && (
              <p id="companyName-error" role="alert" className="text-sm text-rose-400">
                {errors.companyName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium text-zinc-200">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                aria-label="Industry"
                value={values.industry}
                onChange={(event) => updateField("industry", event.target.value as Industry)}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/35"
              >
                {INDUSTRY_OPTIONS.map((industry) => (
                  <option key={industry} value={industry} className="bg-zinc-900">
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-200">Logo Style</p>
              <div role="radiogroup" aria-label="Logo Style" className="grid grid-cols-2 gap-2">
                {LOGO_STYLE_OPTIONS.map((style) => {
                  const isSelected = values.logoStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => updateField("logoStyle", style)}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        isSelected
                          ? "border-violet-400 bg-violet-500/20 text-violet-100"
                          : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-200">Color Palette</p>
            <div role="radiogroup" aria-label="Color Palette" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = values.colorPalette === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => updateField("colorPalette", palette.id)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-violet-400 bg-violet-500/15"
                        : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-zinc-100">{palette.name}</p>
                      {isSelected && (
                        <span className="rounded-full bg-violet-500/25 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-xs text-zinc-400">{palette.description}</p>
                    <div className="flex gap-2">
                      {palette.colors.map((color) => (
                        <span
                          key={color}
                          className="h-6 w-6 rounded-full border border-zinc-700"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-200">Icon Type</p>
            <div role="radiogroup" aria-label="Icon Type" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {ICON_TYPE_OPTIONS.map((icon) => {
                const isSelected = values.iconType === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => updateField("iconType", icon)}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      isSelected
                        ? "border-violet-400 bg-violet-500/20 text-violet-100"
                        : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 text-sm text-zinc-300">
          <p aria-live="polite">
            Ready setup:{" "}
            <span className="font-semibold text-zinc-100">
              {values.companyName.trim() || "Your Company"} · {values.industry} · {values.logoStyle} ·{" "}
              {selectedPalette.name} · {values.iconType}
            </span>
          </p>
        </div>

        <article
          className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3"
          aria-label="Estado del flujo de generación"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Flujo de generación</p>
          <ul className="space-y-2">
            {FLOW_STAGES.map((stage) => {
              const stageStatus = flowState[stage.key];
              const icon =
                stageStatus === "completed" ? (
                  <CheckCircle2 size={14} className="text-emerald-300" aria-hidden="true" />
                ) : stageStatus === "in_progress" ? (
                  <Loader2 size={14} className="animate-spin text-sky-300" aria-hidden="true" />
                ) : stageStatus === "error" ? (
                  <AlertTriangle size={14} className="text-rose-300" aria-hidden="true" />
                ) : (
                  <span className="inline-block h-2.5 w-2.5 rounded-full border border-zinc-600" aria-hidden="true" />
                );

              return (
                <li key={stage.key} className="flex items-start gap-2 rounded-lg border border-zinc-800/80 px-2 py-1.5 text-xs">
                  <span className="mt-0.5">{icon}</span>
                  <span className="flex-1 text-zinc-300">
                    <span className="font-medium text-zinc-100">{stage.label}</span> · {stage.description}
                  </span>
                  <span className="uppercase tracking-[0.08em] text-zinc-500">{stageStatus}</span>
                </li>
              );
            })}
          </ul>
        </article>

        <button
          type="submit"
          disabled={isLocked}
          aria-label="Generate logo"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isGenerating && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
          )}
          {isGenerating ? "Generating..." : "Generate Logo"}
        </button>

        {statusMessage && (
          <p
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-300"
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        )}

        {generatedImageSrc && (
          <article className="space-y-3 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
            <p className="text-sm font-semibold text-emerald-100">Generated Logo Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImageSrc}
              alt="Generated company logo"
              className="w-full rounded-xl border border-emerald-300/30 bg-white p-2 object-contain"
            />
            <a
              href={generatedImageSrc}
              download={`${values.companyName.trim() || "logo"}-generated.png`}
              className="inline-flex rounded-lg border border-emerald-300/50 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20"
            >
              Download Logo
            </a>
          </article>
        )}
      </form>
    </section>
  );
}
