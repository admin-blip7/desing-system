import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const brandId = searchParams.get("brandId");
        const moduleKey = searchParams.get("moduleKey");

        if (!brandId || !moduleKey) {
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
            .select("id")
            .eq("id", brandId)
            .eq("user_id", user.id)
            .single();

        if (!brand) {
            return NextResponse.json(
                { error: "Brand not found" },
                { status: 404 }
            );
        }

        // Load module content
        const { data: moduleData, error } = await supabase
            .from("modules")
            .select("content, status, updated_at")
            .eq("brand_id", brandId)
            .eq("module_key", moduleKey)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
            throw error;
        }

        return NextResponse.json({
            data: moduleData || null
        });

    } catch (error: any) {
        console.error("Error loading module:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
