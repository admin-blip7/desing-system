/**
 * Identity Data Reference
 * Maps personality IDs to identity generation data
 */

import { personalities, type BrandPersonality } from "@/lib/data/personalities";

// Export personalities as identities for the generation system
export { personalities };

// Create a lookup map for easy access
export const identities: Record<string, BrandPersonality> = {};

personalities.forEach((p) => {
    identities[p.id] = p;
});

// Identity-specific generation templates
export const identityTemplates = {
    apple: {
        colorHarmony: "monochromatic",
        defaultColors: ["#000000", "#ffffff", "#0071E3", "#f5f5f7"],
        typographyStyle: "sans-serif",
        voiceCharacteristics: ["confident", "minimal", "innovative"],
    },
    "teenage-engineering": {
        colorHarmony: "complementary",
        defaultColors: ["#1a1714", "#ffffff", "#FF6B35", "#f5f0eb"],
        typographyStyle: "monospace",
        voiceCharacteristics: ["playful", "technical", "direct"],
    },
    polestar: {
        colorHarmony: "monochromatic",
        defaultColors: ["#ffffff", "#000000", "#999999", "#fafaFA"],
        typographyStyle: "sans-serif",
        voiceCharacteristics: ["minimal", "quiet", "refined"],
    },
    linear: {
        colorHarmony: "analogous",
        defaultColors: ["#0A0A12", "#E2E8F0", "#5E6AD2", "#1e293b"],
        typographyStyle: "sans-serif",
        voiceCharacteristics: ["concise", "technical", "efficient"],
    },
    "bang-olufsen": {
        colorHarmony: "analogous",
        defaultColors: ["#0F0C08", "#E8DDD0", "#C9A96E", "#4a3728"],
        typographyStyle: "serif",
        voiceCharacteristics: ["luxurious", "sensory", "timeless"],
    },
    nothing: {
        colorHarmony: "monochromatic",
        defaultColors: ["#ffffff", "#000000", "#FF0000", "#e0e0e0"],
        typographyStyle: "monospace",
        voiceCharacteristics: ["rebellious", "transparent", "bold"],
    },
    aesop: {
        colorHarmony: "analogous",
        defaultColors: ["#FAF6F1", "#2C2416", "#8B7355", "#c4956a"],
        typographyStyle: "serif",
        voiceCharacteristics: ["cultured", "botanical", "refined"],
    },
};

export type IdentityId = keyof typeof identityTemplates;

export function getIdentityTemplate(id: string): typeof identityTemplates[IdentityId] {
    return identityTemplates[id as IdentityId] || identityTemplates.apple;
}
