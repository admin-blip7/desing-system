import { ModuleType } from "@/lib/data/module-types";

export interface WorkspaceRegistryItem {
    key: string;
    path: string;
    type: ModuleType;
    category: "essential" | "identity" | "visual" | "ui-kit" | "digital" | "physical" | "experience" | "distribution";
}

export const workspaceRegistry: Record<string, WorkspaceRegistryItem> = {
    // Phase 1: Essential
    designTokens: {
        key: "designTokens",
        path: "/workspace/design-tokens",
        type: "workspace",
        category: "essential"
    },
    logo: {
        key: "logo",
        path: "/workspace/logo",
        type: "workspace",
        category: "essential"
    },
    colorPalette: {
        key: "colorPalette",
        path: "/workspace/color-palette",
        type: "workspace",
        category: "essential"
    },
    typography: {
        key: "typography",
        path: "/workspace/typography",
        type: "workspace",
        category: "essential"
    },
    uiKit: {
        key: "uiKit",
        path: "/workspace/ui-kit",
        type: "workspace",
        category: "essential"
    },

    // Existing
    voiceTone: {
        key: "voiceTone",
        path: "/workspace/voice-tone",
        type: "workspace",
        category: "identity"
    }
};

export function getWorkspacePath(moduleKey: string): string | null {
    return workspaceRegistry[moduleKey]?.path || null;
}
