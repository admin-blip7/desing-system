"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MousePointer, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface ButtonVariant {
    bgColor: string;
    textColor: string;
    borderColor?: string;
    borderRadius: string;
    paddingX: string;
    paddingY: string;
    fontSize: string;
    fontWeight: string;
}

interface ButtonsData {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    outline: ButtonVariant;
    ghost: ButtonVariant;
    danger: ButtonVariant;
}

const defaultButtonsData: ButtonsData = {
    primary: { bgColor: "#000000", textColor: "#FFFFFF", borderRadius: "8px", paddingX: "16px", paddingY: "8px", fontSize: "14px", fontWeight: "500" },
    secondary: { bgColor: "#E5E5E5", textColor: "#000000", borderRadius: "8px", paddingX: "16px", paddingY: "8px", fontSize: "14px", fontWeight: "500" },
    outline: { bgColor: "transparent", textColor: "#000000", borderColor: "#000000", borderRadius: "8px", paddingX: "16px", paddingY: "8px", fontSize: "14px", fontWeight: "500" },
    ghost: { bgColor: "transparent", textColor: "#000000", borderRadius: "8px", paddingX: "16px", paddingY: "8px", fontSize: "14px", fontWeight: "500" },
    danger: { bgColor: "#DC2626", textColor: "#FFFFFF", borderRadius: "8px", paddingX: "16px", paddingY: "8px", fontSize: "14px", fontWeight: "500" }
};

const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;

function ButtonsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [buttonsData, setButtonsData] = useState<ButtonsData>(data?.content?.buttonsData || defaultButtonsData);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<typeof variants[number]>("primary");

    const updateVariant = useCallback((variant: keyof ButtonsData, updates: Partial<ButtonVariant>) => {
        setButtonsData(prev => ({
            ...prev,
            [variant]: { ...prev[variant], ...updates }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, buttonsData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setButtonsData(data?.content?.buttonsData || defaultButtonsData);
        setHasChanges(false);
    };

    const renderButton = (config: ButtonVariant, size: "sm" | "md" | "lg", text: string = "Botón") => {
        const sizeMap = { sm: { scale: 0.85 }, md: { scale: 1 }, lg: { scale: 1.15 } };
        const s = sizeMap[size];

        return (
            <button
                style={{
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    border: config.borderColor ? `1px solid ${config.borderColor}` : undefined,
                    borderRadius: config.borderRadius,
                    padding: `${parseFloat(config.paddingY) * s.scale}px ${parseFloat(config.paddingX) * s.scale}px`,
                    fontSize: `${parseFloat(config.fontSize) * s.scale}px`,
                    fontWeight: config.fontWeight
                }}
                className="transition-transform hover:scale-105 active:scale-95"
            >
                {text}
            </button>
        );
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><MousePointer size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Sistema de Botones</h2>
                                    <p className="text-zinc-400">Define las variantes, tamaños y estados de los botones de tu interfaz.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Variantes Disponibles</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {variants.map(v => (
                                            <div key={v} className="space-y-2">
                                                <p className="text-white font-medium capitalize">{v}</p>
                                                {renderButton(buttonsData[v], "md")}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Tamaños</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {(["sm", "md", "lg"] as const).map(size => (
                                            <div key={size} className="space-y-2">
                                                <p className="text-zinc-500 text-sm uppercase">{size}</p>
                                                {renderButton(buttonsData.primary, size)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Configurar Variantes</h3>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {variants.map(variant => (
                                        <button
                                            key={variant}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-lg capitalize ${
                                                selectedVariant === variant
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                            }`}
                                        >
                                            {variant}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Color de Fondo</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    type="color"
                                                    value={buttonsData[selectedVariant].bgColor}
                                                    onChange={e => updateVariant(selectedVariant, { bgColor: e.target.value })}
                                                    className="w-12 h-10 p-1"
                                                />
                                                <Input
                                                    value={buttonsData[selectedVariant].bgColor}
                                                    onChange={e => updateVariant(selectedVariant, { bgColor: e.target.value })}
                                                    className="flex-1 font-mono text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm text-zinc-400">Color de Texto</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    type="color"
                                                    value={buttonsData[selectedVariant].textColor}
                                                    onChange={e => updateVariant(selectedVariant, { textColor: e.target.value })}
                                                    className="w-12 h-10 p-1"
                                                />
                                                <Input
                                                    value={buttonsData[selectedVariant].textColor}
                                                    onChange={e => updateVariant(selectedVariant, { textColor: e.target.value })}
                                                    className="flex-1 font-mono text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm text-zinc-400">Border Radius</Label>
                                            <Input
                                                value={buttonsData[selectedVariant].borderRadius}
                                                onChange={e => updateVariant(selectedVariant, { borderRadius: e.target.value })}
                                                placeholder="8px"
                                                className="font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm text-zinc-400">Padding X</Label>
                                            <Input
                                                value={buttonsData[selectedVariant].paddingX}
                                                onChange={e => updateVariant(selectedVariant, { paddingX: e.target.value })}
                                                placeholder="16px"
                                                className="font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm text-zinc-400">Padding Y</Label>
                                            <Input
                                                value={buttonsData[selectedVariant].paddingY}
                                                onChange={e => updateVariant(selectedVariant, { paddingY: e.target.value })}
                                                placeholder="8px"
                                                className="font-mono text-sm"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm text-zinc-400">Font Size</Label>
                                            <Input
                                                value={buttonsData[selectedVariant].fontSize}
                                                onChange={e => updateVariant(selectedVariant, { fontSize: e.target.value })}
                                                placeholder="14px"
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    {(selectedVariant === "outline" || selectedVariant === "ghost") && (
                                        <div>
                                            <Label className="text-sm text-zinc-400">Border Color (outline)</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    type="color"
                                                    value={buttonsData[selectedVariant].borderColor || "#000000"}
                                                    onChange={e => updateVariant(selectedVariant, { borderColor: e.target.value })}
                                                    className="w-12 h-10 p-1"
                                                />
                                                <Input
                                                    value={buttonsData[selectedVariant].borderColor || ""}
                                                    onChange={e => updateVariant(selectedVariant, { borderColor: e.target.value || undefined })}
                                                    className="flex-1 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Variantes de Botones</h3>
                                    <div className="bg-white rounded-xl p-8 flex flex-wrap gap-4">
                                        {variants.map(v => (
                                            <div key={v} className="space-y-2">
                                                <p className="text-zinc-600 text-sm capitalize">{v}</p>
                                                {renderButton(buttonsData[v], "md")}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Tamaños</h3>
                                    <div className="bg-white rounded-xl p-8 flex flex-wrap items-end gap-4">
                                        {(["sm", "md", "lg"] as const).map(size => (
                                            <div key={size} className="space-y-2">
                                                <p className="text-zinc-600 text-sm uppercase">{size}</p>
                                                {renderButton(buttonsData.primary, size)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Estados</h3>
                                    <div className="bg-white rounded-xl p-8 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-600 text-sm w-24">Default</span>
                                            {renderButton(buttonsData.primary, "md")}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-600 text-sm w-24">Hover</span>
                                            <div className="opacity-80">{renderButton(buttonsData.primary, "md")}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-600 text-sm w-24">Disabled</span>
                                            <div className="opacity-50">{renderButton(buttonsData.primary, "md")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(buttonsData, null, 2));
                                    toast.success("JSON copiado al portapapeles");
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

export default function ButtonsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="buttons"
            moduleName="Botones"
            moduleSubtitle="Sistema de botones de la interfaz"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <ButtonsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
