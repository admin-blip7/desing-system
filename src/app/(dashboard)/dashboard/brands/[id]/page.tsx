import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { getModuleByIdentifier } from "@/lib/data/modules-definition";
import { personalities } from "@/lib/data/personalities";
import BrandThemeSync from "@/components/theme/BrandThemeSync";
import BrandManualRoadmap from "@/components/roadmap/BrandManualRoadmap";

export default async function BrandDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15 requires awaiting params
  const { id } = await params;

  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (!brand) return notFound();

  // Fetch existing modules to populate state
  const { data: modules } = await supabase
    .from("modules")
    .select("module_key, status, content")
    .eq("brand_id", brand.id);
  const selectedPersonality = personalities.find((p) => p.id === brand.personality_id);

  // Transform to map for easier lookup
  const initialModuleData = (modules || []).reduce(
    (acc: Record<string, { status: string; content: unknown }>, curr: { module_key: string; status: string; content: unknown }) => {
      const canonicalModule = getModuleByIdentifier(curr.module_key);
      const canonicalKey = canonicalModule?.key || curr.module_key;
      acc[canonicalKey] = {
        status: curr.status,
        content: curr.content,
      };
      if (canonicalModule?.name) {
        acc[canonicalModule.name] = acc[canonicalKey];
      }
      return acc;
    },
    {} as Record<string, { status: string; content: unknown }>
  );

  return (
    <div>
      <BrandThemeSync personalityId={brand.personality_id} />

      {/* Minimal Header with Back Link and Workspace */}
      <div
        style={{
          padding: "16px 40px",
          borderBottom: "1px solid #141414",
          background: "#050505",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 transition-colors"
          style={{
            fontSize: "11px",
            color: "#666",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} />
          Volver al Dashboard
        </Link>

        <Link
          href={`/dashboard/brands/${brand.id}/workspace`}
          className="inline-flex items-center gap-2 transition-colors rounded-lg px-4 py-2 border border-[var(--bm-color-border)] hover:border-[var(--bm-color-accent)]"
          style={{
            fontSize: "12px",
            color: "var(--bm-color-text-secondary)",
            textDecoration: "none",
            background: "var(--bm-color-surface-muted)",
          }}
        >
          <Settings size={14} />
          Workspace
        </Link>
      </div>

      {/* Brand Manual Roadmap */}
      <BrandManualRoadmap
        brandId={brand.id}
        brandName={brand.name}
        selectedIdentity={selectedPersonality?.name || brand.personality_id || "Sin identidad"}
        initialData={initialModuleData}
      />
    </div>
  );
}
