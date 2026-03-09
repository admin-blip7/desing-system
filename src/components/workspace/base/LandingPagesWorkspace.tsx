"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface LandingPage {
    id: string;
    name: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    benefits: string[];
}

interface LandingPagesData {
    selectedTemplate: string;
    customizations: {
        primaryColor: string;
        secondaryColor: string;
        fontFamily: string;
    };
    pages: LandingPage[];
}

const defaultLandingPagesData: LandingPagesData = {
    selectedTemplate: "conversion",
    customizations: {
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        fontFamily: "Inter, sans-serif"
    },
    pages: [
        {
            id: "1",
            name: "Landing Principal",
            heroTitle: "Bienvenido a Nuestro Servicio",
            heroSubtitle: "La solución que estabas buscando",
            ctaText: "Comenzar Ahora",
            benefits: ["Beneficio 1", "Beneficio 2", "Beneficio 3"]
        }
    ]
};

const templates = [
    { id: "conversion", name: "Conversión", icon: "🎯", desc: "Optimizado para conversión" },
    { id: "product", name: "Producto", icon: "📦", desc: "Showcase de producto" },
    { id: "saas", name: "SaaS", icon: "☁️", desc: "Para servicios de software" },
    { id: "lead", name: "Lead Magnet", icon: "🎁", desc: "Captura de leads" }
];

function LandingPagesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [landingData, setLandingData] = useState<LandingPagesData>(
        data?.content?.landingData || defaultLandingPagesData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedPage, setSelectedPage] = useState(0);

    const updateCustomization = useCallback((field: keyof LandingPagesData["customizations"], value: string) => {
        setLandingData(prev => ({
            ...prev,
            customizations: { ...prev.customizations, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const updatePage = useCallback((field: keyof LandingPage, value: any, index: number = selectedPage) => {
        setLandingData(prev => ({
            ...prev,
            pages: prev.pages.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            )
        }));
        setHasChanges(true);
    }, [selectedPage]);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, landingData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setLandingData(data?.content?.landingData || defaultLandingPagesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Globe size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="templates"><Edit size={14} className="mr-2" /> Templates</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Landing Pages</h2>
                                    <p className="text-zinc-400">Plantillas de landing pages orientadas a conversión.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {templates.map(t => (
                                        <div key={t.id} className={`p-4 rounded-xl border text-center ${landingData.selectedTemplate === t.id ? "border-amber-500 bg-amber-500/10" : "border-zinc-800 bg-zinc-900"}`}>
                                            <div className="text-3xl mb-2">{t.icon}</div>
                                            <h3 className="text-white font-medium">{t.name}</h3>
                                            <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="templates" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Template</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {templates.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => { setLandingData(prev => ({ ...prev, selectedTemplate: t.id })); setHasChanges(true); }}
                                                className={`p-4 rounded-xl border text-center transition-all ${
                                                    landingData.selectedTemplate === t.id
                                                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30"
                                                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                                                }`}
                                            >
                                                <div className="text-3xl mb-2">{t.icon}</div>
                                                <h4 className="text-white font-medium">{t.name}</h4>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Personalizar Template</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Color Primario</Label>
                                            <Input
                                                type="color"
                                                value={landingData.customizations.primaryColor}
                                                onChange={e => updateCustomization("primaryColor", e.target.value)}
                                                className="w-full h-10"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Color Secundario</Label>
                                            <Input
                                                type="color"
                                                value={landingData.customizations.secondaryColor}
                                                onChange={e => updateCustomization("secondaryColor", e.target.value)}
                                                className="w-full h-10"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Fuente</Label>
                                            <select
                                                value={landingData.customizations.fontFamily}
                                                onChange={e => updateCustomization("fontFamily", e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white"
                                            >
                                                <option>Inter, sans-serif</option>
                                                <option>Roboto, sans-serif</option>
                                                <option>Open Sans, sans-serif</option>
                                                <option>Poppins, sans-serif</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Contenido de la Landing</h3>
                                                                        </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Título Hero</Label>
                                                                        <Input
                                                                            value={landingData.pages[selectedPage]?.heroTitle || ""}
                                                                            onChange={e => updatePage("heroTitle", e.target.value)}
                                                                            className="bg-zinc-950 border-zinc-700"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Subtítulo Hero</Label>
                                                                        <Textarea
                                                                            value={landingData.pages[selectedPage]?.heroSubtitle || ""}
                                                                            onChange={e => updatePage("heroSubtitle", e.target.value)}
                                                                            className="min-h-[60px] bg-zinc-950 border-zinc-700"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Texto del CTA</Label>
                                                                        <Input
                                                                            value={landingData.pages[selectedPage]?.ctaText || ""}
                                                                            onChange={e => updatePage("ctaText", e.target.value)}
                                                                            className="bg-zinc-950 border-zinc-700"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-5xl mx-auto">
                                                                <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                                                                    <div
                                                                        className="px-8 py-16 text-center"
                                                                        style={{ backgroundColor: landingData.customizations.primaryColor }}
                                                                    >
                                                                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: landingData.customizations.fontFamily }}>
                                                                            {landingData.pages[selectedPage]?.heroTitle || "Tu Título Aquí"}
                                                                        </h1>
                                                                        <p className="text-xl text-white/80 mb-8">
                                                                            {landingData.pages[selectedPage]?.heroSubtitle || "Tu subtítulo aquí"}
                                                                        </p>
                                                                        <button
                                                                            className="bg-white px-8 py-4 rounded-lg font-semibold text-lg"
                                                                            style={{ color: landingData.customizations.primaryColor }}
                                                                        >
                                                                            {landingData.pages[selectedPage]?.ctaText || "CTA"}
                                                                        </button>
                                                                    </div>
                                                                    <div className="px-8 py-12 bg-zinc-50">
                                                                        <h3 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Beneficios</h3>
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                            {(landingData.pages[selectedPage]?.benefits || ["Beneficio 1", "Beneficio 2", "Beneficio 3"]).map((benefit, i) => (
                                                                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: landingData.customizations.secondaryColor }}>
                                                                                        <span className="text-white font-bold">{i + 1}</span>
                                                                                    </div>
                                                                                    <p className="text-zinc-700">{benefit}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto">
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full h-24 flex-col gap-2"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(JSON.stringify(landingData, null, 2));
                                                                        toast.success("JSON copiado");
                                                                    }}
                                                                >
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

export default function LandingPagesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="landingPages"
            moduleName="Landing Pages"
            moduleSubtitle="Plantillas de landing orientadas a conversión"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <LandingPagesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
