import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildManualHtml } from "@/lib/exporters/html-generator";
import { buildManualMarkdown } from "@/lib/exporters/markdown-generator";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { brandId?: string; format?: "html" | "markdown" };

  if (!body.brandId || !body.format) {
    return new Response(JSON.stringify({ success: false, error: "brandId and format are required" }), {
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

  if (body.format === "html") {
    const html = buildManualHtml(brand.name, modules || []);
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "content-disposition": `attachment; filename=\"${brand.name.replace(/\s+/g, "-")}-manual.html\"`,
      },
    });
  }

  const markdown = buildManualMarkdown(brand.name, modules || []);
  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename=\"${brand.name.replace(/\s+/g, "-")}-manual.md\"`,
    },
  });
}
