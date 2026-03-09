import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { brandId, moduleKey, answers } = await request.json();

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

    // Guardar o actualizar el módulo con las respuestas
    const { data: existingModule } = await supabase
      .from("modules")
      .select("id, content")
      .eq("brand_id", brandId)
      .eq("module_key", moduleKey)
      .single();

    const now = new Date().toISOString();
    const moduleData = {
      brand_id: brandId,
      module_key: moduleKey,
      pre_answers: answers,
      updated_at: now,
    };

    let result;

    if (existingModule) {
      // Actualizar módulo existente, preservando el contenido
      result = await supabase
        .from("modules")
        .update({
          ...moduleData,
          content: existingModule.content, // Preservar contenido existente
        })
        .eq("id", existingModule.id);
    } else {
      // Crear nuevo módulo
      result = await supabase
        .from("modules")
        .insert({
          ...moduleData,
          status: "pending",
          content: null,
          created_at: now,
        });
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
