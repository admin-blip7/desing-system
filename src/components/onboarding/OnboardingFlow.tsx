"use client";

import { useEffect, useState } from "react";
import PersonalitySelector from "./PersonalitySelector";
import OnboardingWizard from "./OnboardingWizard";
import { AnimatePresence, motion } from "framer-motion";
import { useBrandTheme } from "@/components/theme/BrandThemeProvider";

const ONBOARDING_DRAFT_KEY = "brand-manual:onboarding-draft:v1";

interface OnboardingFlowProps {
    initialPersonalityId?: string | null;
    initialFormData?: Record<string, unknown> | null;
}

export default function OnboardingFlow({ initialPersonalityId = null, initialFormData = null }: OnboardingFlowProps) {
    // Simple state machine: 'personality' -> 'wizard'
    const [step, setStep] = useState<"personality" | "wizard">(initialPersonalityId ? "wizard" : "personality");
    const [selectedPersonality, setSelectedPersonality] = useState<string | null>(initialPersonalityId);
    const { applyBrandTheme } = useBrandTheme();

    useEffect(() => {
        if (initialPersonalityId) {
            return;
        }

        try {
            const rawDraft = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
            if (!rawDraft) {
                return;
            }

            const draft = JSON.parse(rawDraft) as { values?: Record<string, unknown> };
            const draftPersonality = typeof draft?.values?.personalityId === "string" ? draft.values.personalityId : null;

            if (draftPersonality) {
                setSelectedPersonality(draftPersonality);
                setStep("wizard");
            }
        } catch {
            // Ignore corrupted drafts and continue with clean flow.
        }
    }, [initialPersonalityId]);

    useEffect(() => {
        if (!selectedPersonality) {
            applyBrandTheme("manual");
            return;
        }
        applyBrandTheme(selectedPersonality);
    }, [selectedPersonality, applyBrandTheme]);

    const handlePersonalitySelect = (personalityId: string) => {
        setSelectedPersonality(personalityId);
        setStep("wizard");
    };

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
            <AnimatePresence mode="wait">
                {step === "personality" && (
                    <motion.div
                        key="personality"
                        exit={{ opacity: 0, x: -50 }}
                        className="h-full"
                    >
                        <PersonalitySelector onSelect={handlePersonalitySelect} />
                    </motion.div>
                )}

                {step === "wizard" && (
                    <motion.div
                        key="wizard"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="py-12"
                    >
                        <OnboardingWizard personalityId={selectedPersonality} initialValues={initialFormData} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
