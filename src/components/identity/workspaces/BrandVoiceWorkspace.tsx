/**
 * Brand Voice Workspace
 * Define how the brand sounds and communicates
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useGeneratedIdentity,
    useWorkspaceFlow,
} from "@/lib/stores/identityFlowStore";
import type { BrandVoiceWorkspace as BrandVoiceData } from "@/types/identity";

const WORKSPACE_KEY = "brand-voice";

const TRAIT_OPTIONS = [
    "Confident",
    "Innovative",
    "Direct",
    "Friendly",
    "Authoritative",
    "Playful",
    "Professional",
    "Casual",
    "Bold",
    "Subtle",
];

export default function BrandVoiceWorkspace() {
    const router = useRouter();
    const generatedIdentity = useGeneratedIdentity();
    const workspaceFlow = useWorkspaceFlow();

    const { updateWorkspaceData, completeWorkspace } = useIdentityFlowStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Workspace data state
    const [toneSpectrum, setToneSpectrum] = useState<BrandVoiceData["tone_spectrum"]>({
        formal_casual: 50,
        serious_playful: 50,
        traditional_modern: 50,
    });

    const [characteristics, setCharacteristics] = useState<BrandVoiceData["characteristics"]>([]);

    const [guidelines, setGuidelines] = useState<BrandVoiceData["guidelines"]>({
        principles: [],
        examples: [],
    });

    // Load existing data if available
    useEffect(() => {
        const existingData = workspaceFlow.workspace_data[WORKSPACE_KEY] as
            | BrandVoiceData
            | undefined;

        if (existingData) {
            if (existingData.tone_spectrum) setToneSpectrum(existingData.tone_spectrum);
            if (existingData.characteristics) setCharacteristics(existingData.characteristics);
            if (existingData.guidelines) setGuidelines(existingData.guidelines);
        } else if (generatedIdentity?.generated_content?.voice_identity) {
            // Pre-fill from generated identity
            const voice = generatedIdentity.generated_content.voice_identity;
            if (voice.tone_profile) {
                setToneSpectrum(voice.tone_profile);
            }
            if (voice.characteristics) {
                setCharacteristics(voice.characteristics);
            }
        }
    }, [generatedIdentity, workspaceFlow]);

    const steps = [
        { id: "tone", name: "Tono y Espectro", icon: "〰" },
        { id: "characteristics", name: "Características", icon: "◆" },
        { id: "examples", name: "Ejemplos", icon: "❝" },
    ];

    const handleSave = async () => {
        setIsSaving(true);

        const data: BrandVoiceData = {
            tone_spectrum: toneSpectrum,
            characteristics,
            guidelines,
            messaging: {
                taglines: [],
                headlines: [],
                email_templates: {},
                social_media_captions: [],
            },
        };

        updateWorkspaceData(WORKSPACE_KEY, data);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsSaving(false);
        toast.success("Cambios guardados");
    };

    const handleSaveAndContinue = async () => {
        await handleSave();

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
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

    const toggleCharacteristic = (trait: string) => {
        if (characteristics.includes(trait)) {
            setCharacteristics(characteristics.filter((t) => t !== trait));
        } else if (characteristics.length < 5) {
            setCharacteristics([...characteristics, trait]);
        } else {
            toast.error("Máximo 5 características");
        }
    };

    const StepContent = () => {
        switch (steps[currentStep].id) {
            case "tone":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Espectro de Tono</h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Define dónde cae tu marca en estos espectros
                            </p>
                        </div>

                        <div className="space-y-6">
                            <ToneSlider
                                label="Formal"
                                leftLabel="Formal"
                                rightLabel="Casual"
                                value={toneSpectrum.formal_casual}
                                onChange={(v) =>
                                    setToneSpectrum({ ...toneSpectrum, formal_casual: v })
                                }
                            />
                            <ToneSlider
                                label="Seriedad"
                                leftLabel="Serio"
                                rightLabel="Divertido"
                                value={toneSpectrum.serious_playful}
                                onChange={(v) =>
                                    setToneSpectrum({ ...toneSpectrum, serious_playful: v })
                                }
                            />
                            <ToneSlider
                                label="Estilo"
                                leftLabel="Tradicional"
                                rightLabel="Moderno"
                                value={toneSpectrum.traditional_modern}
                                onChange={(v) =>
                                    setToneSpectrum({ ...toneSpectrum, traditional_modern: v })
                                }
                            />
                        </div>
                    </div>
                );

            case "characteristics":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">
                                Características de Voz
                            </h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                Selecciona hasta 5 rasgos que definan tu marca
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {TRAIT_OPTIONS.map((trait) => (
                                <button
                                    key={trait}
                                    onClick={() => toggleCharacteristic(trait)}
                                    className={cn(
                                        "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                        characteristics.includes(trait)
                                            ? "bg-[var(--bm-color-accent)] text-white"
                                            : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:bg-[var(--bm-color-surface-muted)]/80"
                                    )}
                                >
                                    {trait}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case "examples":
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">
                                Ejemplos de Mensajes
                            </h3>
                            <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                                La IA generará ejemplos basados en tu tono seleccionado
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-dashed border-[var(--bm-color-border)] text-center">
                            <Volume2 className="w-8 h-8 mx-auto text-[var(--bm-color-text-secondary)]/30 mb-3" />
                            <p className="text-sm text-[var(--bm-color-text-secondary)]">
                                Los ejemplos de messaging se generarán aquí
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
                <div className="flex items-center justify-center gap-2 mb-10">
                    {steps.map((step, index) => (
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
                            {currentStep > index ? "✓" : step.icon}
                        </button>
                    ))}
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    {StepContent()}
                </motion.div>

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

interface ToneSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
    onChange: (value: number) => void;
}

function ToneSlider({ label, leftLabel, rightLabel, value, onChange }: ToneSliderProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-[var(--bm-color-text-secondary)]">{leftLabel}</span>
                <span className="text-[var(--bm-color-text-secondary)]">{rightLabel}</span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--bm-color-accent)] bg-[var(--bm-color-surface-muted)]"
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bm-color-accent)] shadow-lg pointer-events-none"
                    style={{ left: `calc(${value}% - 8px)` }}
                />
            </div>
        </div>
    );
}
