import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const brandId = searchParams.get("brandId");

        if (!brandId) {
            return NextResponse.json(
                { error: "Missing brandId" },
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

        // Load custom tokens
        const { data: tokenData } = await supabase
            .from("brand_tokens")
            .select("tokens")
            .eq("brand_id", brandId)
            .maybeSingle();

        const fallbackTokens =
            typeof brand.onboarding_data === "object" &&
            brand.onboarding_data !== null &&
            "brand_tokens" in brand.onboarding_data
                ? (brand.onboarding_data as Record<string, unknown>).brand_tokens
                : null;

        return NextResponse.json({
            tokens: tokenData?.tokens || fallbackTokens || null
        });

    } catch (error: unknown) {
        console.error("Error loading brand tokens:", error);
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
