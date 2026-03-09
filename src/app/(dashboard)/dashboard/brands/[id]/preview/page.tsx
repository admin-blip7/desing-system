import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { phases } from "@/lib/data/phases";
import ModuleRenderer from "@/components/previews/ModuleRenderer";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import PDFExportButton from "@/components/features/PDFExportButton";
import ShareDialog from "@/components/features/ShareDialog";
import { getModuleByIdentifier } from "@/lib/data/modules-definition";
import BrandThemeSync from "@/components/theme/BrandThemeSync";

export default async function ManualPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 requires awaiting params
    const { id } = await params;

    const supabase = await createClient();

    // Check auth first to get user session for checking permissions in the share dialog
    // Although ShareDialog is client component, we should pass initial state.

    const { data: brand } = await supabase
        .from("brands")
        .select("*, is_public, share_token")
        .eq("id", id)
        .single();

    if (!brand) return notFound();

    const { data: modules } = await supabase
        .from("modules")
        .select("*")
        .eq("brand_id", brand.id)
        .eq("status", "completed");

    const modulesMap = (modules || []).reduce((acc: any, curr: any) => {
        const canonicalModule = getModuleByIdentifier(curr.module_key);
        acc[curr.module_key] = curr;
        if (canonicalModule) {
            acc[canonicalModule.key] = curr;
            acc[canonicalModule.name] = curr;
        }
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32">
            <BrandThemeSync personalityId={brand.personality_id} />
            {/* Header / Toolbar */}
            <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-900 p-4 no-print">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link href={`/dashboard/brands/${brand.id}`} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        Volver
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{brand.name} Brand Manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShareDialog
                            brandId={brand.id}
                            initialIsPublic={brand.is_public || false}
                            initialShareToken={brand.share_token}
                        />
                        <PDFExportButton targetId="brand-manual-content" fileName={`${brand.name}-manual`} />
                    </div>
                </div>
            </div>

            <div id="brand-manual-content" className="max-w-5xl mx-auto px-8 md:px-12 py-16 space-y-24 bg-zinc-950">

                {/* Cover */}
                <section className="min-h-[60vh] flex flex-col justify-center items-center text-center border-b border-zinc-900 pb-24">
                    <div className="w-24 h-24 bg-yellow-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-black mb-12 shadow-2xl shadow-yellow-500/20">
                        {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
                        {brand.name}
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl font-light">
                        Manual de Identidad & Sistema de Marca
                    </p>
                    <div className="mt-12 text-sm text-zinc-600 font-mono">
                        v1.0 • Generated via BrandManual.ai
                    </div>
                </section>

                {/* Table of Contents */}
                <section className="py-12 border-b border-zinc-900">
                    <h2 className="text-3xl font-bold mb-12">Índice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {phases.map(phase => (
                            <div key={phase.id} className="space-y-4 mb-8">
                                <h3 className="text-yellow-500 font-mono text-sm uppercase tracking-widest">{phase.title}</h3>
                                <ul className="space-y-3">
                                    {phase.modules.map(module => (
                                        <li key={module.name} className="flex items-baseline justify-between group cursor-pointer hover:text-yellow-500 transition-colors">
                                            <span className={modulesMap[module.key] || modulesMap[module.name] ? "text-zinc-300" : "text-zinc-700"}>
                                                {module.name}
                                            </span>
                                            <span className="h-px bg-zinc-900 flex-1 mx-4" />
                                            <span className="text-zinc-700 text-xs font-mono">0{phase.id}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Content */}
                {phases.map(phase => (
                    <section key={phase.id} className="space-y-16">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="h-px bg-yellow-500 w-12" />
                            <h2 className="text-yellow-500 font-mono text-sm uppercase tracking-widest">{phase.title}</h2>
                        </div>

                        {phase.modules.map(module => {
                            const moduleData = modulesMap[module.key] || modulesMap[module.name];
                            if (!moduleData) return null;

                            return (
                                <div key={module.name} id={module.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-32">
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-bold text-white mb-4">{module.name}</h3>
                                        <p className="text-zinc-500 max-w-2xl">{module.aiGenerates}</p>
                                    </div>

                                    <ModuleRenderer
                                        moduleName={module.name}
                                        content={moduleData.content}
                                    />

                                    <div className="h-24" /> {/* Spacer */}
                                </div>
                            );
                        })}
                    </section>
                ))}

            </div>
        </div>
    );
}
