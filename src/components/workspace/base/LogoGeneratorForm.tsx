"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type GenerationMode = "svg" | "ai";
type TypographyStyle = "Serif" | "Sans-serif" | "Modern" | "Script" | "Bold" | "Light";
type LogoTone =
  | "Professional"
  | "Playful"
  | "Luxury"
  | "Minimalist"
  | "Bold"
  | "Elegant"
  | "Tech"
  | "Organic";
type IconStyle = "abstract" | "geometric" | "typographic" | "symbolic" | "badge";

export interface ActiveBrand {
  id: string;
  name: string;
  slogan?: string;
  industry?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  preferences: {
    generationMode?: GenerationMode;
    typographyStyle?: TypographyStyle;
    logoTone?: LogoTone;
    iconStyle?: IconStyle;
  };
}

export interface UseActiveBrandResult {
  activeBrand: ActiveBrand | null;
  isLoading: boolean;
  error: string | null;
}

const ActiveBrandContext = createContext<UseActiveBrandResult | null>(null);

export interface ActiveBrandProviderProps {
  children: ReactNode;
  value: UseActiveBrandResult;
}

export function ActiveBrandProvider({ children, value }: ActiveBrandProviderProps) {
  return <ActiveBrandContext.Provider value={value}>{children}</ActiveBrandContext.Provider>;
}

const MOCK_ACTIVE_BRAND: ActiveBrand = {
  id: "brand_mock_001",
  name: "Norte Labs",
  slogan: "Construimos marcas que escalan",
  industry: "Tecnología",
  colors: {
    primary: "#f5c518",
    secondary: "rgba(21, 25, 36, 0.85)",
  },
  preferences: {
    generationMode: "svg",
    typographyStyle: "Modern",
    logoTone: "Tech",
    iconStyle: "geometric",
  },
};

