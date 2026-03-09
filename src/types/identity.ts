/**
 * Identity Flow Types
 * Extends existing BrandPersonality and Question types from @/lib/data
 */

import type { BrandPersonality } from "@/lib/data/personalities";

// ============================================================================
// STAGE 1: Identity Selection
// ============================================================================

export type IdentityViewMode = "grid" | "compare" | "flow";

export interface SelectedIdentity {
    identity_id: string;
    identity_name: string;
    archetype: string;
    base_keywords: string[];
    visual_style: string;
    personality_traits: Record<string, number>;
    reference_brands: string[];
    color_harmony_pref: "monochromatic" | "analogous" | "complementary" | "triadic" | "split-complementary" | "custom";
    typography_pref: "sans-serif" | "serif" | "mixed" | "display" | "monospace";
    // Extend BrandPersonality data
    personality_data?: BrandPersonality;
}

// ============================================================================
// STAGE 2: Questionnaire Data
// ============================================================================

export interface QuestionnaireData {
    // Brand Foundation
    brand_name: string;
    tagline?: string;
    brand_description: string;
    industry: string;

    // Identity Customization
    intensity_level: number; // 0-100
    emphasized_traits: string[];
    reference_brands: string[];
    custom_keywords: string[];

    // Target Audience
    audience_description: string;
    audience_age_range: string;
    audience_professional_level: string[];

    // Visual Preferences
    color_palette_preference?: string;
    typography_preference?: string;
    uploaded_inspirations: string[]; // URLs

    // Application Context
    primary_touchpoints: PrimaryTouchpoint[];
    primary_goal: "consistency" | "flexibility" | "speed";

    // Metadata
    identity_id: string; // Links to Stage 1
    completed_at?: string;
}

export type PrimaryTouchpoint =
    | "website-app"
    | "social-media"
    | "physical-print"
    | "product-packaging"
    | "email-marketing"
    | "physical-store"
    | "customer-support"
    | "product-delivery";

// ============================================================================
// STAGE 3: Pre-Identity Generation
// ============================================================================

export interface CoreIdentity {
    brand_story: string;
    brand_promise: string;
    value_proposition: string;
    personality_keywords: string[];
    brand_attributes: {
        primary: string[];
        secondary: string[];
    };
}

export interface Color {
    hex: string;
    name: string;
    role: "primary" | "secondary" | "accent" | "neutral";
}

export interface Typography {
    heading_family: string;
    heading_weight: string;
    body_family: string;
    body_weight: string;
    accent_family?: string;
    scale: number[]; // type scale
}

export interface LogoConcept {
    id: string;
    description: string;
    style: string;
    preview_url?: string;
}

export interface VisualIdentity {
    color_palette: Color[];
    typography_system: Typography;
    logo_concepts: LogoConcept[];
    imagery_style: string;
    layout_principles: string[];
}

export interface ToneProfile {
    formal_casual: number; // 0-100
    serious_playful: number;
    traditional_modern: number;
}

export interface VoiceGuidelineExample {
    context: string;
    do_example: string;
    dont_example: string;
}

export interface MessageExample {
    channel: string;
    context: string;
    example: string;
}

export interface VoiceIdentity {
    tone_profile: ToneProfile;
    voice_guidelines: string;
    characteristics: string[];
    guidelines: VoiceGuidelineExample[];
    messaging_examples: MessageExample[];
}

export interface GapAnalysis {
    complete: string[]; // Generated components
    partial: string[]; // Need refinement
    missing: string[]; // Need workspace completion
    recommended_workspaces: WorkspaceType[];
}

export interface PreIdentityGeneration {
    id: string;
    brand_id: string;
    generation_config: {
        identity_id: string;
        questionnaire_data: QuestionnaireData;
        timestamp: string;
    };
    generated_content: {
        core_identity: CoreIdentity;
        visual_identity: VisualIdentity;
        voice_identity: VoiceIdentity;
    };
    gap_analysis: GapAnalysis;
    status: "generating" | "complete" | "error";
    error_message?: string;
    completed_at?: string;
}

// ============================================================================
// STAGE 4: Workspace Types
// ============================================================================

export type WorkspaceType =
    | "visual-identity"
    | "brand-voice"
    | "experience-design"
    | "social-media-kit"
    | "print-templates"
    | "digital-ui-kit"
    | "packaging-design"
    | "internal-brand-guide";

export interface VisualIdentityWorkspace {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        neutrals: string[];
    };
    typography: {
        heading_family: string;
        body_family: string;
        accent_family?: string;
        scale: string[];
    };
    logo: {
        selected_concept: string;
        customizations: Record<string, unknown>;
        variations: string[];
    };
    visual_guidelines: {
        imagery_style: string;
        layout_principles: string[];
        do_dont: { do: string[]; dont: string[] };
    };
}

