/**
 * Identity Questionnaire Page (Stage 2)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdentityFlowStore, useSelectedIdentity, useCurrentStage } from "@/lib/stores/identityFlowStore";
import IdentityQuestionnaireWizard from "@/components/identity/IdentityQuestionnaireWizard";
import type { QuestionnaireData } from "@/types/identity";

export default function QuestionnairePage() {
    const router = useRouter();
    const selectedIdentity = useSelectedIdentity();
    const currentStage = useCurrentStage();
    const { goToStage } = useIdentityFlowStore();

    // Redirect to stage 1 if no identity selected
    useEffect(() => {
        if (!selectedIdentity) {
            router.push("/identity");
        }
    }, [selectedIdentity, router]);

    const handleComplete = (data: QuestionnaireData) => {
        goToStage(3);
        router.push("/identity/generate");
    };

    if (!selectedIdentity) {
        return (
            <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] flex items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] py-10">
            <IdentityQuestionnaireWizard
                identityId={selectedIdentity.identity_id}
                onComplete={handleComplete}
            />
        </div>
    );
}
