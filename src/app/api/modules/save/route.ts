import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { phases } from "@/lib/data/phases";
import { roadmapPhases } from "@/lib/data/roadmap-phases";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Try to parse JSON with better error handling
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[modules/save] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { brandId, moduleKey, content, status } = body;
    const phaseFromPhases = phases.find((phase) => phase.modules.some((module) => module.key === moduleKey))?.id;
    const phaseFromRoadmap = roadmapPhases.find((phase) => phase.modules.some((module) => module.key === moduleKey))?.id;
    const phaseFromBody = typeof body.phase === "number" && Number.isFinite(body.phase) ? body.phase : undefined;
    const resolvedPhaseId = phaseFromBody ?? phaseFromPhases ?? phaseFromRoadmap ?? 1;

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

    // Verificar que la marca pertenece al usuario
    const { data: brand } = await supabase
      .from("brands")
      .select("id, user_id")
      .eq("id", brandId)
      .eq("user_id", user.id)
      .single();

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Check if module exists
    const { data: existingModule } = await supabase
      .from("modules")
      .select("id")
      .eq("brand_id", brandId)
      .eq("module_key", moduleKey)
      .single();

    const updateData: Record<string, unknown> = {
      status: status || "in_progress",
      updated_at: now,
    };

    if (content !== undefined) {
      updateData.content = content;
    }

    let result;

    if (existingModule) {
      result = await supabase
        .from("modules")
        .update(updateData)
        .eq("id", existingModule.id);
    } else {
      result = await supabase
        .from("modules")
        .insert({
          brand_id: brandId,
          module_key: moduleKey,
          phase: resolvedPhaseId,
          content: content || {},
          status: status || "pending",
          pre_answers: null,
          created_at: now,
          updated_at: now,
        });
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error saving module:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
