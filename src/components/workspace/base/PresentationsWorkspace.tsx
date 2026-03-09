"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Presentation, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface SlideData {
    title: string;
    content: string;
    notes: string;
}

interface PresentationTemplate {
    name: string;
    description: string;
    slideCount: number;
}

interface PresentationsData {
    selectedTemplate: string;
    slides: SlideData[];
    brandColor: string;
}

const defaultPresentationsData: PresentationsData = {
    selectedTemplate: "pitch",
    slides: [
        { title: "Portada", content: "Tu título aquí", notes: "Presenter notes" },
        { title: "Problema", content: "Descripción del problema", notes: "" },
        { title: "Solución", content: "Tu propuesta", notes: "" },
        { title: "Beneficios", content: "Beneficio 1, Beneficio 2, Beneficio 3", notes: "" }
    ],
    brandColor: "#3B82F6"
};

const templates: PresentationTemplate[] = [
    { name: "pitch", description: "Pitch a inversionistas", slideCount: 10 },
    { name: "proposal", description: "Propuesta a clientes", slideCount: 8 },
    { name: "report", description: "Reporte mensual", slideCount: 12 },
    { name: "training", description: "Capacitación interna", slideCount: 15 }
];

function PresentationsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [presentationsData, setPresentationsData] = useState<PresentationsData>(
        data?.content?.presentationsData || defaultPresentationsData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0);

    const updateSlide = useCallback((field: keyof SlideData, value: string) => {
        setPresentationsData(prev => ({
            ...prev,
            slides: prev.slides.map((s, i) =>
                i === selectedSlide ? { ...s, [field]: value } : s
            )
        }));
        setHasChanges(true);
    }, [selectedSlide]);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, presentationsData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPresentationsData(data?.content?.presentationsData || defaultPresentationsData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Presentation size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="templates"><Edit size={14} className="mr-2" /> Templates</TabsTrigger>
                        <TabsTrigger value="slides"><Edit size={14} className="mr-2" /> Diapositivas</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Presentaciones</h2>
                                    <p className="text-zinc-400">Plantillas y narrativa visual para presentaciones.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {templates.map(t => (
                                        <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <h3 className="text-white font-medium text-lg mb-2">{t.name}</h3>
                                            <p className="text-zinc-500 text-sm">{t.description}</p>
                                            <p className="text-amber-500 font-mono">{t.slideCount} slides</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="templates" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Template</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {templates.map(t => (
                                        <button
                                            key={t.name}
                                            onClick={() => { setPresentationsData(prev => ({ ...prev, selectedTemplate: t.name })); setHasChanges(true); }}
                                            className={`p-5 rounded-xl border text-center ${presentationsData.selectedTemplate === t.name ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-zinc-900"}`}
                                        >
                                            <h3 className="text-white font-medium">{t.name}</h3>
                                            <p className="text-zinc-500 text-xs mt-2">{t.slideCount} slides</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="slides" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-white font-semibold">Diapositivas ({presentationsData.slides.length})</h3>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setPresentationsData(prev => ({
                                                ...prev,
                                                slides: [...prev.slides, { title: "Nueva Slide", content: "", notes: "" }]
                                            }));
                                            setHasChanges(true);
                                        }}>
                                            + Agregar
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {presentationsData.slides.map((slide, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSlide(i)}
                                                className={`text-left p-4 rounded-lg ${selectedSlide === i ? "ring-2 ring-amber-500/50 bg-zinc-800" : "bg-zinc-950 hover:bg-zinc-900"}`}
                                            >
                                                <p className="text-white text-sm font-medium mb-1">{i + 1}. {slide.title}</p>
                                                <p className="text-zinc-500 text-xs truncate">{slide.content.substring(0, 50)}...</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Editar Diapositiva</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Título</Label>
                                        <Input value={presentationsData.slides[selectedSlide]?.title || ""} onChange={e => updateSlide("title", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Contenido</Label>
                                        <Textarea value={presentationsData.slides[selectedSlide]?.content || ""} onChange={e => updateSlide("content", e.target.value)} className="min-h-[150px] bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Notas del Presentador</Label>
                                        <Textarea value={presentationsData.slides[selectedSlide]?.notes || ""} onChange={e => updateSlide("notes", e.target.value)} className="min-h-[60px] bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-5xl mx-auto">
                                <div className="bg-zinc-800 rounded-lg aspect-video flex items-center justify-center">
                                    <div className="bg-white w-full max-w-4xl aspect-video p-12 flex flex-col items-center justify-center" style={{ backgroundColor: presentationsData.brandColor }}>
                                        <h1 className="text-4xl font-bold text-zinc-900 mb-4">{presentationsData.slides[0]?.title || "Presentación"}</h1>
                                        <div className="flex-1 space-y-8">
                                            {presentationsData.slides.slice(0, 3).map((slide, i) => (
                                                <div key={i} className="text-center">
                                                    <h2 className="text-2xl font-bold text-zinc-800">{slide.title}</h2>
                                                    <p className="text-zinc-600">{slide.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(presentationsData, null, 2));
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

export default function PresentationsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="presentations"
            moduleName="Presentaciones"
            moduleSubtitle="Plantillas y narrativa visual"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <PresentationsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