export interface BrandVoiceWorkspace {
    tone_spectrum: {
        formal_casual: number;
        serious_playful: number;
        traditional_modern: number;
    };
    characteristics: string[]; // max 5
    guidelines: {
        principles: string[];
        examples: {
            context: string;
            do_example: string;
            dont_example: string;
        }[];
    };
    messaging: {
        taglines: string[];
        headlines: string[];
        email_templates: Record<string, string>;
        social_media_captions: string[];
    };
}

export interface ExperienceDesignWorkspace {
    touchpoints: PrimaryTouchpoint[];
    experience_principles: string[];
    touchpoint_flows: {
        touchpoint: string;
        user_goal: string;
        brand_behavior: string;
        emotional_target: string;
        pain_points: string[];
        delight_opportunities: string[];
    }[];
}

export interface WorkspaceFlowState {
    current_workspace: WorkspaceType | null;
    completed_workspaces: WorkspaceType[];
    available_workspaces: WorkspaceType[];
    workspace_data: Partial<
        Record<
            WorkspaceType,
            VisualIdentityWorkspace | BrandVoiceWorkspace | ExperienceDesignWorkspace
        >
    >;
    can_proceed_to_integrations: boolean;
    progress_percentage: number;
}

// ============================================================================
// STAGE 5: Integration Types
// ============================================================================

export type IntegrationType =
    | "export-pdf"
    | "export-html"
    | "export-tokens"
    | "figma"
    | "notion"
    | "adobe-cc"
    | "webflow"
    | "canva"
    | "shopify";

export interface IntegrationSelection {
    selected_integrations: IntegrationType[];
    export_preferences: {
        formats: ("pdf" | "html" | "json" | "css")[];
        include_sections: string[];
    };
    tool_connections: {
        tool: string;
        connected: boolean;
        sync_settings: Record<string, unknown>;
    }[];
    next_actions: string[];
    completion_timestamp?: string;
}

// ============================================================================
// Flow State (for Zustand store)
// ============================================================================

export type GenerationStatus = "idle" | "generating" | "complete" | "error";

export interface IdentityFlowState {
    // Stage tracking
    current_stage: number;
    completed_stages: number[];

    // Stage 1: Identity Selection
    selected_identity: SelectedIdentity | null;

    // Stage 2: Questionnaire
    questionnaire_data: Partial<QuestionnaireData>;
    questionnaire_step: number;

    // Stage 3: Generation
    generation_status: GenerationStatus;
    generated_identity: PreIdentityGeneration | null;

    // Stage 4: Workspaces
    workspace_flow: WorkspaceFlowState;

    // Stage 5: Integrations
    integration_selection: IntegrationSelection | null;

    // Brand ID (once created)
    brand_id: string | null;

    // Draft persistence
    last_updated: string | null;
}

export interface IdentityFlowActions {
    // Stage navigation
    goToStage: (stage: number) => void;
    completeStage: (stage: number) => void;

    // Stage 1 actions
    setSelectedIdentity: (identity: SelectedIdentity | null) => void;

    // Stage 2 actions
    setQuestionnaireData: (data: Partial<QuestionnaireData>) => void;
    setQuestionnaireStep: (step: number) => void;

    // Stage 3 actions
    setGenerationStatus: (status: GenerationStatus) => void;
    setGeneratedIdentity: (identity: PreIdentityGeneration | null) => void;

    // Stage 4 actions
    setWorkspaceFlow: (flow: WorkspaceFlowState) => void;
    updateWorkspaceData: <T extends WorkspaceType>(
        workspace: T,
        data: WorkspaceFlowState["workspace_data"][T]
    ) => void;
    completeWorkspace: (workspace: WorkspaceType) => void;

    // Stage 5 actions
    setIntegrationSelection: (selection: IntegrationSelection | null) => void;

    // Brand
    setBrandId: (id: string | null) => void;

    // Draft management
    saveDraft: () => void;
    loadDraft: () => boolean;
    clearDraft: () => void;
    reset: () => void;
}

// ============================================================================
// Storage Keys
// ============================================================================

export const IDENTITY_DRAFT_KEY = "brand-manual:identity-draft:v1";
export const IDENTITY_SELECTION_KEY = "brand-manual:identity-selection:v1";
export const IDENTITY_QUESTIONNAIRE_KEY = "brand-manual:identity-questionnaire:v1";

// ============================================================================
// API Response Types
// ============================================================================

export interface IdentityGenerateRequest {
    identity_id: string;
    questionnaire_data: QuestionnaireData;
}

export interface IdentityGenerateResponse {
    success: boolean;
    generation_id?: string;
    error?: string;
}
