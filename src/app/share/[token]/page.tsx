import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { phases } from "@/lib/data/phases";
import ModuleRenderer from "@/components/previews/ModuleRenderer";
import PDFExportButton from "@/components/features/PDFExportButton";
import { getModuleByIdentifier } from "@/lib/data/modules-definition";
import BrandThemeSync from "@/components/theme/BrandThemeSync";

type SharedModuleRecord = {
    module_key: string;
    [key: string]: unknown;
};

// Public page must not rely on service-role credentials.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PublicSharePage({ params }: { params: Promise<{ token: string }> }) {
    // Next.js 15 requires awaiting params
    const { token } = await params;

    // 1. Fetch brand by token
    const { data: brand } = await supabaseAdmin
        .from("brands")
        .select("*")
        .eq("share_token", token)
        .eq("is_public", true) // Ensure it's still public
        .single();

    if (!brand) return notFound();

    // 2. Fetch modules
    const { data: modules } = await supabaseAdmin
        .from("modules")
        .select("*")
        .eq("brand_id", brand.id)
        .eq("status", "completed");

    const modulesMap = ((modules as SharedModuleRecord[] | null) || []).reduce<Record<string, SharedModuleRecord>>((acc, curr) => {
        acc[curr.module_key] = curr;
        const canonicalModule = getModuleByIdentifier(curr.module_key);
        if (canonicalModule) {
            acc[canonicalModule.key] = curr;
            acc[canonicalModule.name] = curr;
        }
        return acc;
    }, {});


    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32">
            <BrandThemeSync personalityId={brand.personality_id} />
            {/* Read-Only Header */}
            <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-900 p-4 no-print">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 overflow-hidden flex items-center justify-center text-black font-bold text-xs">
                            {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-zinc-200">{brand.name}</span>
                        <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900 rounded-full border border-zinc-800">Brand Manual</span>
                    </div>
                    <div>
                        <PDFExportButton targetId="brand-manual-content" fileName={`${brand.name}-manual`} />
                    </div>
                </div>
            </div>

            <div id="brand-manual-content" className="max-w-5xl mx-auto px-8 md:px-12 py-16 space-y-24 bg-zinc-950">
                {/* Reuse the rendering logic - ideally this should be a shared component for the content part */}

                {/* Cover */}
                <section className="min-h-[60vh] flex flex-col justify-center items-center text-center border-b border-zinc-900 pb-24">
                    <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tight">{brand.name}</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                        Manual de Identidad & Guía de Estilo
                    </p>
                    <div className="mt-12 text-sm text-zinc-600 font-mono">
                        VERSION 1.0 &mdash; {new Date().getFullYear()}
                    </div>
                </section>

                {/* Table of Contents */}
                <section className="py-12 border-b border-zinc-900">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8">Índice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {phases.flatMap(p => p.modules).map((module) => (
                            modulesMap[module.key] ? (
                                <a key={module.key} href={`#${module.key}`} className="flex justify-between items-baseline group hover:text-yellow-500 transition-colors">
                                    <span className="text-lg">{module.name}</span>
                                    <span className="h-px bg-zinc-800 flex-1 mx-4 group-hover:bg-zinc-700 transition-colors"></span>
                                    <span className="font-mono text-zinc-500 text-sm">0{phases.findIndex(p => p.modules.includes(module)) + 1}</span>
                                </a>
                            ) : null
                        ))}
                    </div>
                </section>

                {/* Modules */}
                {phases.map((phase) => (
                    <div key={phase.id} className="space-y-24">
                        {phase.modules.map((module) => {
                            const generatedModule = modulesMap[module.key];
                            if (!generatedModule) return null;

                            return (
                                <section key={module.key} id={module.key} className="scroll-mt-32">
                                    <div className="mb-12">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="font-mono text-xs text-yellow-500 px-2 py-1 bg-yellow-500/10 rounded border border-yellow-500/20">
                                                {phase.title}
                                            </span>
                                            <h2 className="text-3xl font-medium">{module.name}</h2>
                                        </div>
                                        <p className="text-zinc-400 text-lg max-w-2xl">{module.description}</p>
                                    </div>

                                    <div className="mt-8">
                                        <ModuleRenderer
                                            moduleName={module.key}
                                            content={generatedModule.content}
                                        />
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ))}
            </div>

            <footer className="max-w-5xl mx-auto px-8 py-12 text-center text-zinc-600 text-sm border-t border-zinc-900 mt-24">
                <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
                <p className="mt-2 text-xs">Generated with Brand AI</p>
            </footer>
        </div>
    );
}
