import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildLogoGuidelinesPdfBuffer } from "@/lib/exporters/logo-guidelines-pdf";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { brandId?: string };

  if (!body.brandId) {
    return new Response(JSON.stringify({ success: false, error: "brandId is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const { data: brand } = await supabase
    .from("brands")
    .select("id,name,user_id")
    .eq("id", body.brandId)
    .eq("user_id", user.id)
    .single();

  if (!brand) {
    return new Response(JSON.stringify({ success: false, error: "Brand not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("module_key,content,status")
    .eq("brand_id", brand.id)
    .eq("status", "completed");

  const pdf = buildLogoGuidelinesPdfBuffer({
    brandName: brand.name,
    modules: modules || [],
  });

  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=\"${brand.name.replace(/\s+/g, "-")}-logo-guidelines.pdf\"`,
    },
  });
}
