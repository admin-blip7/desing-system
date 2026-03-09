/**
 * Identity Questionnaire Wizard
 * Extends the OnboardingWizard pattern for the identity flow
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { identityQuestionnaireSteps, Question } from "@/lib/data/identity-questions";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TagsInput } from "@/components/ui/TagsInput";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useSelectedIdentity,
    useQuestionnaireData,
} from "@/lib/stores/identityFlowStore";
import type { QuestionnaireData, SelectedIdentity } from "@/types/identity";

interface IdentityQuestionnaireWizardProps {
    identityId: string;
    onComplete?: (data: QuestionnaireData) => void;
}

interface WizardFormData {
    [key: string]: any;
}

const QUESTIONNAIRE_DRAFT_KEY = "brand-manual:identity-questionnaire-draft:v1";

export default function IdentityQuestionnaireWizard({
    identityId,
    onComplete,
}: IdentityQuestionnaireWizardProps) {
    const router = useRouter();
    const selectedIdentity = useSelectedIdentity();
    const existingData = useQuestionnaireData();
    const {
        setQuestionnaireData,
        setQuestionnaireStep,
        goToStage,
        completeStage,
    } = useIdentityFlowStore();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftHydrated, setDraftHydrated] = useState(false);

    const steps = identityQuestionnaireSteps;

    const baseDefaultValues = useMemo<WizardFormData>(
        () => ({
            ...(existingData || {}),
            identity_id: identityId,
        }),
        [existingData, identityId]
    );

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<WizardFormData>({
        defaultValues: baseDefaultValues,
    });

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    // Watch values for conditional logic and draft persistence
    const watchedValues = watch();

    // Hydrate from draft
    useEffect(() => {
        try {
            const rawDraft = localStorage.getItem(QUESTIONNAIRE_DRAFT_KEY);
            if (!rawDraft) {
                setDraftHydrated(true);
                return;
            }

            const parsedDraft = JSON.parse(rawDraft) as {
                values?: Record<string, unknown>;
                step?: number;
            };
            if (!parsedDraft || !parsedDraft.values) {
                setDraftHydrated(true);
                return;
            }

            const mergedValues: WizardFormData = {
                ...baseDefaultValues,
                ...parsedDraft.values,
                identity_id: identityId,
            };

            reset(mergedValues);

            if (Number.isInteger(parsedDraft.step)) {
                const nextStep = Math.max(
                    0,
                    Math.min(steps.length - 1, Number(parsedDraft.step))
                );
                setCurrentStepIndex(nextStep);
            }
        } catch {
            // Ignore malformed data
        } finally {
            setDraftHydrated(true);
        }
    }, [baseDefaultValues, identityId, reset, steps.length]);

    // Save draft on changes
    useEffect(() => {
        if (!draftHydrated) return;

        try {
            const draftPayload = {
                values: watchedValues,
                step: currentStepIndex,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem(
                QUESTIONNAIRE_DRAFT_KEY,
                JSON.stringify(draftPayload)
            );
        } catch {
            // Ignore persistence issues
        }
    }, [watchedValues, currentStepIndex, draftHydrated]);

    // Sync with Zustand store
    useEffect(() => {
        setQuestionnaireStep(currentStepIndex);
    }, [currentStepIndex, setQuestionnaireStep]);

    const handleNext = async (data: WizardFormData) => {
        // Update store with current data
        setQuestionnaireData(data as Partial<QuestionnaireData>);

        if (isLastStep) {
            await onSubmit(data as QuestionnaireData);
        } else {
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const onSubmit = async (data: QuestionnaireData) => {
        console.log("=== IDENTITY QUESTIONNAIRE SUBMIT ===");
        console.log("Form data:", data);

        setIsSubmitting(true);
        try {
            // Validate required fields
            if (!data.brand_name) {
                toast.error("El nombre de la marca es requerido");
                setIsSubmitting(false);
                return;
            }

            if (!data.brand_description || data.brand_description.length < 10) {
                toast.error("La descripción de la marca debe tener al menos 10 caracteres");
                setIsSubmitting(false);
                return;
            }

            // Complete stage 2
            completeStage(2);

            // Clear draft
            try {
                localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY);
            } catch {
                // Ignore
            }

            toast.success("Cuestionario completado. Generando identidad...");

            // Call completion callback
            if (onComplete) {
                onComplete(data);
            } else {
                // Default: go to generation stage
                goToStage(3);
                router.push("/identity/generate");
            }
        } catch (error: any) {
            console.error("Error submitting questionnaire:", error);
            toast.error(error.message || "Error al procesar el cuestionario");
        } finally {
            setIsSubmitting(false);
        }
    };

    const shouldShowQuestion = (question: Question): boolean => {
        if (!question.condition) return true;

        // Simple condition parsing
        let key = "",
            value = "";

        if (question.condition.includes("!=")) {
            [key, value] = question.condition.split("!=");
            return watchedValues[key] !== value;
        }

        if (question.condition.includes("=")) {
            [key, value] = question.condition.split("=");
        }

        if (key && value) {
            if (value.includes("|")) {
                const possibleValues = value.split("|");
                return possibleValues.includes(watchedValues[key]);
            }
            return watchedValues[key] === value;
        }

        return true;
    };

    const fieldBaseClass =
        "w-full rounded-md px-4 py-3 transition-all outline-none bg-[var(--bm-input-bg)] border border-[var(--bm-input-border)] text-[var(--bm-input-text)] focus:ring-1 focus:ring-[var(--bm-input-focus-ring)]/60 focus:border-[var(--bm-input-focus-ring)]";

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Identity Summary Badge */}
            {selectedIdentity && (
                <div className="mb-6 flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--bm-color-surface-muted)]/30 border border-[var(--bm-color-border)]">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: selectedIdentity.personality_data?.color }}
                    />
                    <span className="text-xs text-[var(--bm-color-text-secondary)]">
                        Basado en:{" "}
                        <span className="font-medium text-[var(--bm-color-text-primary)]">
                            {selectedIdentity.identity_name}
                        </span>
                    </span>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs mb-2 uppercase tracking-wide font-medium text-[var(--bm-color-text-secondary)]">
                    <span>Paso {currentStepIndex + 1} de {steps.length}</span>
                    <span>{currentStep.name}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-[var(--bm-color-surface-muted)]">
                    <motion.div
                        className="h-full bg-[var(--bm-color-accent)]"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit(handleNext)}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {currentStep.description && (
                            <p className="text-sm text-[var(--bm-color-text-secondary)]">
                                {currentStep.description}
                            </p>
                        )}

                        <div className="space-y-6">
                            {currentStep.questions.map((q) => {
                                if (!shouldShowQuestion(q)) return null;

                                return (
                                    <div key={q.key} className="space-y-3">
                                        <label className="block text-sm font-medium text-[var(--bm-color-text-primary)]">
                                            {q.q}{" "}
                                            {q.required && (
                                                <span className="text-[var(--bm-color-danger)]">*</span>
                                            )}
                                        </label>

                                        {/* Render inputs based on type */}
                                        {q.type === "text" && (
                                            <input
                                                {...register(q.key, { required: q.required })}
                                                className={fieldBaseClass}
                                                placeholder={q.example}
                                            />
                                        )}

                                        {q.type === "textarea" && (
                                            <textarea
                                                {...register(q.key, { required: q.required })}
                                                className={`${fieldBaseClass} min-h-[100px]`}
                                                placeholder={q.example}
                                            />
                                        )}

                                        {q.type === "select" && (
                                            <select
                                                {...register(q.key, { required: q.required })}
                                                className={`${fieldBaseClass} appearance-none`}
                                            >
                                                <option value="">Selecciona una opción</option>
                                                {q.options?.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {q.type === "multi-select" && (
                                            <Controller
                                                control={control}
                                                name={q.key}
                                                rules={{ required: q.required }}
                                                render={({ field }) => (
                                                    <MultiSelect
                                                        options={q.options || []}
                                                        selected={field.value || []}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                        )}

                                        {q.type === "tags" && (
                                            <Controller
                                                control={control}
                                                name={q.key}
                                                rules={{ required: q.required }}
                                                render={({ field }) => (
                                                    <TagsInput
                                                        tags={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder={q.example}
                                                    />
                                                )}
                                            />
                                        )}

                                        {q.type === "range" && (
                                            <div className="space-y-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    {...register(q.key, { required: q.required })}
                                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--bm-color-accent)] bg-[var(--bm-color-surface-muted)]"
                                                />
                                                <div className="flex justify-between text-xs text-[var(--bm-color-text-secondary)]">
                                                    <span>Sutil</span>
                                                    <span>Audaz</span>
                                                </div>
                                            </div>
                                        )}

                                        {q.type === "conditional" && (
                                            <div className="space-y-4">
                                                <select
                                                    {...register(q.key, { required: q.required })}
                                                    className={`${fieldBaseClass} appearance-none`}
                                                >
                                                    <option value="">Selecciona una opción</option>
                                                    {q.options?.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>

                                                {q.followUp &&
                                                    watchedValues[q.key] === q.followUp.condition && (
                                                        <div className="pl-4 border-l-2 space-y-2 animate-in fade-in slide-in-from-top-2 border-[var(--bm-color-accent)]/30">
                                                            <label className="block text-sm font-medium text-[var(--bm-color-text-primary)]">
                                                                {q.followUp.q}
                                                            </label>
                                                            <input
                                                                {...register(q.followUp.key)}
                                                                className={fieldBaseClass}
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        )}

                                        {errors[q.key] && (
                                            <span className="text-xs text-[var(--bm-color-danger)]">
                                                Este campo es requerido
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-10 pt-6 border-t border-[var(--bm-color-border)]">
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                            // Update store
                            if (currentStepIndex > 0) {
                                setQuestionnaireData(watchedValues as Partial<QuestionnaireData>);
                            }
                        }}
                        disabled={currentStepIndex === 0}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-30 text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] disabled:hover:text-[var(--bm-color-text-secondary)]"
                    >
                        <ChevronLeft size={16} />
                        Anterior
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-[var(--bm-button-primary-border)] bg-[var(--bm-button-primary-bg)] text-[var(--bm-button-primary-text)] hover:opacity-90"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                        {isLastStep ? "Generar Identidad" : "Siguiente"}
                        {!isLastStep && <ChevronRight size={16} />}
                    </button>
                </div>

                {/* Save & Exit */}
                <button
                    type="button"
                    onClick={() => {
                        setQuestionnaireData(watchedValues as Partial<QuestionnaireData>);
                        router.push("/dashboard");
                    }}
                    className="w-full mt-4 text-xs text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] transition-colors"
                >
                    Guardar y continuar después
                </button>
            </form>
        </div>
    );
}
