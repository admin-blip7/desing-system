import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ExportActions from "@/components/features/ExportActions";
import BrandThemeSync from "@/components/theme/BrandThemeSync";

export default async function BrandExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id,name,personality_id")
    .eq("id", id)
    .single();

  if (!brand) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <BrandThemeSync personalityId={brand.personality_id} />
      <Link
        href={`/dashboard/brands/${brand.id}`}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-200"
      >
        <ArrowLeft size={16} /> Volver a marca
      </Link>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Export</p>
        <h1 className="text-3xl font-light text-white">Exportar {brand.name}</h1>
        <p className="mt-2 text-sm text-zinc-400">Descarga el manual en formato PDF, HTML o Markdown.</p>
      </div>

      <ExportActions brandId={brand.id} />
    </div>
  );
}