export function useActiveBrand(): UseActiveBrandResult {
  const contextValue = useContext(ActiveBrandContext);
  const [state, setState] = useState<UseActiveBrandResult>({
    activeBrand: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (contextValue) return;

    const timeoutId = window.setTimeout(() => {
      setState({
        activeBrand: MOCK_ACTIVE_BRAND,
        isLoading: false,
        error: null,
      });
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [contextValue]);

  return contextValue ?? state;
}

export interface LogoGeneratorFormValues {
  brandName: string;
  slogan: string;
  generationMode: GenerationMode;
  typographyStyle: TypographyStyle;
  logoTone: LogoTone;
  iconStyle: IconStyle;
  industry: string;
  brandColors: {
    primary: string;
    secondary: string;
  };
}

export interface LogoGeneratorFormProps {
  className?: string;
  disabled?: boolean;
  onSubmit?: (values: LogoGeneratorFormValues) => Promise<void> | void;
  onAIGenerate?: (values: LogoGeneratorFormValues) => Promise<void> | void;
  aiSimulationRangeMs?: readonly [number, number];
}

interface FormErrors {
  brandName?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const TYPOGRAPHY_STYLES: readonly TypographyStyle[] = [
  "Serif",
  "Sans-serif",
  "Modern",
  "Script",
  "Bold",
  "Light",
];

const LOGO_TONES: readonly LogoTone[] = [
  "Professional",
  "Playful",
  "Luxury",
  "Minimalist",
  "Bold",
  "Elegant",
  "Tech",
  "Organic",
];

const ICON_STYLES: readonly IconStyle[] = ["abstract", "geometric", "typographic", "symbolic", "badge"];

const AI_STATUS_MESSAGES = [
  "Analizando los rasgos principales de tu marca...",
  "Combinando tipografía, tono e iconografía...",
  "Ajustando contraste y color para consistencia visual...",
  "Preparando variantes finales del logo...",
] as const;

const DEFAULT_VALUES: LogoGeneratorFormValues = {
  brandName: "",
  slogan: "",
  generationMode: "svg",
  typographyStyle: "Modern",
  logoTone: "Professional",
  iconStyle: "geometric",
  industry: "",
  brandColors: {
    primary: "#f5c518",
    secondary: "rgba(34, 34, 34, 0.90)",
  },
};

function randomBetween(min: number, max: number) {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function isHexColor(value: string) {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

function isRgbaColor(value: string) {
  const trimmed = value.trim();
  if (!/^rgba\(/i.test(trimmed)) return false;
  const rgbaRegex =
    /^rgba\(\s*(25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  return rgbaRegex.test(trimmed);
}

function isValidColor(value: string) {
  return isHexColor(value) || isRgbaColor(value);
}

function channelToHex(channel: number) {
  return channel.toString(16).padStart(2, "0");
}

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  if (!isHexColor(trimmed)) return "#000000";
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return trimmed.slice(0, 7).toLowerCase();
}

function rgbaToHex(value: string) {
  const matches = value.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length < 3) return "#000000";
  const [r, g, b] = matches.slice(0, 3).map((part) => Math.max(0, Math.min(255, Number(part))));
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

function getColorInputValue(value: string) {
  if (isHexColor(value)) return normalizeHexColor(value);
  if (isRgbaColor(value)) return rgbaToHex(value);
  return "#000000";
}

function mapActiveBrandToFormValues(brand: ActiveBrand): LogoGeneratorFormValues {
  return {
    brandName: brand.name ?? DEFAULT_VALUES.brandName,
    slogan: brand.slogan ?? DEFAULT_VALUES.slogan,
    generationMode: brand.preferences.generationMode ?? DEFAULT_VALUES.generationMode,
    typographyStyle: brand.preferences.typographyStyle ?? DEFAULT_VALUES.typographyStyle,
    logoTone: brand.preferences.logoTone ?? DEFAULT_VALUES.logoTone,
    iconStyle: brand.preferences.iconStyle ?? DEFAULT_VALUES.iconStyle,
    industry: brand.industry ?? DEFAULT_VALUES.industry,
    brandColors: {
      primary: brand.colors.primary ?? DEFAULT_VALUES.brandColors.primary,
      secondary: brand.colors.secondary ?? DEFAULT_VALUES.brandColors.secondary,
    },
  };
}

function validateForm(values: LogoGeneratorFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.brandName.trim()) {
    errors.brandName = "El nombre de marca es obligatorio.";
  }

  if (!isValidColor(values.brandColors.primary)) {
    errors.primaryColor = "Usa un color válido en HEX o RGBA.";
  }

  if (!isValidColor(values.brandColors.secondary)) {
    errors.secondaryColor = "Usa un color válido en HEX o RGBA.";
  }

  return errors;
}

export default function LogoGeneratorForm({
  className = "",
  disabled = false,
  onSubmit,
  onAIGenerate,
  aiSimulationRangeMs = [10_000, 30_000],
}: LogoGeneratorFormProps) {
  const { activeBrand, isLoading: isBrandLoading, error: brandError } = useActiveBrand();

  const [values, setValues] = useState<LogoGeneratorFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isLocked = disabled || isBrandLoading || isSubmitting || isGeneratingAI;

  useEffect(() => {
    if (!activeBrand) return;
    setValues((previousValues) => ({
      ...previousValues,
      ...mapActiveBrandToFormValues(activeBrand),
    }));
  }, [activeBrand]);

  const resolvedClassName = useMemo(
    () =>
      [
        "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        "sm:p-8",
        className.trim(),
      ]
        .filter(Boolean)
        .join(" "),
    [className],
  );

  function handleInputChange<K extends keyof LogoGeneratorFormValues>(key: K, value: LogoGeneratorFormValues[K]) {
    setValues((previousValues) => ({
      ...previousValues,
      [key]: value,
    }));
  }

  function handleColorChange(key: keyof LogoGeneratorFormValues["brandColors"], value: string) {
    setValues((previousValues) => ({
      ...previousValues,
      brandColors: {
        ...previousValues.brandColors,
        [key]: value,
      },
    }));
  }

  async function simulateAIGeneration() {
    const [minMs, maxMs] = aiSimulationRangeMs;
    const totalMs = randomBetween(minMs, maxMs);
    const stepMs = Math.max(2_000, Math.floor(totalMs / AI_STATUS_MESSAGES.length));
    let messageIndex = 0;

    setStatusMessage(AI_STATUS_MESSAGES[messageIndex]);
    const intervalId = window.setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, AI_STATUS_MESSAGES.length - 1);
      setStatusMessage(AI_STATUS_MESSAGES[messageIndex]);
    }, stepMs);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), totalMs);
      });
    } finally {
      window.clearInterval(intervalId);
    }
  }

  async function handleAIGenerate() {
    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    setSuccessMessage(null);

    if (Object.keys(nextErrors).length > 0) return;

    setIsGeneratingAI(true);

    try {
      await simulateAIGeneration();
      if (onAIGenerate) {
        await onAIGenerate(values);
      }
      setSuccessMessage("Logo generado con IA correctamente. Puedes continuar al preview.");
      setStatusMessage("Generación IA finalizada.");
    } catch {
      setStatusMessage("Ocurrió un error al generar con IA. Inténtalo nuevamente.");
    } finally {
      setIsGeneratingAI(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    setSuccessMessage(null);

    if (Object.keys(nextErrors).length > 0) return;

    if (values.generationMode === "ai") {
      await handleAIGenerate();
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setStatusMessage("Configuración validada. Lista para generar plantilla SVG.");
      setSuccessMessage("Configuración guardada para generación instantánea.");
    } catch {
      setStatusMessage("No se pudo guardar la configuración. Revisa los datos e intenta otra vez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={resolvedClassName} aria-label="Formulario de configuración de logos">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Logo Config</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Configuración inteligente del logo</h2>
        <p className="mt-2 text-sm text-zinc-600">
          El formulario se completa automáticamente desde el perfil activo de marca para mantener consistencia.
        </p>
      </header>

      {(isBrandLoading || brandError) && (
        <div
          className="mb-5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
          role="status"
          aria-live="polite"
        >
          {isBrandLoading ? "Cargando perfil activo de marca..." : `No se pudo cargar la marca activa: ${brandError}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isLocked}>
        <fieldset disabled={isLocked} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="brandName" className="text-sm font-medium text-zinc-800">
                Brand Name
              </label>
              <input
                id="brandName"
                aria-label="Nombre de marca"
                value={values.brandName}
                onChange={(event) => handleInputChange("brandName", event.target.value)}
                placeholder="Nombre de tu marca"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
              />
              {errors.brandName && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.brandName}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="slogan" className="text-sm font-medium text-zinc-800">
                Slogan (opcional)
              </label>
              <input
                id="slogan"
                aria-label="Slogan"
                value={values.slogan}
                onChange={(event) => handleInputChange("slogan", event.target.value)}
                placeholder="Eslogan de marca"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-800">Generation Mode</p>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Modo de generación de logo">
              <button
                type="button"
                role="radio"
                aria-checked={values.generationMode === "svg"}
                onClick={() => handleInputChange("generationMode", "svg")}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  values.generationMode === "svg"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500"
                }`}
              >
                <p className="text-sm font-semibold">Plantillas SVG</p>
                <p className="mt-1 text-xs opacity-80">Instantáneo</p>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={values.generationMode === "ai"}
                onClick={() => handleInputChange("generationMode", "ai")}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  values.generationMode === "ai"
                    ? "border-amber-500 bg-amber-500/10 text-zinc-900"
                    : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500"
                }`}
              >
                <p className="text-sm font-semibold">Generación con IA</p>
                <p className="mt-1 text-xs opacity-80">Asíncrono (10-30s)</p>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="typographyStyle" className="text-sm font-medium text-zinc-800">
                Typography Style
              </label>
              <select
                id="typographyStyle"
                aria-label="Estilo tipográfico"
                value={values.typographyStyle}
                onChange={(event) =>
                  handleInputChange("typographyStyle", event.target.value as TypographyStyle)
                }
                className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
              >
                {TYPOGRAPHY_STYLES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="iconStyle" className="text-sm font-medium text-zinc-800">
                Icon Style
              </label>
              <select
                id="iconStyle"
                aria-label="Estilo de icono"
                value={values.iconStyle}
                onChange={(event) => handleInputChange("iconStyle", event.target.value as IconStyle)}
                className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
              >
                {ICON_STYLES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="industry" className="text-sm font-medium text-zinc-800">
                Industry (opcional)
              </label>
              <input
                id="industry"
                aria-label="Industria"
                value={values.industry}
                onChange={(event) => handleInputChange("industry", event.target.value)}
                placeholder="Ej: Tecnología, Restaurant, Retail"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-800">Logo Tone</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LOGO_TONES.map((tone) => {
                const isSelected = values.logoTone === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    aria-label={`Tono ${tone}`}
                    aria-pressed={isSelected}
                    onClick={() => handleInputChange("logoTone", tone)}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-zinc-800">Brand Colors</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="primaryColorText" className="text-sm font-medium text-zinc-700">
                  Color primario (HEX/RGBA)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="primaryColorText"
                    aria-label="Color primario en formato HEX o RGBA"
                    value={values.brandColors.primary}
                    onChange={(event) => handleColorChange("primary", event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
                  />
                  <input
                    type="color"
                    aria-label="Selector visual de color primario"
                    value={getColorInputValue(values.brandColors.primary)}
                    onChange={(event) => handleColorChange("primary", event.target.value)}
                    className="h-10 w-12 rounded-lg border border-zinc-300 bg-white p-1"
                  />
                </div>
                {errors.primaryColor && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.primaryColor}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="secondaryColorText" className="text-sm font-medium text-zinc-700">
                  Color secundario (HEX/RGBA)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="secondaryColorText"
                    aria-label="Color secundario en formato HEX o RGBA"
                    value={values.brandColors.secondary}
                    onChange={(event) => handleColorChange("secondary", event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-300"
                  />
                  <input
                    type="color"
                    aria-label="Selector visual de color secundario"
                    value={getColorInputValue(values.brandColors.secondary)}
                    onChange={(event) => handleColorChange("secondary", event.target.value)}
                    className="h-10 w-12 rounded-lg border border-zinc-300 bg-white p-1"
                  />
                </div>
                {errors.secondaryColor && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.secondaryColor}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-zinc-500">Formatos válidos: `#f5c518` o `rgba(245, 197, 24, 0.2)`.</p>
          </div>
        </fieldset>

        <div className="space-y-3 border-t border-zinc-200 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              aria-label={values.generationMode === "ai" ? "Generar logo con IA" : "Guardar configuración SVG"}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                values.generationMode === "ai"
                  ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:bg-amber-300"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-400"
              }`}
              disabled={isLocked}
            >
              {isGeneratingAI ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generando con IA...
                </span>
              ) : values.generationMode === "ai" ? (
                "Generar Logo con IA"
              ) : isSubmitting ? (
                "Guardando configuración..."
              ) : (
                "Guardar Configuración"
              )}
            </button>

            {values.generationMode === "ai" && (
              <p className="text-xs text-zinc-500">Durante la generación IA se bloquearán inputs para evitar inconsistencias.</p>
            )}
          </div>

          {statusMessage && (
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700" aria-live="polite">
              {statusMessage}
            </p>
          )}

          {successMessage && (
            <p
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
