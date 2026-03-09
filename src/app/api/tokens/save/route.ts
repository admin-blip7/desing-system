import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    if (error && typeof error === "object" && "message" in error) {
        const candidate = (error as { message?: unknown }).message;
        if (typeof candidate === "string" && candidate.length > 0) return candidate;
    }
    return "Internal server error";
}

export async function POST(request: NextRequest) {
    try {
        const { brandId, tokens } = await request.json();

        if (!brandId || !tokens) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify brand ownership
        const { data: brand } = await supabase
            .from("brands")
            .select("id, onboarding_data")
            .eq("id", brandId)
            .eq("user_id", user.id)
            .single();

        if (!brand) {
            return NextResponse.json(
                { error: "Brand not found" },
                { status: 404 }
            );
        }

        let brandTokensSaved = false;

        // Primary persistence path: dedicated table if available/policies allow it.
        const { error: updateError, count } = await supabase
            .from("brand_tokens")
            .update({
                tokens,
            })
            .eq("brand_id", brandId)
            .select("brand_id", { count: "exact", head: true });

        if (!updateError) {
            if ((count ?? 0) > 0) {
                brandTokensSaved = true;
            } else {
                const { error: insertError } = await supabase
                    .from("brand_tokens")
                    .insert({
                        brand_id: brandId,
                        tokens,
                    });
                if (!insertError) {
                    brandTokensSaved = true;
                } else {
                    console.warn("brand_tokens insert failed, using brands fallback:", insertError.message);
                }
            }
        } else {
            console.warn("brand_tokens update failed, using brands fallback:", updateError.message);
        }

        // Fallback persistence path: brands.onboarding_data.brand_tokens
        const currentOnboarding =
            typeof brand.onboarding_data === "object" && brand.onboarding_data !== null
                ? (brand.onboarding_data as Record<string, unknown>)
                : {};

        const nextOnboarding = {
            ...currentOnboarding,
            brand_tokens: tokens,
            brand_tokens_updated_at: new Date().toISOString(),
        };

        const { error: brandUpdateError } = await supabase
            .from("brands")
            .update({
                onboarding_data: nextOnboarding,
            })
            .eq("id", brandId)
            .eq("user_id", user.id);

        if (brandUpdateError) {
            // If both paths failed, return error; otherwise keep success.
            if (!brandTokensSaved) {
                throw brandUpdateError;
            }
            console.warn("brands fallback update failed after brand_tokens success:", brandUpdateError.message);
        }

        return NextResponse.json({ success: true, storage: brandTokensSaved ? "brand_tokens+brands" : "brands" });

    } catch (error: unknown) {
        console.error("Error saving brand tokens:", error);
        const message = extractErrorMessage(error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
