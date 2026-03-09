"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrandTokens } from "@/lib/hooks/useBrandTokens";
import { useMercaData } from "@/app/workspace/logo/useMercaData";
import type {
  BrandIdentity,
  GenerateLogoApiResponse,
  LogoIconStyle,
  LogoLayout,
  LogoToneStyle,
  LogoTypographyStyle,
  BamlFormState,
  BamlGeneratedResult,
  BamlStepId,
} from "@/app/workspace/logo/types";

const STEPS: Array<{
  id: BamlStepId;
  title: string;
  description: string;
}> = [
  {
    id: "market",
    title: "Merca",
    description: "Selecciona señales de mercado y competencia para guiar la dirección visual.",
  },
  {
    id: "identity",
    title: "Identidad",
    description: "Define tono, tipografía, iconografía y layout del logo.",
  },
  {
    id: "prompt",
    title: "Prompt",
    description: "Ajusta el prompt final y restricciones negativas.",
  },
  {
    id: "review",
    title: "Revisión",
    description: "Valida y ejecuta la generación final.",
  },
];

const TYPOGRAPHY_OPTIONS: LogoTypographyStyle[] = [
  "Serif",
  "Sans-serif",
  "Modern",
  "Script",
  "Bold",
  "Light",
];

const TONE_OPTIONS: LogoToneStyle[] = [
  "Professional",
  "Playful",
  "Luxury",
  "Minimalist",
  "Bold",
  "Elegant",
  "Tech",
  "Organic",
];

const ICON_OPTIONS: LogoIconStyle[] = ["abstract", "geometric", "typographic", "symbolic", "badge"];
const LAYOUT_OPTIONS: LogoLayout[] = ["horizontal", "stacked", "icon-only"];

const DEFAULT_FORM_STATE: BamlFormState = {
  brandName: "",
  industry: "",
  selectedCompetitors: [],
  selectedSignals: [],
  selectedOpportunities: [],
  selectedRisks: [],
  typography: "Modern",
  tone: "Professional",
  iconStyle: "geometric",
  layout: "horizontal",
  userPrompt: "",
  negativePrompt: "",
};

function createBrandIdentity(brandId: string, tokens: ReturnType<typeof useBrandTokens>["brandTokens"]): BrandIdentity {
  return {
    brandId,
    colors: {
      primary: tokens.color.accent,
      secondary: tokens.color.accentMuted,
      accent: tokens.color.accentContrast,
      background: tokens.color.background,
      surface: tokens.color.surface,
      border: tokens.color.border,
      textPrimary: tokens.color.textPrimary,
      textSecondary: tokens.color.textSecondary,
    },
    typography: {
      displayFont: tokens.typography.fontDisplay,
      bodyFont: tokens.typography.fontSans,
      monoFont: tokens.typography.fontMono,
      bodyLineHeight: tokens.typography.lineHeightBody,
      headingLineHeight: tokens.typography.lineHeightHeading,
    },
    spacing: tokens.spacing,
    radius: tokens.radius,
    shadow: tokens.shadow,
  };
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }
  return date.toLocaleString();
}

interface BamlLogoWorkspaceProps {
  brandId: string;
}

