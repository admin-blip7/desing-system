import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create a Supabase client WITHOUT auth (using service role or checking schema directly)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        // Test 1: Check if modules table exists and what columns it has
        const { data: schemaData, error: schemaError } = await supabase
            .from("modules")
            .select("*")
            .limit(0); // Don't fetch data, just check schema

        // Test 2: Try a simple insert to see the exact error
        const testModule = {
            brand_id: "00000000-0000-0000-0000-000000000000", // Fake UUID
            module_key: "test-key",
            content: { test: "data" },
            status: "pending"
        };

        const { data: insertData, error: insertError } = await supabase
            .from("modules")
            .insert(testModule)
            .select();

        // Clean up if successful
        if (insertData && insertData[0]) {
            await supabase
                .from("modules")
                .delete()
                .eq("id", insertData[0].id);
        }

        return NextResponse.json({
            success: !insertError,
            schemaCheck: {
                error: schemaError?.message ?? null,
                hasData: !!schemaData
            },
            insertTest: {
                error: insertError?.message ?? null,
                data: insertData
            },
            timestamp: new Date().toISOString()
        });

    } catch (error: unknown) {
        console.error("Test error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
