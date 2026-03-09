/**
 * Visual Identity Workspace
 * Refine generated visual identity components
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, Sparkles, Download, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useGeneratedIdentity,
    useWorkspaceFlow,
} from "@/lib/stores/identityFlowStore";
import type { VisualIdentityWorkspace as VisualIdentityData } from "@/types/identity";

const WORKSPACE_KEY = "visual-identity";

const PRESET_PALETTES = [
    { name: "Tech", colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"] },
    { name: "Nature", colors: ["#2d5a27", "#8fbc8f", "#f4a460", "#f5f5dc"] },
    { name: "Minimal", colors: ["#1a1a1a", "#404040", "#808080", "#f5f5f5"] },
    { name: "Vibrant", colors: ["#7b2cbf", "#b5179e", "#f72585", "#4cc9f0"] },
];

export default function VisualIdentityWorkspace() {
    const router = useRouter();
    const generatedIdentity = useGeneratedIdentity();
    const workspaceFlow = useWorkspaceFlow();

    const { updateWorkspaceData, completeWorkspace } = useIdentityFlowStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Workspace data state
    const [colors, setColors] = useState<VisualIdentityData["colors"]>({
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#e94560",
        neutrals: ["#f5f5f5", "#e0e0e0", "#b0b0b0"],
    });

    const [typography, setTypography] = useState<VisualIdentityData["typography"]>({
        heading_family: "Inter",
        body_family: "Inter",
        accent_family: undefined,
        scale: ["12", "14", "16", "20", "24", "32", "48", "64"],
    });

    const [logo, setLogo] = useState<VisualIdentityData["logo"]>({
        selected_concept: "",
        customizations: {},
        variations: [],
    });

    // Load existing data if available
    useEffect(() => {
        const existingData = workspaceFlow.workspace_data[WORKSPACE_KEY] as
            | VisualIdentityData
            | undefined;

        if (existingData) {
            if (existingData.colors) setColors(existingData.colors);
            if (existingData.typography) setTypography(existingData.typography);
            if (existingData.logo) setLogo(existingData.logo);
        } else if (generatedIdentity?.generated_content?.visual_identity) {
            // Pre-fill from generated identity
            const visual = generatedIdentity.generated_content.visual_identity;
            if (visual.color_palette?.length) {
                setColors({
                    primary: visual.color_palette[0]?.hex || "#1a1a2e",
                    secondary: visual.color_palette[1]?.hex || "#16213e",
                    accent: visual.color_palette[2]?.hex || "#e94560",
                    neutrals: visual.color_palette.slice(3).map((c) => c.hex),
                });
            }
            if (visual.typography_system) {
                setTypography({
                    heading_family: visual.typography_system.heading_family,
                    body_family: visual.typography_system.body_family,
                    accent_family: visual.typography_system.accent_family,
                    scale: visual.typography_system.scale.map(String),
                });
            }
        }
    }, [generatedIdentity, workspaceFlow]);

    const steps = [
        { id: "colors", name: "Paleta de Colores", icon: Palette },
        { id: "typography", name: "Tipografía", icon: "Aa" },
        { id: "logo", name: "Logo", icon: "○" },
        { id: "guidelines", name: "Guías Visuales", icon: "⬚" },
    ];

    const handleSave = async () => {
        setIsSaving(true);

        const data: VisualIdentityData = {
            colors,
            typography,
            logo,
            visual_guidelines: {
                imagery_style: "",
                layout_principles: [],
                do_dont: { do: [], dont: [] },
            },
        };

        updateWorkspaceData(WORKSPACE_KEY, data);

        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsSaving(false);
        toast.success("Cambios guardados");
    };

    const handleSaveAndContinue = async () => {
        await handleSave();

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Complete workspace
            completeWorkspace(WORKSPACE_KEY);
            router.push("/identity/workspaces");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        } else {
            router.push("/identity/workspaces");
        }
    };

    const handleRegenerateColors = () => {
        const preset = PRESET_PALETTES[Math.floor(Math.random() * PRESET_PALETTES.length)];
        setColors({
            primary: preset.colors[0],
            secondary: preset.colors[1],
            accent: preset.colors[2],
            neutrals: preset.colors.slice(3),
        });
        toast.success("Nueva paleta generada");
    };

    const StepContent = () => {
        switch (steps[currentStep].id) {
            case "colors":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Paleta de Colores</h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Ajusta los colores generados o usa una paleta predefinida
                            </p>
                        </div>

                        {/* Color Pickers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ColorPicker
                                label="Primary"
                                value={colors.primary}
                                onChange={(v) => setColors({ ...colors, primary: v })}
                            />
                            <ColorPicker
                                label="Secondary"
                                value={colors.secondary}
                                onChange={(v) => setColors({ ...colors, secondary: v })}
                            />
                            <ColorPicker
                                label="Accent"
                                value={colors.accent}
                                onChange={(v) => setColors({ ...colors, accent: v })}
                            />
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Neutrales</label>
                                <div className="flex gap-2">
                                    {colors.neutrals.map((n, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded border border-[var(--bm-color-border)]"
                                            style={{ background: n }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Palette Generator */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleRegenerateColors}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)]/50 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generar Variación
                            </button>
                        </div>
                    </div>
                );

            case "typography":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Tipografía</h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Define las familias tipográficas de tu marca
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Fuente para Títulos
                                </label>
                                <select
                                    value={typography.heading_family}
                                    onChange={(e) =>
                                        setTypography({
                                            ...typography,
                                            heading_family: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--bm-input-border)] bg-[var(--bm-input-bg)] text-[var(--bm-input-text)]"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                    <option value="Merriweather">Merriweather</option>
                                </select>
                                <p
                                    className="text-2xl"
                                    style={{ fontFamily: typography.heading_family }}
                                >
                                    Tu Marca Aquí
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Fuente para Cuerpo
                                </label>
                                <select
                                    value={typography.body_family}
                                    onChange={(e) =>
                                        setTypography({
                                            ...typography,
                                            body_family: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--bm-input-border)] bg-[var(--bm-input-bg)] text-[var(--bm-input-text)]"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Source Sans Pro">Source Sans Pro</option>
                                    <option value="Lato">Lato</option>
                                </select>
                                <p
                                    className="text-sm text-[var(--bm-color-text-secondary)]"
                                    style={{ fontFamily: typography.body_family }}
                                >
                                    El cuerpo de texto usa esta fuente para garantizar
                                    legibilidad en todos los contextos.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "logo":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Logo</h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Selecciona o personaliza el concepto de logo
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-dashed border-[var(--bm-color-border)] text-center">
                            <p className="text-sm text-[var(--bm-color-text-secondary)]">
                                Los conceptos de logo se generarán en esta sección
                            </p>
                        </div>
                    </div>
                );

            case "guidelines":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">
                                Guías Visuales
                            </h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Define los principios de diseño de tu marca
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-dashed border-[var(--bm-color-border)] text-center">
                            <p className="text-sm text-[var(--bm-color-text-secondary)]">
                                Las guías visuales se generarán en esta sección
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
            {/* Header */}
            <div className="border-b border-[var(--bm-color-border)]">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Volver a Workspaces
                        </button>
                        <div className="text-xs text-[var(--bm-color-text-secondary)]">
                            Paso {currentStep + 1} de {steps.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm",
                                    currentStep === index
                                        ? "bg-[var(--bm-color-accent)] text-white"
                                        : currentStep > index
                                        ? "bg-emerald-500/20 text-emerald-500"
                                        : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
                                )}
                            >
                                {currentStep > index ? (
                                    "✓"
                                ) : typeof Icon === "string" ? (
                                    Icon
                                ) : (
                                    <Icon size={18} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    {StepContent()}
                </motion.div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--bm-color-border)]">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-30 text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
                    >
                        <ChevronLeft size={16} />
                        Anterior
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)]/50 transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            {isSaving ? "Guardando..." : "Guardar"}
                        </button>

                        <button
                            onClick={handleSaveAndContinue}
                            disabled={isSaving}
                            className="px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 bg-[var(--bm-button-primary-bg)] text-[var(--bm-button-primary-text)] hover:opacity-90"
                        >
                            {currentStep < steps.length - 1 ? (
                                <>
                                    Siguiente
                                    <ChevronRight size={16} />
                                </>
                            ) : (
                                "Completar"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 rounded-lg border border-[var(--bm-color-border)]"
                    style={{ background: value }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--bm-input-border)] bg-[var(--bm-input-bg)] text-[var(--bm-input-text)] text-sm font-mono"
                    placeholder="#000000"
                />
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                />
            </div>
        </div>
    );
}
