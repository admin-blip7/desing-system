"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface CardVariant {
    name: string;
    bgColor: string;
    padding: string;
    borderRadius: string;
    shadow: string;
    border?: string;
}

interface CardsData {
    card: CardVariant;
    modal: CardVariant;
    tooltip: CardVariant;
}

const defaultCardsData: CardsData = {
    card: {
        name: "Card Base",
        bgColor: "#18181b",
        padding: "20px",
        borderRadius: "12px",
        shadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
    },
    modal: {
        name: "Modal",
        bgColor: "#27272a",
        padding: "24px",
        borderRadius: "16px",
        shadow: "0 20px 25px -5px rgba(0,0,0,0.3)"
    },
    tooltip: {
        name: "Tooltip",
        bgColor: "#3f3f46",
        padding: "8px 12px",
        borderRadius: "6px",
        shadow: "0 4px 6px -1px rgba(0,0,0,0.2)"
    }
};

function CardsContainersWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [cardsData, setCardsData] = useState<CardsData>(
        data?.content?.cardsData || defaultCardsData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedType, setSelectedType] = useState<keyof CardsData>("card");

    const updateVariant = useCallback((type: keyof CardsData, field: keyof CardVariant, value: string) => {
        setCardsData(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, cardsData } });
        if (success) setHasChanges(false);
    };

    const types: { key: keyof CardsData; icon: string; label: string }[] = [
        { key: "card", icon: "📦", label: "Card" },
        { key: "modal", icon: "🪟", label: "Modal" },
        { key: "tooltip", icon: "💬", label: "Tooltip" }
    ];

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCardsData(data?.content?.cardsData || defaultCardsData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Layers size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Cards & Contenedores</h2>
                                    <p className="text-zinc-400">Sistema de tarjetas, modales, tooltips y otros contenedores.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {types.map(t => (
                                        <div key={t.key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-4xl mb-3">{t.icon}</div>
                                            <h3 className="text-white font-medium">{t.label}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex gap-2 mb-4">
                                    {types.map(t => (
                                        <button
                                                                            key={t.key}
                                                                            onClick={() => setSelectedType(t.key)}
                                                                            className={`px-4 py-2 rounded-lg ${selectedType === t.key ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
                                                                        >
                                                                            {t.icon} {t.label}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                                                    {(["bgColor", "padding", "borderRadius", "shadow", "border"] as const).map(field => (
                                                                        <div key={field}>
                                                                            <Label className="text-sm text-zinc-400 capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
                                                                            {field === "shadow" ? (
                                                                                <select
                                                                                    value={cardsData[selectedType][field] || ""}
                                                                                    onChange={e => updateVariant(selectedType, field, e.target.value)}
                                                                                    className="w-full bg-zinc-950 border-zinc-700 rounded px-3 py-2 text-white"
                                                                                >
                                                                                    <option value="none">Sin sombra</option>
                                                                                    <option value="0 1px 3px rgba(0,0,0,0.1)">sm</option>
                                                                                    <option value="0 4px 6px -1px rgba(0,0,0,0.1)">md</option>
                                                                                    <option value="0 10px 15px -3px rgba(0,0,0,0.1)">lg</option>
                                                                                    <option value="0 20px 25px -5px rgba(0,0,0,0.1)">xl</option>
                                                                                </select>
                                                                            ) : (
                                                                                <Input
                                                                                    value={cardsData[selectedType][field as keyof Omit<CardVariant, "shadow" | "name">] || ""}
                                                                                    onChange={e => updateVariant(selectedType, field, e.target.value)}
                                                                                    className="font-mono text-sm bg-zinc-950 border-zinc-700"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-4xl mx-auto space-y-8">
                                                                <div className="bg-zinc-900 rounded-xl p-8">
                                                                    <h3 className="text-white font-semibold mb-4">Cards</h3>
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        {[
                                                                            { title: "Producto", desc: "Descripción del producto" },
                                                                            { title: "Usuario", desc: "Información de perfil" },
                                                                            { title: "Estadística", desc: "Datos destacados" }
                                                                        ].map((card, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="p-5 rounded-xl"
                                                                                style={{
                                                                                    backgroundColor: cardsData.card.bgColor,
                                                                                    padding: cardsData.card.padding,
                                                                                    borderRadius: cardsData.card.borderRadius,
                                                                                    boxShadow: cardsData.card.shadow
                                                                                }}
                                                                            >
                                                                                <h4 className="text-white font-medium mb-2">{card.title}</h4>
                                                                                <p className="text-zinc-400 text-sm">{card.desc}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-zinc-900 rounded-xl p-8">
                                                                    <h3 className="text-white font-semibold mb-4">Modal & Tooltip</h3>
                                                                    <div className="flex items-center justify-center gap-8">
                                                                        <div
                                                                            className="p-6"
                                                                            style={{
                                                                                backgroundColor: cardsData.modal.bgColor,
                                                                                borderRadius: cardsData.modal.borderRadius,
                                                                                boxShadow: cardsData.modal.shadow
                                                                            }}
                                                                        >
                                                                            <p className="text-white">Modal Preview</p>
                                                                        </div>
                                                                        <div className="relative">
                                                                            <button className="text-blue-400 underline">Hover me</button>
                                                                            <div
                                                                                className="absolute bottom-full left-0 mb-2"
                                                                                style={{
                                                                                    backgroundColor: cardsData.tooltip.bgColor,
                                                                                    padding: cardsData.tooltip.padding,
                                                                                    borderRadius: cardsData.tooltip.borderRadius,
                                                                                    boxShadow: cardsData.tooltip.shadow,
                                                                                    whiteSpace: "nowrap"
                                                                                }}
                                                                            >
                                                                                <span className="text-white text-sm">Tooltip text</span>
                                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[rgba(0,0,0,0.2)]"></div>
                                                                            </div>
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
                                                                        navigator.clipboard.writeText(JSON.stringify(cardsData, null, 2));
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

export default function CardsContainersWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="cardsContainers"
            moduleName="Cards & Contenedores"
            moduleSubtitle="Tarjetas, modales, tooltips y más"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <CardsContainersWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
