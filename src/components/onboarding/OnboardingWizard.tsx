"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { onboardingSteps, Question } from "@/lib/data/onboarding";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TagsInput } from "@/components/ui/TagsInput";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OnboardingWizardProps {
    personalityId: string | null;
    initialValues?: Record<string, unknown> | null;
    onComplete?: () => void;
}

interface WizardFormData {
    [key: string]: any;
    personalityId: string | null;
}

const ONBOARDING_DRAFT_KEY = "brand-manual:onboarding-draft:v1";

export default function OnboardingWizard({ personalityId, initialValues = null, onComplete }: OnboardingWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftHydrated, setDraftHydrated] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const baseDefaultValues = useMemo<WizardFormData>(
        () => ({
            ...(initialValues || {}),
            personalityId: personalityId ?? (initialValues?.personalityId as string | null) ?? null,
        }),
        [initialValues, personalityId],
    );

    const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm<WizardFormData>({
        defaultValues: baseDefaultValues
    });

    const steps = onboardingSteps;
    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    // Watch values for conditional logic and draft persistence
    const watchedValues = watch();

    useEffect(() => {
        reset(baseDefaultValues);
    }, [baseDefaultValues, reset]);

    useEffect(() => {
        try {
            const rawDraft = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
            if (!rawDraft) {
                setDraftHydrated(true);
                return;
            }

            const parsedDraft = JSON.parse(rawDraft) as { values?: Record<string, unknown>; step?: number };
            if (!parsedDraft || !parsedDraft.values) {
                setDraftHydrated(true);
                return;
            }

            const mergedValues: WizardFormData = {
                ...baseDefaultValues,
                ...parsedDraft.values,
                personalityId: personalityId ?? (parsedDraft.values.personalityId as string | null) ?? null,
            };

            reset(mergedValues);

            if (Number.isInteger(parsedDraft.step)) {
                const nextStep = Math.max(0, Math.min(steps.length - 1, Number(parsedDraft.step)));
                setCurrentStepIndex(nextStep);
            }
        } catch {
            // Ignore malformed local data.
        } finally {
            setDraftHydrated(true);
        }
    }, [baseDefaultValues, personalityId, reset, steps.length]);

    useEffect(() => {
        if (!draftHydrated) {
            return;
        }

        try {
            const draftPayload = {
                values: watchedValues,
                step: currentStepIndex,
                updatedAt: new Date().toISOString(),
            };
            window.localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draftPayload));
        } catch {
            // Ignore persistence issues in environments where localStorage is blocked.
        }
    }, [watchedValues, currentStepIndex, draftHydrated]);

    const handleNext = async (data: WizardFormData) => {
        if (isLastStep) {
            await onSubmit(data);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const onSubmit = async (data: WizardFormData) => {
        console.log("=== ONBOARDING SUBMIT ===");
        console.log("Form data:", data);
        console.log("Brand name:", data.brandName);

        setIsSubmitting(true);
        try {
            // Validate required field
            if (!data.brandName) {
                toast.error("El nombre de la marca es requerido");
                setIsSubmitting(false);
                return;
            }

            // 1. Get current user
            console.log("Checking authentication...");
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            console.log("Auth result - User:", user);
            console.log("Auth result - Error:", authError);

            if (!user) {
                console.error("No user found - redirecting to login");
                toast.error("Debes iniciar sesión para guardar tu marca");
                // Here we could save state to local storage and redirect to login
                setIsSubmitting(false);
                router.push('/login');
                return;
            }

            console.log("User authenticated:", user.id);

            // 2. Save to Supabase
            const brandData = {
                user_id: user.id,
                name: data.brandName,
                personality_id: personalityId,
                onboarding_data: data,
                slug: data.brandName.toLowerCase().replace(/\s+/g, '-'), // Simple slug generation
            };

            console.log("Creating brand with data:", brandData);

            const { data: brand, error } = await supabase
                .from("brands")
                .insert(brandData)
                .select()
                .single();

            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }

            console.log("Brand created successfully:", brand);

            try {
                window.localStorage.setItem(
                    ONBOARDING_DRAFT_KEY,
                    JSON.stringify({
                        values: {
                            ...data,
                            personalityId: personalityId ?? data.personalityId ?? null,
                        },
                        step: 0,
                        updatedAt: new Date().toISOString(),
                    }),
                );
            } catch {
                // Ignore local persistence failures.
            }

            toast.success("¡Marca creada exitosamente!");
            router.push(`/dashboard/brands/${brand.id}`);

            if (onComplete) onComplete();

        } catch (error: any) {
            console.error("Error creating brand:", error);
            toast.error(error.message || "Error al crear la marca");
        } finally {
            setIsSubmitting(false);
        }
    };

    const shouldShowQuestion = (question: Question) => {
        if (!question.condition) return true;

        // Simple condition parsing: "key=value" or "key!=value"
        // Does not support complex logic yet as per prototype
        // Using string manipulation instead of regex with s flag for safety
        let key = "", value = "";

        // Check if it is an inequality
        if (question.condition.includes("!=")) {
            [key, value] = question.condition.split("!=");
            return watchedValues[key] !== value;
        }

        if (question.condition.includes("=")) {
            [key, value] = question.condition.split("=");
        }

        if (key && value) {
            // Handle pipe separated values (OR logic) like "hasLogo=Sí, y me gusta|Sí, pero quiero mejorarlo"
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
                        animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
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
                        <div className="space-y-2">
                            <h2 className="text-2xl font-light text-[var(--bm-color-text-primary)]">{currentStep.name}</h2>
                        </div>

                        <div className="space-y-6">
                            {currentStep.questions.map((q) => {
                                if (!shouldShowQuestion(q)) return null;
                                return (
                                    <div key={q.key} className="space-y-3">
                                        <label className="block text-sm font-medium text-[var(--bm-color-text-primary)]">
                                            {q.q} {q.required && <span className="text-[var(--bm-color-danger)]">*</span>}
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
                                                {q.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
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
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    {...register(q.key, { required: q.required })}
                                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--bm-color-accent)] bg-[var(--bm-color-surface-muted)]"
                                                />
                                            </div>
                                        )}

                                        {q.type === "conditional" && (
                                            <div className="space-y-4">
                                                <select
                                                    {...register(q.key, { required: q.required })}
                                                    className={`${fieldBaseClass} appearance-none`}
                                                >
                                                    <option value="">Selecciona una opción</option>
                                                    {q.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>

                                                {/* Render FollowUp if condition met */}
                                                {q.followUp && watchedValues[q.key] === q.followUp.condition && (
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

                                        {/* File input placeholder */}
                                        {q.type === "file" && (
                                            <div className="border border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)]/45">
                                                <span className="text-sm text-[var(--bm-color-text-secondary)]">Click para subir archivo (Próximamente)</span>
                                            </div>
                                        )}

                                        {errors[q.key] && (
                                            <span className="text-xs text-[var(--bm-color-danger)]">Este campo es requerido</span>
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
                        onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
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
                        {isLastStep ? "Finalizar y Crear" : "Siguiente"}
                        {!isLastStep && <ChevronRight size={16} />}
                    </button>
                </div>
            </form>
        </div >
    );
}
