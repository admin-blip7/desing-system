/**
 * Identity Generation API Route
 * Generates a preliminary design identity using AI
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { identities } from "@/lib/data/identities";
import type {
    CoreIdentity,
    VisualIdentity,
    VoiceIdentity,
    GapAnalysis,
    PreIdentityGeneration,
    QuestionnaireData,
    IdentityGenerateRequest,
} from "@/types/identity";

// Rate limiting (simple in-memory, would use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = rateLimit.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimit.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}

// Helper function to generate SSE stream
async function* streamGeneration(
    identityId: string,
    questionnaireData: QuestionnaireData
): AsyncGenerator<string, void, unknown> {
    const generationId = `gen_${Date.now()}`;

    try {
        // Step 1: Context Building
        yield `data: ${JSON.stringify({ type: "step_start", step_id: "context" })}\n\n`;
        await new Promise((resolve) => setTimeout(resolve, 500));

        const context = await buildContext(identityId, questionnaireData);
        yield `data: ${JSON.stringify({ type: "step_complete", step_id: "context" })}\n\n`;
        yield `data: ${JSON.stringify({ type: "progress", percent: 20, remaining_seconds: 35 })}\n\n`;

        // Step 2: Core Identity Generation
        yield `data: ${JSON.stringify({ type: "step_start", step_id: "core-identity" })}\n\n`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const coreIdentity = await generateCoreIdentity(context, identityId);
        yield `data: ${JSON.stringify({ type: "step_complete", step_id: "core-identity" })}\n\n`;
        yield `data: ${JSON.stringify({ type: "progress", percent: 40, remaining_seconds: 25 })}\n\n`;

        // Step 3: Visual Identity Generation
        yield `data: ${JSON.stringify({ type: "step_start", step_id: "visual-identity" })}\n\n`;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const visualIdentity = await generateVisualIdentity(context, coreIdentity);
        yield `data: ${JSON.stringify({ type: "step_complete", step_id: "visual-identity" })}\n\n`;
        yield `data: ${JSON.stringify({ type: "progress", percent: 60, remaining_seconds: 15 })}\n\n`;

        // Step 4: Voice & Tone Generation
        yield `data: ${JSON.stringify({ type: "step_start", step_id: "voice-identity" })}\n\n`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const voiceIdentity = await generateVoiceIdentity(context, coreIdentity);
        yield `data: ${JSON.stringify({ type: "step_complete", step_id: "voice-identity" })}\n\n`;
        yield `data: ${JSON.stringify({ type: "progress", percent: 80, remaining_seconds: 8 })}\n\n`;

        // Step 5: Gap Analysis
        yield `data: ${JSON.stringify({ type: "step_start", step_id: "gap-analysis" })}\n\n`;
        await new Promise((resolve) => setTimeout(resolve, 800));
        const gapAnalysis = await performGapAnalysis(
            { core_identity: coreIdentity, visual_identity: visualIdentity, voice_identity: voiceIdentity },
            questionnaireData
        );
        yield `data: ${JSON.stringify({ type: "step_complete", step_id: "gap-analysis" })}\n\n`;
        yield `data: ${JSON.stringify({ type: "progress", percent: 95, remaining_seconds: 2 })}\n\n`;

        // Complete
        const result: PreIdentityGeneration = {
            id: generationId,
            brand_id: "", // Will be set when brand is created
            generation_config: {
                identity_id: identityId,
                questionnaire_data: questionnaireData,
                timestamp: new Date().toISOString(),
            },
            generated_content: {
                core_identity: coreIdentity,
                visual_identity: visualIdentity,
                voice_identity: voiceIdentity,
            },
            gap_analysis: gapAnalysis,
            status: "complete",
            completed_at: new Date().toISOString(),
        };

        yield `data: ${JSON.stringify({ type: "progress", percent: 100, remaining_seconds: 0 })}\n\n`;
        yield `data: ${JSON.stringify({ type: "complete", result })}\n\n`;

    } catch (error: any) {
        yield `data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`;
    }
}

// Context building
async function buildContext(
    identityId: string,
    questionnaireData: QuestionnaireData
): Promise<any> {
    const identity = identities[identityId as keyof typeof identities];

    return {
        identity: identity || identities.apple,
        questionnaire: questionnaireData,
        personality_profile: identity?.keyPrinciples || [],
        similar_brands: questionnaireData.reference_brands || [],
    };
}

// Core Identity Generation
async function generateCoreIdentity(
    context: any,
    identityId: string
): Promise<CoreIdentity> {
    const identity = identities[identityId as keyof typeof identities] || identities.apple;

    // Mock generation - in production this would call OpenAI API
    return {
        brand_story: `${context.questionnaire.brand_name} nace con la misión de ${context.questionnaire.brand_description.toLowerCase()}. Inspirado en la filosofía ${identity.archetype}, nuestro enfoque combina ${identity.keyPrinciples.slice(0, 3).join(", ")} para crear experiencias memorables.`,
        brand_promise: `Entregamos ${context.questionnaire.emphasized_traits?.[0] || "calidad"} y ${context.questionnaire.emphasized_traits?.[1] || "innovación"} en cada interacción.`,
        value_proposition: `Para ${context.questionnaire.audience_description?.toLowerCase() || "nuestros clientes"}, creamos soluciones que ${context.questionnaire.custom_keywords?.[0] || "marcan la diferencia"}.`,
        personality_keywords: context.questionnaire.emphasized_traits || identity.keyPrinciples,
        brand_attributes: {
            primary: [context.questionnaire.custom_keywords?.[0] || "Innovación", context.questionnaire.custom_keywords?.[1] || "Calidad"],
            secondary: [context.questionnaire.custom_keywords?.[2] || "Confianza", context.questionnaire.custom_keywords?.[3] || "Servicio"],
        },
    };
}

// Visual Identity Generation
async function generateVisualIdentity(
    context: any,
    coreIdentity: CoreIdentity
): Promise<VisualIdentity> {
    const identity = context.identity;

    // Generate colors based on identity
    const baseColors = identity.cssPreview
        ? {
              primary: identity.cssPreview.background,
              foreground: identity.cssPreview.foreground,
              accent: identity.cssPreview.accent,
          }
        : {
              primary: "#1a1a2e",
              foreground: "#ffffff",
              accent: "#e94560",
          };

    return {
        color_palette: [
            { hex: baseColors.primary, name: "Primary", role: "primary" },
            { hex: baseColors.foreground, name: "Secondary", role: "secondary" },
            { hex: baseColors.accent, name: "Accent", role: "accent" },
            { hex: "#f5f5f5", name: "Light", role: "neutral" },
            { hex: "#e0e0e0", name: "Medium", role: "neutral" },
        ],
        typography_system: {
            heading_family: identity.cssPreview?.fontFamily?.split(",")[0].replace(/['"]/g, "") || "Inter",
            heading_weight: "600",
            body_family: "Inter",
            body_weight: "400",
            scale: [12, 14, 16, 20, 24, 32, 48, 64],
        },
        logo_concepts: [
            {
                id: "concept_1",
                description: "Logotipo tipográfico limpio",
                style: "minimal",
            },
            {
                id: "concept_2",
                description: "Logomarca minimalista",
                style: "minimal",
            },
        ],
        imagery_style: identity.dna?.photography?.style || "Clean product photography",
        layout_principles: identity.dna?.layout ? [identity.dna.layout.grid, identity.dna.layout.spacing] : ["Grid-based", "Generous spacing"],
    };
}

// Voice Identity Generation
async function generateVoiceIdentity(
    context: any,
    coreIdentity: CoreIdentity
): Promise<VoiceIdentity> {
    const intensity = context.questionnaire.intensity_level || 50;

    return {
        tone_profile: {
            formal_casual: 50 + (intensity > 50 ? 20 : -20),
            serious_playful: intensity,
            traditional_modern: 50 + (intensity > 50 ? 30 : -10),
        },
        voice_guidelines: coreIdentity.brand_story,
        characteristics: context.questionnaire.emphasized_traits || ["Confident", "Direct", "Friendly"],
        guidelines: [
            {
                context: "Customer service",
                do_example: "¡Hola! Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?",
                dont_example: "Buenas, ¿qué quieres?",
            },
            {
                context: "Product description",
                do_example: "Diseñado con precisión para entregarte resultados excepcionales.",
                dont_example: "Es bueno y barato.",
            },
        ],
        messaging_examples: [
            {
                channel: "email",
                context: "Welcome",
                example: `Bienvenido a ${context.questionnaire.brand_name}. Estamos emocionados de tenerte con nosotros.`,
            },
            {
                channel: "social",
                context: "Post",
                example: `${coreIdentity.brand_attributes.primary[0]} en cada detalle. #${context.questionnaire.brand_name?.replace(/\s+/g, "")}`,
            },
        ],
    };
}

// Gap Analysis
async function performGapAnalysis(
    generated: { core_identity: CoreIdentity; visual_identity: VisualIdentity; voice_identity: VoiceIdentity },
    questionnaireData: QuestionnaireData
): Promise<GapAnalysis> {
    const complete: string[] = [
        "brand_story",
        "brand_promise",
        "color_palette",
        "typography_system",
        "tone_profile",
    ];

    const partial: string[] = [
        "logo_concepts",
        "messaging_examples",
    ];

    const missing: string[] = [];

    const recommended_workspaces: string[] = ["visual-identity", "brand-voice"];

    // Add workspaces based on touchpoints
    if (questionnaireData.primary_touchpoints?.includes("social-media")) {
        recommended_workspaces.push("social-media-kit");
    }

    if (questionnaireData.primary_touchpoints?.includes("physical-print") ||
        questionnaireData.primary_touchpoints?.includes("product-packaging")) {
        recommended_workspaces.push("print-templates");
    }

    if (questionnaireData.primary_touchpoints?.includes("website-app")) {
        recommended_workspaces.push("digital-ui-kit");
    }

    return {
        complete,
        partial,
        missing,
        recommended_workspaces: recommended_workspaces as any,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: IdentityGenerateRequest = await request.json();
        const { identity_id, questionnaire_data } = body;

        if (!identity_id || !questionnaire_data) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get user for rate limiting
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check rate limit
        if (!checkRateLimit(user.id)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        // Return SSE stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const generator = streamGeneration(identity_id, questionnaire_data);

                try {
                    for await (const chunk of generator) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });

    } catch (error: any) {
        console.error("Identity generation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
