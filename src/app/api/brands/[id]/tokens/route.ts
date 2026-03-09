import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { personalities } from "@/lib/data/personalities";
import { resolveBrandTheme } from "@/lib/design-tokens/theme-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: brandId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Obtener datos de la marca
    const { data: brand } = await supabase
      .from("brands")
      .select("id, name, personality_id, onboarding_data")
      .eq("id", brandId)
      .eq("user_id", user.id)
      .single();

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Obtener la personalidad de la marca
    const personality = personalities.find(
      (p) => p.id === brand.personality_id
    );

    if (!personality) {
      return NextResponse.json(
        { error: "Personality not found" },
        { status: 404 }
      );
    }

    // Resolver los tokens de la marca
    const tokens = resolveBrandTheme(brand.personality_id);

    // Agregar información adicional de la marca
    const brandInfo = {
      name: brand.name,
      personality: {
        id: personality.id,
        name: personality.name,
        archetype: personality.archetype,
        tagline: personality.tagline,
      },
      onboardingData: brand.onboarding_data || {},
    };

    return NextResponse.json({
      tokens,
      brand: brandInfo,
    });
  } catch (error: any) {
    console.error("Error fetching brand tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
