"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileX, Loader2, AlertTriangle, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface EmptyStateStyle {
    iconColor: string;
    textColor: string;
    bgColor: string;
    iconSize: number;
}

interface StatesData {
    empty: EmptyStateStyle;
    loading: EmptyStateStyle;
    error: EmptyStateStyle;
}

const defaultStatesData: StatesData = {
    empty: { iconColor: "#71717a", textColor: "#a1a1aa", bgColor: "#27272a", iconSize: 48 },
    loading: { iconColor: "#3b82f6", textColor: "#a1a1aa", bgColor: "#27272a", iconSize: 32 },
    error: { iconColor: "#ef4444", textColor: "#a1a1aa", bgColor: "#27272a", iconSize: 48 }
};

function EmptyErrorStatesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [statesData, setStatesData] = useState<StatesData>(data?.content?.statesData || defaultStatesData);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedState, setSelectedState] = useState<keyof StatesData>("empty");

    const updateStyle = useCallback((state: keyof StatesData, field: keyof EmptyStateStyle, value: string | number) => {
        setStatesData(prev => ({
            ...prev,
            [state]: { ...prev[state], [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, statesData } });
        if (success) setHasChanges(false);
    };

    const states: { key: keyof StatesData; icon: React.ReactNode; label: string }[] = [
        { key: "empty", icon: <FileX size={20} />, label: "Empty" },
        { key: "loading", icon: <Loader2 size={20} />, label: "Loading" },
        { key: "error", icon: <AlertTriangle size={20} />, label: "Error" }
    ];

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setStatesData(data?.content?.statesData || defaultStatesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><FileX size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Empty & Error States</h2>
                                    <p className="text-zinc-400">Componentes para estados de carga, vacío y error.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {states.map(s => (
                                        <div key={s.key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-3">
                                            <div style={{ color: statesData[s.key].iconColor }}>{s.icon}</div>
                                            <h3 className="text-white font-medium">{s.label}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex gap-2 mb-4">
                                    {states.map(s => (
                                        <button
                                            key={s.key}
                                            onClick={() => setSelectedState(s.key)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${selectedState === s.key ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
                                        >
                                            {s.icon} {s.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div>
                                        <Label className="text-sm text-zinc-400">Color del Icono</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={statesData[selectedState].iconColor}
                                                onChange={e => updateStyle(selectedState, "iconColor", e.target.value)}
                                                className="w-12 h-10 p-1"
                                            />
                                            <Input
                                                value={statesData[selectedState].iconColor}
                                                onChange={e => updateStyle(selectedState, "iconColor", e.target.value)}
                                                className="flex-1 font-mono text-sm bg-zinc-950"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Color del Texto</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={statesData[selectedState].textColor}
                                                onChange={e => updateStyle(selectedState, "textColor", e.target.value)}
                                                className="w-12 h-10 p-1"
                                            />
                                            <Input
                                                value={statesData[selectedState].textColor}
                                                onChange={e => updateStyle(selectedState, "textColor", e.target.value)}
                                                className="flex-1 font-mono text-sm bg-zinc-950"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Color de Fondo</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                value={statesData[selectedState].bgColor}
                                                onChange={e => updateStyle(selectedState, "bgColor", e.target.value)}
                                                className="w-12 h-10 p-1"
                                            />
                                            <Input
                                                value={statesData[selectedState].bgColor}
                                                onChange={e => updateStyle(selectedState, "bgColor", e.target.value)}
                                                className="flex-1 font-mono text-sm bg-zinc-950"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Tamaño del Icono (px)</Label>
                                        <Input
                                            type="number"
                                            value={statesData[selectedState].iconSize}
                                            onChange={e => updateStyle(selectedState, "iconSize", parseInt(e.target.value))}
                                            className="font-mono text-sm bg-zinc-950"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(statesData).map(([key, config]) => {
                                        const iconMap = {
                                            empty: <FileX size={config.iconSize} />,
                                            loading: <Loader2 size={config.iconSize} className="animate-spin" />,
                                            error: <AlertTriangle size={config.iconSize} />
                                        };
                                        const textMap = {
                                            empty: "No hay datos disponibles",
                                            loading: "Cargando...",
                                            error: "Algo salió mal"
                                        };
                                        return (
                                            <div
                                                key={key}
                                                className="rounded-xl p-8 flex flex-col items-center justify-center gap-4"
                                                style={{ backgroundColor: config.bgColor }}
                                            >
                                                <div style={{ color: config.iconColor }}>
                                                    {iconMap[key as keyof typeof iconMap]}
                                                </div>
                                                <p style={{ color: config.textColor }} className="text-sm">
                                                    {textMap[key as keyof typeof textMap]}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button
                                    variant="outline"
                                    className="w-full h-24 flex-col gap-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(statesData, null, 2));
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

export default function EmptyErrorStatesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="emptyErrorStates"
            moduleName="Empty & Error States"
            moduleSubtitle="Estados de carga, vacío y error"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <EmptyErrorStatesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
