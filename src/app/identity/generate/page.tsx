/**
 * Identity Generation Page (Stage 3)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdentityFlowStore, useQuestionnaireData, useCurrentStage } from "@/lib/stores/identityFlowStore";
import GenerationScreen from "@/components/identity/GenerationScreen";
import type { PreIdentityGeneration } from "@/types/identity";

export default function GeneratePage() {
    const router = useRouter();
    const questionnaireData = useQuestionnaireData();
    const currentStage = useCurrentStage();

    // Redirect to stage 2 if no questionnaire data
    useEffect(() => {
        if (!questionnaireData?.brand_name) {
            router.push("/identity/questionnaire");
        }
    }, [questionnaireData, router]);

    const handleComplete = (result: PreIdentityGeneration) => {
        // Auto-redirect to workspaces after a brief delay
        setTimeout(() => {
            router.push("/identity/workspaces");
        }, 1500);
    };

    if (!questionnaireData?.brand_name) {
        return (
            <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] flex items-center justify-center">
                <p>Redirigiendo...</p>
            </div>
        );
    }

    return <GenerationScreen onComplete={handleComplete} />;
}
