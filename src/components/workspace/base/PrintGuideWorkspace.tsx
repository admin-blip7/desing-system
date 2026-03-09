"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface PrintSpec {
    name: string;
    description: string;
    value: string;
}

interface PrintData {
    colorMode: string;
    resolution: string;
    bleed: string;
    paperTypes: PrintSpec[];
    fonts: PrintSpec[];
}

const defaultPrintData: PrintData = {
    colorMode: "CMYK",
    resolution: "300dpi",
    bleed: "3mm",
    paperTypes: [
        { name: "Carta", description: "Tarjetas de presentación y correspondencia", value: "300gsm" },
        { name: "Bond", description: "Papel de alta calidad para documentos", value: "90gsm" }
    ],
    fonts: [
        { name: "Titulares", description: "Títulos y encabezados", value: "min 12pt" },
        { name: "Cuerpo", description: "Texto del documento", value: "min 10pt" }
    ]
};

function PrintGuideWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [printData, setPrintData] = useState<PrintData>(data?.content?.printData || defaultPrintData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateField = useCallback((field: keyof PrintData, value: any) => {
        setPrintData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, printData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPrintData(data?.content?.printData || defaultPrintData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Printer size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Guía de Impresión</h2>
                                    <p className="text-zinc-400">Especificaciones técnicas para impresión consistente.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { title: "Modo de Color", icon: "🎨", desc: "CMYK vs RGB", value: printData.colorMode },
                                        { title: "Resolución", icon: "📏", desc: "300 DPI mínimo", value: printData.resolution },
                                        { title: "Bleed", icon: "📐", desc: "Márgen de seguridad", value: printData.bleed }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold mb-2">Configuración de Impresión</h3>
                                    <div>
                                        <Label>Modo de Color</Label>
                                        <select value={printData.colorMode} onChange={e => updateField("colorMode", e.target.value)} className="w-full bg-zinc-950 border-zinc-700 rounded px-3 py-2 text-white">
                                            <option>CMYK</option>
                                            <option>RGB</option>
                                            <option>Pantone</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Resolución (DPI)</Label>
                                        <Input value={printData.resolution} onChange={e => updateField("resolution", e.target.value)} className="font-mono text-sm" placeholder="300" />
                                    </div>
                                    <div>
                                        <Label>Bleed (márgen de seguridad)</Label>
                                        <Input value={printData.bleed} onChange={e => updateField("bleed", e.target.value)} className="font-mono text-sm" placeholder="3mm" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl p-8 border-4 border-gray-200">
                                    <h3 className="text-2xl font-bold text-center text-zinc-900 mb-6">Especificaciones de Impresión</h3>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-8 text-center">
                                            <div>
                                                <p className="text-sm font-medium text-zinc-700">Color Mode</p>
                                                <p className="text-2xl font-bold text-zinc-900">{printData.colorMode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-700">Resolución</p>
                                                <p className="text-2xl font-bold text-zinc-900">{printData.resolution}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-700">Bleed</p>
                                                <p className="text-2xl font-bold text-zinc-900">{printData.bleed}</p>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-gray-200">
                                            <h4 className="text-lg font-semibold text-zinc-900 mb-4">Tipos de Papel Recomendados</h4>
                                            {printData.paperTypes.map(pt => (
                                                <div key={pt.name} className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
                                                    <span className="font-medium text-zinc-900">{pt.name}</span>
                                                    <span className="text-sm text-zinc-600">{pt.value}</span>
                                                    <span className="text-xs text-zinc-500">{pt.description}</span>
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
                                    navigator.clipboard.writeText(JSON.stringify(printData, null, 2));
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

export default function PrintGuideWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="printGuide"
            moduleName="Guía de Impresión"
            moduleSubtitle="Especificaciones técnicas para impresión"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <PrintGuideWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
