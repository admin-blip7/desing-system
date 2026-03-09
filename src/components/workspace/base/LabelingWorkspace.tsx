"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Edit, Eye, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface LabelItem {
    name: string;
    type: "price" | "status" | "promo" | "info";
    color: string;
    content: string;
}

interface LabelingData {
    labels: LabelItem[];
    labelColor: string;
}

const defaultLabelingData: LabelingData = {
    labels: [
        { name: "Precio Oferta", type: "price", color: "#10B981", content: "20% OFF" },
        { name: "Nuevo", type: "status", color: "#3B82F6", content: "NUEVO" },
        { name: "Limitado", type: "promo", color: "#F59E0B", content: "LIMITADO" }
    ],
    labelColor: "#000000"
};

function LabelingWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [labelingData, setLabelingData] = useState<LabelingData>(data?.content?.labelingData || defaultLabelingData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateField = useCallback((field: keyof LabelingData, value: any) => {
        setLabelingData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateLabel = useCallback((index: number, field: keyof LabelItem, value: any) => {
        setLabelingData(prev => ({
            ...prev,
            labels: prev.labels.map((l, i) => i === index ? { ...l, [field]: value } : l)
        }));
        setHasChanges(true);
    }, []);

    const addLabel = useCallback(() => {
        setLabelingData(prev => ({
            ...prev,
            labels: [...prev.labels, { name: "", type: "info", color: "#000000", content: "" }]
        }));
        setHasChanges(true);
    }, []);

    const removeLabel = useCallback((index: number) => {
        setLabelingData(prev => ({
            ...prev,
            labels: prev.labels.filter((_, i) => i !== index)
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, labelingData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setLabelingData(data?.content?.labelingData || defaultLabelingData);
        setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Tag size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Etiquetas y Labels</h2>
                                    <p className="text-zinc-400">Sistema de etiquetas para productos y elementos de marca.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Precio", icon: "💰", desc: "Etiquetas de precio" },
                                        { title: "Stock", icon: "📦", desc: "Estado de inventario" },
                                        { title: "Promo", icon: "🏷️", desc: "Etiquetas promocionales" }
                                    ].map((item, idx) => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Etiquetas Configuradas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {labelingData.labels.map((label, i) => (
                                            <span key={i} className="px-3 py-1 rounded text-white text-sm font-medium" style={{ backgroundColor: label.color }}>
                                                {label.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Gestionar Etiquetas</h3>
                                    <div className="space-y-3">
                                        {labelingData.labels.map((label, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3 group">
                                                <Input type="color" value={label.color} onChange={e => updateLabel(i, "color", e.target.value)} className="w-10 h-10 p-1" />
                                                <div className="flex-1">
                                                    <Input value={label.name} onChange={e => updateLabel(i, "name", e.target.value)} className="bg-zinc-800" placeholder="Nombre" />
                                                    <div className="flex gap-2 mt-2">
                                                        <select value={label.type} onChange={e => updateLabel(i, "type", e.target.value)} className="bg-zinc-800 text-sm">
                                                            <option value="price">Precio</option>
                                                            <option value="status">Stock</option>
                                                            <option value="promo">Promo</option>
                                                            <option value="info">Info</option>
                                                        </select>
                                                        <Input value={label.content} onChange={e => updateLabel(i, "content", e.target.value)} className="flex-1 bg-zinc-800 text-sm" placeholder="Contenido" />
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => removeLabel(i)} className="text-red-400 opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button onClick={addLabel} className="w-full border-dashed border-zinc-700 text-zinc-500">
                                            <Plus size={14} className="mr-2" /> Agregar Etiqueta
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-zinc-900 rounded-xl p-8">
                                    <h3 className="text-white font-semibold mb-4">Vista Previa</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {labelingData.labels.map((label, i) => (
                                            <span key={i} className="px-3 py-1 rounded text-white text-sm font-medium" style={{ backgroundColor: label.color }}>
                                                {label.content || label.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-zinc-700">
                                        <h4 className="text-white font-semibold mb-4">Producto de Ejemplo</h4>
                                        <div className="bg-zinc-950 p-4 rounded-lg inline-block">
                                            <span className="text-white text-lg">$129.00</span>
                                            {labelingData.labels.find(l => l.type === "promo") && (
                                                <span className="ml-3 px-2 py-1 rounded text-white text-sm" style={{ backgroundColor: labelingData.labels.find(l => l.type === "promo")?.color }}>
                                                    {labelingData.labels.find(l => l.type === "promo")?.content}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(labelingData, null, 2));
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

export default function LabelingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="labeling"
            moduleName="Etiquetas y Labels"
            moduleSubtitle="Sistema de etiquetas para productos"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <LabelingWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
