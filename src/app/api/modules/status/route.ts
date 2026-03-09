import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { brandId, moduleKey, status } = body;

    if (!brandId || !moduleKey || !status) {
      return NextResponse.json(
        { error: "Missing required fields: brandId, moduleKey, status" },
        { status: 400 }
      );
    }

    // Verify user owns this brand
    const { data: brand } = await supabase
      .from("brands")
      .select("user_id")
      .eq("id", brandId)
      .single();

    if (!brand || brand.user_id !== session.user.id) {
      return NextResponse.json({ error: "Brand not found or access denied" }, { status: 403 });
    }

    // Update only the status field
    const { data, error } = await supabase
      .from("brand_modules")
      .update({ status })
      .eq("brand_id", brandId)
      .eq("module_key", moduleKey)
      .select()
      .single();

    if (error) {
      // If record doesn't exist, create it with just the status
      if (error.code === "PGRST116") {
        const { data: newData, error: createError } = await supabase
          .from("brand_modules")
          .insert({
            brand_id: brandId,
            module_key: moduleKey,
            status,
            content: null,
            answers: null,
          })
          .select()
          .single();

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 500 });
        }
        return NextResponse.json({ data: newData });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error updating module status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
