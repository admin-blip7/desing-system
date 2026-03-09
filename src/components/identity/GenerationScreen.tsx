/**
 * Identity Generation Screen
 * Shows generation progress with streaming updates
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdentityFlowStore } from "@/lib/stores/identityFlowStore";
import { useQuestionnaireData, useSelectedIdentity } from "@/lib/stores/identityFlowStore";
import type { PreIdentityGeneration, QuestionnaireData } from "@/types/identity";
import { useRouter } from "next/navigation";

interface GenerationStep {
    id: string;
    name: string;
    status: "pending" | "in-progress" | "complete" | "error";
    description?: string;
}

const GENERATION_STEPS: Omit<GenerationStep, "status">[] = [
    { id: "context", name: "Construyendo contexto", description: "Analizando personalidad y respuestas..." },
    { id: "core-identity", name: "Generando identidad base", description: "Creando historia, promesa y valores..." },
    { id: "visual-identity", name: "Generando identidad visual", description: "Paleta de colores, tipografía y logos..." },
    { id: "voice-identity", name: "Generando voz de marca", description: "Tono, voz y ejemplos de messaging..." },
    { id: "gap-analysis", name: "Analizando componentes faltantes", description: "Identificando workspaces necesarios..." },
];

interface GenerationScreenProps {
    onComplete?: (result: PreIdentityGeneration) => void;
}

export default function GenerationScreen({ onComplete }: GenerationScreenProps) {
    const router = useRouter();
    const selectedIdentity = useSelectedIdentity();
    const questionnaireData = useQuestionnaireData();

    const { setGenerationStatus, setGeneratedIdentity, completeStage, goToStage } =
        useIdentityFlowStore();

    const [steps, setSteps] = useState<GenerationStep[]>(
        GENERATION_STEPS.map((s) => ({ ...s, status: "pending" }))
    );
    const [currentProgress, setCurrentProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(45);
    const [error, setError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);

    const allComplete = steps.every((s) => s.status === "complete" || s.status === "error");
    const hasErrors = steps.some((s) => s.status === "error");
    const currentStep = steps.find((s) => s.status === "in-progress");

    // Start generation on mount
    useEffect(() => {
        if (!selectedIdentity || !questionnaireData?.brand_name) {
            router.push("/identity");
            return;
        }

        startGeneration();
    }, []);

    const startGeneration = async () => {
        setGenerationStatus("generating");
        setError(null);

        if (!selectedIdentity || !questionnaireData?.brand_name) {
            setError("Faltan datos requeridos para la generación");
            setGenerationStatus("error");
            return;
        }

        try {
            // Call the generation API
            const response = await fetch("/api/identity/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identity_id: selectedIdentity.identity_id,
                    questionnaire_data: questionnaireData,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al iniciar la generación");
            }

            // Process streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No se pudo leer la respuesta");
            }

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = JSON.parse(line.slice(6));

                        handleStreamUpdate(data);
                    }
                }
            }

            // Generation complete
            setGenerationStatus("complete");
            completeStage(3);

        } catch (err: any) {
            console.error("Generation error:", err);
            setError(err.message || "Error en la generación");
            setGenerationStatus("error");

            // Mark current step as error
            setSteps((prev) =>
                prev.map((s) =>
                    s.status === "in-progress" ? { ...s, status: "error" } : s
                )
            );
        }
    };

    const handleStreamUpdate = (data: any) => {
        switch (data.type) {
            case "step_start":
                setSteps((prev) =>
                    prev.map((s) =>
                        s.id === data.step_id ? { ...s, status: "in-progress" } : s
                    )
                );
                break;

            case "step_complete":
                setSteps((prev) =>
                    prev.map((s) =>
                        s.id === data.step_id ? { ...s, status: "complete" } : s
                    )
                );
                break;

            case "step_error":
                setSteps((prev) =>
                    prev.map((s) =>
                        s.id === data.step_id ? { ...s, status: "error" } : s
                    )
                );
                break;

            case "progress":
                setCurrentProgress(data.percent || 0);
                setEstimatedTime(data.remaining_seconds || 0);
                break;

            case "complete":
                // Store the final result
                const result = data.result as PreIdentityGeneration;
                setGeneratedIdentity(result);
                if (onComplete) {
                    onComplete(result);
                }
                break;

            default:
                break;
        }
    };

    const handleRetry = () => {
        setIsRetrying(true);

        // Reset failed steps
        const resetSteps = steps.map((s) =>
            s.status === "error" ? { ...s, status: "pending" as const } : s
        );
        setSteps(resetSteps);

        // Restart from first pending
        setTimeout(() => {
            setIsRetrying(false);
            startGeneration();
        }, 1000);
    };

    const handleContinue = () => {
        goToStage(4);
        router.push("/identity/workspaces");
    };

    const handleEditQuestionnaire = () => {
        goToStage(2);
        router.push("/identity/questionnaire");
    };

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4"
                    >
                        {allComplete && !hasErrors ? (
                            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                        ) : hasErrors ? (
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--bm-color-accent)]/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[var(--bm-color-accent)] animate-spin" />
                            </div>
                        )}
                    </motion.div>

                    <h1 className="text-2xl font-light mb-2">
                        {allComplete && !hasErrors
                            ? "¡Identidad Generada!"
                            : hasErrors
                            ? "Error en la Generación"
                            : "Generando tu Identidad"}
                    </h1>

                    <p className="text-sm text-[var(--bm-color-text-secondary)]">
                        {allComplete && !hasErrors
                            ? `Tu marca "${questionnaireData?.brand_name}" está lista para personalizar`
                            : hasErrors
                            ? "Hubo un problema. Intenta de nuevo o edita el cuestionario."
                            : "Esto tomará aproximadamente un minuto"}
                    </p>
                </div>

                {/* Progress Bar */}
                {!allComplete && (
                    <div className="mb-8">
                        <div className="h-2 rounded-full overflow-hidden bg-[var(--bm-color-surface-muted)]">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[var(--bm-color-accent)] to-[var(--bm-color-accent-muted)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${currentProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-[var(--bm-color-text-secondary)]">
                            <span>{currentProgress}% completo</span>
                            <span>
                                {estimatedTime > 0
                                    ? `~${estimatedTime}s restantes`
                                    : "Casi listo..."}
                            </span>
                        </div>
                    </div>
                )}

                {/* Steps */}
                <div className="space-y-3 mb-8">
                    <AnimatePresence mode="popLayout">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-lg transition-colors",
                                    step.status === "in-progress" &&
                                        "bg-[var(--bm-color-surface-muted)]/50 border border-[var(--bm-color-accent)]/20",
                                    step.status === "complete" &&
                                        "bg-emerald-500/5 border border-emerald-500/10",
                                    step.status === "error" &&
                                        "bg-red-500/5 border border-red-500/10"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        step.status === "pending" &&
                                            "bg-[var(--bm-color-surface-muted)]",
                                        step.status === "in-progress" &&
                                            "bg-[var(--bm-color-accent)]",
                                        step.status === "complete" &&
                                            "bg-emerald-500",
                                        step.status === "error" && "bg-red-500"
                                    )}
                                >
                                    {step.status === "pending" && (
                                        <div className="w-2 h-2 rounded-full bg-[var(--bm-color-text-secondary)]/30" />
                                    )}
                                    {step.status === "in-progress" && (
                                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                                    )}
                                    {step.status === "complete" && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                    {step.status === "error" && (
                                        <AlertCircle className="w-3 h-3 text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div
                                        className={cn(
                                            "text-sm font-medium",
                                            step.status === "complete" &&
                                                "text-emerald-500",
                                            step.status === "error" && "text-red-500"
                                        )}
                                    >
                                        {step.name}
                                    </div>
                                    {step.description && (
                                        <div className="text-xs text-[var(--bm-color-text-secondary)] mt-0.5">
                                            {step.description}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {allComplete && !hasErrors && (
                        <button
                            onClick={handleContinue}
                            className="w-full py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-[var(--bm-button-primary-border)] bg-[var(--bm-button-primary-bg)] text-[var(--bm-button-primary-text)] hover:opacity-90"
                        >
                            Revisar y Completar Workspaces
                            <ChevronRight size={16} />
                        </button>
                    )}

                    {hasErrors && (
                        <>
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="w-full py-3 rounded-lg text-sm font-bold transition-colors border border-[var(--bm-color-accent)]/50 bg-[var(--bm-color-accent)]/10 text-[var(--bm-color-accent)] hover:opacity-90 disabled:opacity-50"
                            >
                                {isRetrying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                        Reintentando...
                                    </>
                                ) : (
                                    "Reintentar"
                                )}
                            </button>
                            <button
                                onClick={handleEditQuestionnaire}
                                className="w-full py-2 rounded-lg text-xs font-medium transition-colors text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
                            >
                                Editar Cuestionario
                            </button>
                        </>
                    )}

                    {!allComplete && !hasErrors && (
                        <button
                            onClick={handleEditQuestionnaire}
                            className="w-full py-2 rounded-lg text-xs font-medium transition-colors text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
