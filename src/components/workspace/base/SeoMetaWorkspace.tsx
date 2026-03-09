"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface SeoData {
    titleTemplate: string;
    descriptionTemplate: string;
    ogImageSize: string;
    keywords: string[];
}

const defaultSeoData: SeoData = {
    titleTemplate: "{{page}} | {{brand}}",
    descriptionTemplate: "{{page}} - {{description}}",
    ogImageSize: "1200x630",
    keywords: ["keyword1", "keyword2", "keyword3"]
};

function SeoMetaWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [seoData, setSeoData] = useState<SeoData>(data?.content?.seoData || defaultSeoData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateField = useCallback((field: keyof SeoData, value: any) => {
        setSeoData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, seoData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSeoData(data?.content?.seoData || defaultSeoData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Search size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="editor"><Edit size={14} className="mr-2" /> Editor</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">SEO & Meta</h2>
                                    <p className="text-zinc-400">Sistema de metadata y pautas SEO por tipo de página.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Title Tags", icon: "📝", desc: "Hasta 60 caracteres" },
                                        { title: "Meta Descriptions", icon: "📄", desc: "150-160 caracteres" },
                                        { title: "OG Images", icon: "🖼️", desc: "1200x630px recomendado" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Plantillas de Metadata</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Title Template</Label>
                                        <Input value={seoData.titleTemplate} onChange={e => updateField("titleTemplate", e.target.value)} className="bg-zinc-950 font-mono text-sm" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Description Template</Label>
                                        <Textarea value={seoData.descriptionTemplate} onChange={e => updateField("descriptionTemplate", e.target.value)} className="min-h-[80px] bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">OG Image Size</Label>
                                        <Input value={seoData.ogImageSize} onChange={e => updateField("ogImageSize", e.target.value)} className="bg-zinc-950 font-mono text-sm" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Keywords (separados por coma)</Label>
                                        <Input value={seoData.keywords.join(", ")} onChange={e => updateField("keywords", e.target.value.split(", ").filter(k => k.trim()))} className="bg-zinc-950" placeholder="keyword1, keyword2, keyword3" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl p-8">
                                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">Preview en Google</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-blue-700 text-lg">Título: {seoData.titleTemplate.replace("{{page}}", "Producto ABC").replace("{{brand}}", "Tu Marca")}</p>
                                            <p className="text-green-700 text-sm">https://tusitio.com/producto</p>
                                        </div>
                                        <div className="text-zinc-600 text-sm max-w-xl">
                                            <p className="line-clamp-2">{seoData.descriptionTemplate.replace("{{page}}", "Producto ABC").replace("{{description}}", "La mejor descripción del producto ABC...")}</p>
                                        </div>
                                        <div className="flex gap-4 pt-4 border-t">
                                            <div className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs">
                                                OG Image
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-xs">Tamaño: {seoData.ogImageSize}</p>
                                                <p className="text-zinc-500 text-xs">Tipo: image/jpeg</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(seoData, null, 2));
                                    toast.success("JSON copiado");
                                }}>
                                    <Download size={20} />
                                    <span>Exportar JSON</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function SeoMetaWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="seoMeta"
            moduleName="SEO & Meta"
            moduleSubtitle="Metadata y pautas SEO por tipo de página"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <SeoMetaWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