export default function BamlLogoWorkspace({ brandId }: BamlLogoWorkspaceProps) {
  const { brandTokens, isLoading: isBrandTokensLoading } = useBrandTokens(brandId);
  const { merca, isLoading: isMercaLoading, error: mercaError, refresh: refreshMerca } = useMercaData(brandId);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [form, setForm] = useState<BamlFormState>(DEFAULT_FORM_STATE);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<BamlGeneratedResult | null>(null);

  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const brandIdentity = useMemo(
    () => createBrandIdentity(brandId, brandTokens),
    [brandId, brandTokens],
  );

  const selectedCompetitors = useMemo(() => {
    if (!merca) return [];
    return merca.competitors.filter((item) => form.selectedCompetitors.includes(item.id));
  }, [merca, form.selectedCompetitors]);

  const hasMarketOptions = useMemo(() => {
    if (!merca) return false;
    return (
      merca.competitors.length > 0 ||
      merca.marketSignals.length > 0 ||
      merca.whitespaceOpportunities.length > 0 ||
      merca.strategicRisks.length > 0
    );
  }, [merca]);

  const stepValidity = useMemo(() => {
    const marketValid = !hasMarketOptions || form.selectedCompetitors.length > 0 || form.selectedSignals.length > 0;
    const identityValid = form.brandName.trim().length >= 2 && form.industry.trim().length >= 2;
    const promptValid = form.userPrompt.trim().length >= 20 && form.negativePrompt.trim().length >= 8;

    return {
      market: marketValid,
      identity: identityValid,
      prompt: promptValid,
      review: true,
    };
  }, [
    hasMarketOptions,
    form.brandName,
    form.industry,
    form.selectedCompetitors.length,
    form.selectedSignals.length,
    form.userPrompt,
    form.negativePrompt,
  ]);

  const composedPrompt = useMemo(() => {
    const selectedSignalText =
      form.selectedSignals.length > 0
        ? form.selectedSignals.join(", ")
        : merca?.marketSignals.slice(0, 3).join(", ") || "sin señales de mercado explícitas";
    const selectedCompetitorText =
      selectedCompetitors.length > 0
        ? selectedCompetitors.map((item) => item.name).join(", ")
        : "sin competidores seleccionados";
    const opportunityText =
      form.selectedOpportunities.length > 0
        ? form.selectedOpportunities.join(", ")
        : merca?.whitespaceOpportunities.slice(0, 2).join(", ") || "sin oportunidades priorizadas";

    const basePrompt =
      form.userPrompt.trim() ||
      `Create a ${form.tone.toLowerCase()} brand logo for ${form.brandName || "this brand"} in ${form.industry || "its industry"}.`;

    return [
      basePrompt,
      `Use primary brand colors ${brandIdentity.colors.primary} and ${brandIdentity.colors.secondary}.`,
      `Visual references from merca: signals (${selectedSignalText}), competitors (${selectedCompetitorText}), opportunities (${opportunityText}).`,
      `Typography style: ${form.typography}. Icon style: ${form.iconStyle}. Layout preference: ${form.layout}.`,
      "Deliver a clear, scalable, high-contrast logo concept with strong memorability.",
    ].join(" ");
  }, [
    form.iconStyle,
    form.industry,
    form.layout,
    form.brandName,
    form.tone,
    form.typography,
    form.userPrompt,
    form.selectedSignals,
    form.selectedOpportunities,
    merca,
    selectedCompetitors,
    brandIdentity.colors.primary,
    brandIdentity.colors.secondary,
  ]);

  const composedNegativePrompt = useMemo(() => {
    const userNegative = form.negativePrompt.trim();
    const defaults = [
      "off-brand colors",
      "low contrast",
      "visual clutter",
      "watermark",
      "text artifacts",
      "complex gradients",
    ];
    const merged = [...defaults, userNegative].filter(Boolean);
    return merged.join(", ");
  }, [form.negativePrompt]);

  const themeStyle = useMemo(
    () =>
      ({
        "--pf-bg": brandIdentity.colors.background,
        "--pf-surface": brandIdentity.colors.surface,
        "--pf-border": brandIdentity.colors.border,
        "--pf-text": brandIdentity.colors.textPrimary,
        "--pf-text-muted": brandIdentity.colors.textSecondary,
        "--pf-accent": brandIdentity.colors.primary,
        "--pf-accent-contrast": brandIdentity.colors.accent,
        fontFamily: brandIdentity.typography.bodyFont,
      }) as React.CSSProperties,
    [brandIdentity],
  );

  useEffect(() => {
    if (!merca) {
      return;
    }

    setForm((previous) => {
      const next = { ...previous };

      if (!next.brandName.trim()) {
        next.brandName = merca.brandName;
      }

      if (!next.industry.trim()) {
        next.industry = merca.industry;
      }

      if (next.selectedSignals.length === 0 && merca.marketSignals.length > 0) {
        next.selectedSignals = [merca.marketSignals[0]];
      }

      if (next.selectedCompetitors.length === 0 && merca.competitors.length > 0) {
        next.selectedCompetitors = [merca.competitors[0].id];
      }

      if (!next.userPrompt.trim()) {
        next.userPrompt = `Design a ${next.tone.toLowerCase()} logo for ${next.brandName} with strong alignment to market expectations in ${next.industry}.`;
      }

      if (!next.negativePrompt.trim()) {
        next.negativePrompt = "clipart, low quality, too many details, irrelevant symbols";
      }

      return next;
    });
  }, [merca]);

  const updateFormField = useCallback(
    <K extends keyof BamlFormState>(field: K, value: BamlFormState[K]) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    [],
  );

  const handleStepChange = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= STEPS.length) {
        return;
      }
      setFlowError(null);
      setActiveStepIndex(nextIndex);
    },
    [],
  );

  const handleStepKeyNavigation = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (activeStepIndex + direction + STEPS.length) % STEPS.length;
      handleStepChange(nextIndex);
      stepRefs.current[nextIndex]?.focus();
    },
    [activeStepIndex, handleStepChange],
  );

  const handleNext = useCallback(() => {
    const currentStepId = STEPS[activeStepIndex].id;
    const isValid = stepValidity[currentStepId];

    if (!isValid) {
      setFlowError("Completa los campos requeridos de este paso antes de continuar.");
      return;
    }

    if (activeStepIndex < STEPS.length - 1) {
      setFlowError(null);
      setActiveStepIndex((previous) => previous + 1);
    }
  }, [activeStepIndex, stepValidity]);

  const handlePrevious = useCallback(() => {
    if (activeStepIndex > 0) {
      setFlowError(null);
      setActiveStepIndex((previous) => previous - 1);
    }
  }, [activeStepIndex]);

  const handleGenerate = useCallback(async () => {
    setFlowError(null);

    if (!stepValidity.review || !stepValidity.prompt || !stepValidity.identity) {
      setFlowError("El flujo aún no está listo para generar. Revisa los pasos anteriores.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: form.brandName,
          primaryColor: brandIdentity.colors.primary,
          secondaryColor: brandIdentity.colors.secondary,
          typography: form.typography,
          tone: form.tone,
          iconStyle: form.iconStyle,
          layout: form.layout,
          industry: form.industry,
          promptOverride: composedPrompt,
          negativePromptOverride: composedNegativePrompt,
        }),
      });

      const payload = (await response.json()) as GenerateLogoApiResponse;
      if (!payload.success) {
        throw new Error(payload.error || "No fue posible generar el logo.");
      }

      const imageUrl = payload.base64 || payload.imageUrl;
      if (!imageUrl) {
        throw new Error("El servicio respondió sin imagen.");
      }

      setGeneratedResult({
        imageUrl,
        prompt: composedPrompt,
        generatedAt: new Date().toISOString(),
      });
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "Error inesperado durante la generación de logo.";
      setFlowError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    brandIdentity.colors.primary,
    brandIdentity.colors.secondary,
    composedNegativePrompt,
    composedPrompt,
    form.brandName,
    form.iconStyle,
    form.industry,
    form.layout,
    form.tone,
    form.typography,
    stepValidity.identity,
    stepValidity.prompt,
    stepValidity.review,
  ]);

  const panelTitleId = `logo-baml-title-${brandId}`;
  const activeStepId = STEPS[activeStepIndex].id;

  return (
    <section
      className="space-y-6 rounded-2xl border bg-[var(--pf-bg)] p-4 text-[var(--pf-text)] sm:p-6"
      style={themeStyle}
      aria-labelledby={panelTitleId}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--pf-text-muted)]">Workspace / Logo</p>
          <h2
            id={panelTitleId}
            className="mt-1 text-2xl font-semibold leading-tight text-[var(--pf-text)]"
            style={{ fontFamily: brandIdentity.typography.displayFont }}
          >
            BAML de Logo
          </h2>
          <p
            className="mt-2 max-w-3xl text-sm text-[var(--pf-text-muted)]"
            style={{ fontFamily: brandIdentity.typography.bodyFont, lineHeight: brandIdentity.typography.bodyLineHeight }}
          >
            Flujo guiado para transformar insights de mercado (merca) en prompts de logo coherentes con la identidad de marca.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/brands/${brandId}/workspace/logo`}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--pf-border)] px-3 py-2 text-xs text-[var(--pf-text-muted)] hover:border-[var(--pf-accent)] hover:text-[var(--pf-text)]"
          >
            Editor avanzado
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={refreshMerca}
            className="border-[var(--pf-border)] text-[var(--pf-text)] hover:bg-[var(--pf-surface)]"
          >
            <RefreshCw size={14} className="mr-2" />
            Recargar merca
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <nav
            className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-2"
            role="tablist"
            aria-label="Pasos de BAML"
            onKeyDown={handleStepKeyNavigation}
          >
            <div className="grid gap-2 sm:grid-cols-4">
              {STEPS.map((step, index) => {
                const isActive = index === activeStepIndex;
                const isCompleted = index < activeStepIndex;

                return (
                  <button
                    key={step.id}
                    ref={(node) => {
                      stepRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${step.id}`}
                    id={`tab-${step.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleStepChange(index)}
                    className={`rounded-lg border px-3 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)]
                      ${
                        isActive
                          ? "border-[var(--pf-accent)] bg-[var(--pf-accent)]/10"
                          : "border-[var(--pf-border)] bg-transparent hover:border-[var(--pf-accent)]/50"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-300"
                            : isActive
                            ? "bg-[var(--pf-accent)] text-[var(--pf-accent-contrast)]"
                            : "bg-[var(--pf-border)] text-[var(--pf-text-muted)]"
                        }`}
                        aria-hidden="true"
                      >
                        {isCompleted ? <Check size={12} /> : index + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.1em]">{step.title}</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--pf-text-muted)]">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </nav>

          {flowError && (
            <div
              className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100"
              role="alert"
              aria-live="assertive"
            >
              {flowError}
            </div>
          )}

          <section
            id={`panel-${activeStepId}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeStepId}`}
            className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 sm:p-5"
          >
            {activeStepId === "market" && (
              <MarketStep
                isLoading={isMercaLoading || isBrandTokensLoading}
                error={mercaError}
                merca={merca}
                selectedCompetitorIds={form.selectedCompetitors}
                selectedSignals={form.selectedSignals}
                selectedOpportunities={form.selectedOpportunities}
                selectedRisks={form.selectedRisks}
                onToggleCompetitor={(value) =>
                  updateFormField("selectedCompetitors", toggleValue(form.selectedCompetitors, value))
                }
                onToggleSignal={(value) =>
                  updateFormField("selectedSignals", toggleValue(form.selectedSignals, value))
                }
                onToggleOpportunity={(value) =>
                  updateFormField("selectedOpportunities", toggleValue(form.selectedOpportunities, value))
                }
                onToggleRisk={(value) =>
                  updateFormField("selectedRisks", toggleValue(form.selectedRisks, value))
                }
              />
            )}

            {activeStepId === "identity" && (
              <IdentityStep
                brandName={form.brandName}
                industry={form.industry}
                typography={form.typography}
                tone={form.tone}
                iconStyle={form.iconStyle}
                layout={form.layout}
                onBrandNameChange={(value) => updateFormField("brandName", value)}
                onIndustryChange={(value) => updateFormField("industry", value)}
                onTypographyChange={(value) => updateFormField("typography", value)}
                onToneChange={(value) => updateFormField("tone", value)}
                onIconStyleChange={(value) => updateFormField("iconStyle", value)}
                onLayoutChange={(value) => updateFormField("layout", value)}
              />
            )}

            {activeStepId === "prompt" && (
              <PromptStep
                userPrompt={form.userPrompt}
                negativePrompt={form.negativePrompt}
                composedPrompt={composedPrompt}
                composedNegativePrompt={composedNegativePrompt}
                onPromptChange={(value) => updateFormField("userPrompt", value)}
                onNegativePromptChange={(value) => updateFormField("negativePrompt", value)}
              />
            )}

            {activeStepId === "review" && (
              <ReviewStep
                brandIdentity={brandIdentity}
                composedPrompt={composedPrompt}
                composedNegativePrompt={composedNegativePrompt}
                generatedResult={generatedResult}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
            )}
          </section>

          <footer className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={activeStepIndex === 0}
              className="border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text)] hover:bg-[var(--pf-bg)]"
            >
              <ArrowLeft size={14} className="mr-2" />
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-xs text-[var(--pf-text-muted)]">
              Paso {activeStepIndex + 1} de {STEPS.length}
            </div>

            <Button
              type="button"
              onClick={handleNext}
              disabled={activeStepIndex === STEPS.length - 1}
              className="bg-[var(--pf-accent)] text-[var(--pf-accent-contrast)] hover:brightness-110"
            >
              Siguiente
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </footer>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pf-text-muted)]">Brand Identity</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <ColorSwatch label="Primary" value={brandIdentity.colors.primary} />
              <ColorSwatch label="Secondary" value={brandIdentity.colors.secondary} />
              <ColorSwatch label="Accent" value={brandIdentity.colors.accent} />
            </div>
            <div className="mt-4 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Tipografía activa</p>
              <p className="mt-1 text-sm text-[var(--pf-text)]" style={{ fontFamily: brandIdentity.typography.displayFont }}>
                Display: {brandIdentity.typography.displayFont}
              </p>
              <p className="mt-1 text-xs text-[var(--pf-text-muted)]" style={{ fontFamily: brandIdentity.typography.bodyFont }}>
                Body: {brandIdentity.typography.bodyFont}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pf-text-muted)]">Merca Snapshot</h3>
            {isMercaLoading ? (
              <p className="mt-3 text-sm text-[var(--pf-text-muted)]">Cargando mercado...</p>
            ) : merca ? (
              <div className="mt-3 space-y-2 text-xs text-[var(--pf-text-muted)]">
                <p>
                  <span className="text-[var(--pf-text)]">Fuente:</span> {merca.source}
                </p>
                <p>
                  <span className="text-[var(--pf-text)]">Brand:</span> {merca.brandName}
                </p>
                <p>
                  <span className="text-[var(--pf-text)]">Actualizado:</span> {formatDate(merca.updatedAt)}
                </p>
                <p>
                  <span className="text-[var(--pf-text)]">Competidores:</span> {merca.competitors.length}
                </p>
                <p>
                  <span className="text-[var(--pf-text)]">Señales:</span> {merca.marketSignals.length}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--pf-text-muted)]">No hay dataset merca disponible para esta marca.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="h-8 rounded border border-black/20" style={{ backgroundColor: value }} aria-hidden="true" />
      <p className="truncate text-[10px] uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">{label}</p>
      <p className="truncate font-mono text-[10px] text-[var(--pf-text)]">{value}</p>
    </div>
  );
}

function SelectableChip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
        active
          ? "border-[var(--pf-accent)] bg-[var(--pf-accent)]/15 text-[var(--pf-text)]"
          : "border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:border-[var(--pf-accent)]/50 hover:text-[var(--pf-text)]"
      }`}
    >
      {label}
    </button>
  );
}

