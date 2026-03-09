/**
 * Identity Selection Page (Stage 1)
 * Entry point for the identity generation flow
 */

"use client";

import { useEffect } from "react";
import PersonalitySelector from "@/components/onboarding/PersonalitySelector";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useCurrentStage,
} from "@/lib/stores/identityFlowStore";
import { personalities } from "@/lib/data/personalities";
import type { SelectedIdentity } from "@/types/identity";

export default function IdentityPage() {
    const router = useRouter();
    const currentStage = useCurrentStage();
    const { setSelectedIdentity, goToStage, completeStage } = useIdentityFlowStore();

    const handleIdentitySelect = (personalityId: string) => {
        const personality = personalities.find((p) => p.id === personalityId);
        if (!personality) return;

        const selectedIdentity: SelectedIdentity = {
            identity_id: personality.id,
            identity_name: personality.name,
            archetype: personality.archetype,
            base_keywords: personality.keyPrinciples.slice(0, 3),
            visual_style: personality.dna?.typography?.style || "minimal",
            personality_traits: {},
            reference_brands: personality.ideal.slice(0, 2),
            color_harmony_pref: "monochromatic",
            typography_pref: "sans-serif",
            personality_data: personality,
        };

        setSelectedIdentity(selectedIdentity);
        completeStage(1);
        goToStage(2);
        router.push("/identity/questionnaire");
    };

    // If already past stage 1, redirect appropriately
    useEffect(() => {
        if (currentStage > 1) {
            router.push(`/identity/questionnaire`);
        }
    }, [currentStage, router]);

    return (
        <PersonalitySelector onSelect={handleIdentitySelect} />
    );
}
