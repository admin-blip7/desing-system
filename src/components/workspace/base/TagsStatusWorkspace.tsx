"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface TagStyle {
    bgColor: string;
    textColor: string;
    borderRadius: string;
    padding: string;
    fontSize: string;
}

interface StatusTag {
    name: string;
    color: string;
    label: string;
}

interface TagsData {
    styles: {
        default: TagStyle;
        success: TagStyle;
        warning: TagStyle;
        danger: TagStyle;
        info: TagStyle;
    };
    customTags: StatusTag[];
}

const defaultTagsData: TagsData = {
    styles: {
        default: { bgColor: "#27272a", textColor: "#fafafa", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" },
        success: { bgColor: "#15803d", textColor: "#ffffff", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" },
        warning: { bgColor: "#b45309", textColor: "#ffffff", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" },
        danger: { bgColor: "#b91c1c", textColor: "#ffffff", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" },
        info: { bgColor: "#0369a1", textColor: "#ffffff", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" }
    },
    customTags: [
        { name: "new", color: "#3B82F6", label: "Nuevo" },
        { name: "sale", color: "#F59E0B", label: "Oferta" },
        { name: "stock", color: "#10B981", label: "En Stock" }
    ]
};

function TagsStatusWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [tagsData, setTagsData] = useState<TagsData>(data?.content?.tagsData || defaultTagsData);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedType, setSelectedType] = useState<keyof TagsData["styles"]>("default");

    const updateStyle = useCallback((type: keyof TagsData["styles"], field: keyof TagStyle, value: string) => {
        setTagsData(prev => ({
            ...prev,
            styles: {
                ...prev.styles,
                [type]: { ...prev.styles[type], [field]: value }
            }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, tagsData } });
        if (success) setHasChanges(false);
    };

    const typeKeys: (keyof TagsData["styles"])[] = ["default", "success", "warning", "danger", "info"];

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTagsData(data?.content?.tagsData || defaultTagsData)}>Descartar</Button>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Tags & Status</h2>
                                    <p className="text-zinc-400">Badges, etiquetas e indicadores de estado.</p>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Estados Predefinidos</h3>
                                    <div className="flex flex-wrap gap-3">
                                                                        {typeKeys.map(type => (
                                                                            <Badge
                                                                                key={type}
                                                                                style={{
                                                                                    backgroundColor: tagsData.styles[type].bgColor,
                                                                                    color: tagsData.styles[type].textColor,
                                                                                    borderRadius: tagsData.styles[type].borderRadius,
                                                                                    padding: tagsData.styles[type].padding,
                                                                                    fontSize: tagsData.styles[type].fontSize
                                                                                }}
                                                                            >
                                                                                {type}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div className="flex gap-2 mb-4">
                                                                    {typeKeys.map(type => (
                                                                        <button
                                                                            key={type}
                                                                            onClick={() => setSelectedType(type)}
                                                                            className={`px-3 py-2 rounded capitalize ${selectedType === type ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
                                                                        >
                                                                            {type}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Color de Fondo</Label>
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                type="color"
                                                                                value={tagsData.styles[selectedType].bgColor}
                                                                                onChange={e => updateStyle(selectedType, "bgColor", e.target.value)}
                                                                                className="w-12 h-10 p-1"
                                                                            />
                                                                            <Input
                                                                                value={tagsData.styles[selectedType].bgColor}
                                                                                onChange={e => updateStyle(selectedType, "bgColor", e.target.value)}
                                                                                className="flex-1 font-mono text-sm bg-zinc-950"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Color de Texto</Label>
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                type="color"
                                                                                value={tagsData.styles[selectedType].textColor}
                                                                                onChange={e => updateStyle(selectedType, "textColor", e.target.value)}
                                                                                className="w-12 h-10 p-1"
                                                                            />
                                                                            <Input
                                                                                value={tagsData.styles[selectedType].textColor}
                                                                                onChange={e => updateStyle(selectedType, "textColor", e.target.value)}
                                                                                className="flex-1 font-mono text-sm bg-zinc-950"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Border Radius</Label>
                                                                        <Input
                                                                            value={tagsData.styles[selectedType].borderRadius}
                                                                            onChange={e => updateStyle(selectedType, "borderRadius", e.target.value)}
                                                                            className="font-mono text-sm bg-zinc-950"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-zinc-400">Padding</Label>
                                                                        <Input
                                                                            value={tagsData.styles[selectedType].padding}
                                                                            onChange={e => updateStyle(selectedType, "padding", e.target.value)}
                                                                            className="font-mono text-sm bg-zinc-950"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-4xl mx-auto space-y-8">
                                                                <div className="bg-zinc-900 rounded-xl p-8">
                                                                    <h3 className="text-white font-semibold mb-6">Badges de Estado</h3>
                                                                    <div className="flex flex-wrap gap-4">
                                                                        {typeKeys.map(type => (
                                                                            <Badge
                                                                                key={type}
                                                                                style={{
                                                                                    backgroundColor: tagsData.styles[type].bgColor,
                                                                                    color: tagsData.styles[type].textColor,
                                                                                    borderRadius: tagsData.styles[type].borderRadius,
                                                                                    padding: tagsData.styles[type].padding,
                                                                                    fontSize: tagsData.styles[type].fontSize
                                                                                }}
                                                                            >
                                                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-zinc-900 rounded-xl p-8">
                                                                    <h3 className="text-white font-semibold mb-6">En Contexto</h3>
                                                                    <div className="space-y-4">
                                                                        {[
                                                                            { status: "success", text: "Pedido completado" },
                                                                            { status: "warning", text: "Stock bajo" },
                                                                            { status: "danger", text: "Error de pago" },
                                                                            { status: "info", text: "Información" }
                                                                        ].map(item => (
                                                                            <div key={item.status} className="flex items-center gap-3 p-4 bg-zinc-950 rounded-lg">
                                                                                <Badge style={{
                                                                                    backgroundColor: tagsData.styles[item.status as keyof TagsData["styles"]].bgColor,
                                                                                    color: tagsData.styles[item.status as keyof TagsData["styles"]].textColor,
                                                                                    borderRadius: tagsData.styles[item.status as keyof TagsData["styles"]].borderRadius,
                                                                                    padding: tagsData.styles[item.status as keyof TagsData["styles"]].padding,
                                                                                    fontSize: tagsData.styles[item.status as keyof TagsData["styles"]].fontSize
                                                                                }}>
                                                                                    {item.status}
                                                                                </Badge>
                                                                                <span className="text-white">{item.text}</span>
                                                                            </div>
                                                                        ))}
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
                                                                        navigator.clipboard.writeText(JSON.stringify(tagsData, null, 2));
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

export default function TagsStatusWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="tagsStatus"
            moduleName="Tags & Status"
            moduleSubtitle="Badges, etiquetas e indicadores"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <TagsStatusWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