function MarketStep(props: {
  isLoading: boolean;
  error: string | null;
  merca: ReturnType<typeof useMercaData>["merca"];
  selectedCompetitorIds: string[];
  selectedSignals: string[];
  selectedOpportunities: string[];
  selectedRisks: string[];
  onToggleCompetitor: (id: string) => void;
  onToggleSignal: (signal: string) => void;
  onToggleOpportunity: (item: string) => void;
  onToggleRisk: (item: string) => void;
}) {
  if (props.isLoading) {
    return (
      <div className="space-y-3" aria-live="polite">
        <p className="text-sm text-[var(--pf-text-muted)]">Cargando dataset merca...</p>
        <div className="h-10 animate-pulse rounded bg-[var(--pf-bg)]" />
        <div className="h-10 animate-pulse rounded bg-[var(--pf-bg)]" />
      </div>
    );
  }

  if (props.error) {
    return (
      <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-amber-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} />
          <p className="text-sm font-medium">No se pudo cargar merca</p>
        </div>
        <p className="mt-1 text-xs text-amber-100/90">{props.error}</p>
      </div>
    );
  }

  if (!props.merca) {
    return (
      <p className="text-sm text-[var(--pf-text-muted)]">
        No hay datos de mercado previos para esta marca. Puedes continuar completando los pasos manualmente.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-[var(--pf-text)]">1) Selección de señales de mercado</h3>
        <p className="mt-1 text-sm text-[var(--pf-text-muted)]">
          Fuente: {props.merca.source} · Actualizado: {formatDate(props.merca.updatedAt)}
        </p>
      </header>

      <section className="space-y-2" aria-labelledby="competitor-title">
        <h4 id="competitor-title" className="text-sm font-medium text-[var(--pf-text)]">
          Competidores relevantes
        </h4>
        <div className="space-y-2">
          {props.merca.competitors.map((competitor) => {
            const checked = props.selectedCompetitorIds.includes(competitor.id);
            return (
              <label
                key={competitor.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3 hover:border-[var(--pf-accent)]/50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => props.onToggleCompetitor(competitor.id)}
                  aria-label={`Seleccionar competidor ${competitor.name}`}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--pf-border)]"
                />
                <span>
                  <span className="block text-sm font-medium text-[var(--pf-text)]">{competitor.name}</span>
                  <span className="mt-1 block text-xs text-[var(--pf-text-muted)]">
                    Fortalezas: {competitor.strengths.slice(0, 2).join(", ") || "N/A"} · Debilidades:{" "}
                    {competitor.weaknesses.slice(0, 2).join(", ") || "N/A"}
                  </span>
                </span>
              </label>
            );
          })}
          {props.merca.competitors.length === 0 && (
            <p className="text-xs text-[var(--pf-text-muted)]">No hay competidores en el dataset actual.</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-medium text-[var(--pf-text)]">Señales de mercado</h4>
        <div className="flex flex-wrap gap-2">
          {props.merca.marketSignals.map((signal) => (
            <SelectableChip
              key={signal}
              label={signal}
              active={props.selectedSignals.includes(signal)}
              onToggle={() => props.onToggleSignal(signal)}
            />
          ))}
          {props.merca.marketSignals.length === 0 && (
            <p className="text-xs text-[var(--pf-text-muted)]">Sin señales en el dataset actual.</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-medium text-[var(--pf-text)]">Oportunidades detectadas</h4>
        <div className="flex flex-wrap gap-2">
          {props.merca.whitespaceOpportunities.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              active={props.selectedOpportunities.includes(item)}
              onToggle={() => props.onToggleOpportunity(item)}
            />
          ))}
          {props.merca.whitespaceOpportunities.length === 0 && (
            <p className="text-xs text-[var(--pf-text-muted)]">Sin oportunidades detectadas.</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-medium text-[var(--pf-text)]">Riesgos estratégicos</h4>
        <div className="flex flex-wrap gap-2">
          {props.merca.strategicRisks.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              active={props.selectedRisks.includes(item)}
              onToggle={() => props.onToggleRisk(item)}
            />
          ))}
          {props.merca.strategicRisks.length === 0 && (
            <p className="text-xs text-[var(--pf-text-muted)]">Sin riesgos registrados.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function IdentityStep(props: {
  brandName: string;
  industry: string;
  typography: LogoTypographyStyle;
  tone: LogoToneStyle;
  iconStyle: LogoIconStyle;
  layout: LogoLayout;
  onBrandNameChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onTypographyChange: (value: LogoTypographyStyle) => void;
  onToneChange: (value: LogoToneStyle) => void;
  onIconStyleChange: (value: LogoIconStyle) => void;
  onLayoutChange: (value: LogoLayout) => void;
}) {
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-[var(--pf-text)]">2) Identidad visual</h3>
        <p className="mt-1 text-sm text-[var(--pf-text-muted)]">
          Define la configuración principal que alimentara BAML.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Nombre de marca</span>
          <input
            type="text"
            value={props.brandName}
            onChange={(event) => props.onBrandNameChange(event.target.value)}
            className="w-full rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-3 py-2 text-sm text-[var(--pf-text)]"
            placeholder="Ej: Nova Labs"
            aria-label="Nombre de marca"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Industria</span>
          <input
            type="text"
            value={props.industry}
            onChange={(event) => props.onIndustryChange(event.target.value)}
            className="w-full rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-3 py-2 text-sm text-[var(--pf-text)]"
            placeholder="Ej: SaaS B2B"
            aria-label="Industria"
          />
        </label>
      </div>

      <OptionGroup
        title="Tipografía"
        options={TYPOGRAPHY_OPTIONS}
        selected={props.typography}
        onChange={(value) => props.onTypographyChange(value as LogoTypographyStyle)}
      />

      <OptionGroup
        title="Tono"
        options={TONE_OPTIONS}
        selected={props.tone}
        onChange={(value) => props.onToneChange(value as LogoToneStyle)}
      />

      <OptionGroup
        title="Iconografía"
        options={ICON_OPTIONS}
        selected={props.iconStyle}
        onChange={(value) => props.onIconStyleChange(value as LogoIconStyle)}
      />

      <OptionGroup
        title="Layout"
        options={LAYOUT_OPTIONS}
        selected={props.layout}
        onChange={(value) => props.onLayoutChange(value as LogoLayout)}
      />
    </div>
  );
}

function OptionGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-medium text-[var(--pf-text)]">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md border px-3 py-1.5 text-xs capitalize transition-all ${
              selected === option
                ? "border-[var(--pf-accent)] bg-[var(--pf-accent)]/10 text-[var(--pf-text)]"
                : "border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:border-[var(--pf-accent)]/50"
            }`}
            aria-pressed={selected === option}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function PromptStep(props: {
  userPrompt: string;
  negativePrompt: string;
  composedPrompt: string;
  composedNegativePrompt: string;
  onPromptChange: (value: string) => void;
  onNegativePromptChange: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-[var(--pf-text)]">3) Prompt engineering</h3>
        <p className="mt-1 text-sm text-[var(--pf-text-muted)]">
          Ajusta la instrucción principal y el prompt negativo para controlar calidad y coherencia.
        </p>
      </header>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Prompt principal</span>
        <textarea
          value={props.userPrompt}
          onChange={(event) => props.onPromptChange(event.target.value)}
          className="min-h-28 w-full rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-3 py-2 text-sm text-[var(--pf-text)]"
          aria-label="Prompt principal"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Prompt negativo</span>
        <textarea
          value={props.negativePrompt}
          onChange={(event) => props.onNegativePromptChange(event.target.value)}
          className="min-h-24 w-full rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-3 py-2 text-sm text-[var(--pf-text)]"
          aria-label="Prompt negativo"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Prompt final compuesto</p>
          <p className="mt-2 text-xs text-[var(--pf-text)]">{props.composedPrompt}</p>
        </article>
        <article className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Negative prompt final</p>
          <p className="mt-2 text-xs text-[var(--pf-text)]">{props.composedNegativePrompt}</p>
        </article>
      </div>
    </div>
  );
}

function ReviewStep(props: {
  brandIdentity: BrandIdentity;
  composedPrompt: string;
  composedNegativePrompt: string;
  generatedResult: BamlGeneratedResult | null;
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-lg font-semibold text-[var(--pf-text)]">4) Ejecutar generación</h3>
        <p className="mt-1 text-sm text-[var(--pf-text-muted)]">
          Revisa el payload final y genera el logo con la API de producción.
        </p>
      </header>

      <article className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3 text-xs text-[var(--pf-text)]">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--pf-text-muted)]">Payload de generación</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
{JSON.stringify(
  {
    primaryColor: props.brandIdentity.colors.primary,
    secondaryColor: props.brandIdentity.colors.secondary,
    prompt: props.composedPrompt,
    negativePrompt: props.composedNegativePrompt,
  },
  null,
  2,
)}
        </pre>
      </article>

      <Button
        type="button"
        onClick={props.onGenerate}
        disabled={props.isGenerating}
        className="w-full bg-[var(--pf-accent)] text-[var(--pf-accent-contrast)] hover:brightness-110 sm:w-auto"
      >
        {props.isGenerating ? (
          <>
            <Loader2 size={15} className="mr-2 animate-spin" />
            Generando logo...
          </>
        ) : (
          <>
            <Sparkles size={15} className="mr-2" />
            Generar logo
          </>
        )}
      </Button>

      {props.generatedResult && (
        <article className="space-y-3 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-3">
          <p className="text-sm font-medium text-emerald-100">Logo generado correctamente</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.generatedResult.imageUrl}
            alt="Logo generado por BAML"
            className="max-h-72 w-full rounded-md border border-emerald-300/30 object-contain bg-white/90 p-2"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100/90">
            <span>Generado: {formatDate(props.generatedResult.generatedAt)}</span>
            <a
              href={props.generatedResult.imageUrl}
              download="logo-baml.png"
              className="rounded-md border border-emerald-200/60 px-2 py-1 hover:bg-emerald-500/20"
            >
              Descargar imagen
            </a>
          </div>
        </article>
      )}
    </div>
  );
}
