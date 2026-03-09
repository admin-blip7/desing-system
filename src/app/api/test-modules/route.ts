import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const supabase = await createClient();

        // Test 1: Get user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({
                success: false,
                error: "Not authenticated",
                authError
            }, { status: 401 });
        }

        // Test 2: Try to insert a test module
        const testData = {
            brand_id: "test-brand-id",
            module_key: "test-module",
            content: { test: "This is a test content" },
            status: "completed"
        };

        const { data, error } = await supabase
            .from("modules")
            .insert(testData)
            .select();

        if (error) {
            console.error("Insert error:", error);
            return NextResponse.json({
                success: false,
                error: error.message,
                testData
            }, { status: 500 });
        }

        // Delete the test record
        if (data && data[0]) {
            await supabase
                .from("modules")
                .delete()
                .eq("id", data[0].id);
        }

        return NextResponse.json({
            success: true,
            message: "Supabase connection working!",
            userId: user.id,
            testInserted: data
        });

    } catch (error: unknown) {
        console.error("Test endpoint error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
