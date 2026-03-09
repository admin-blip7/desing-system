"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Edit, Eye, Download, Plus, Trash2, Shirt, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface UniformVariant {
    id: string;
    name: string;
    role: string;
    description: string;
    items: string[];
    colors: string[];
}

interface UniformConfig {
    logoPlacement: "left-chest" | "right-chest" | "center" | "back" | "sleeve";
    logoSize: "small" | "medium" | "large";
    embroideryColor: string;
    materials: string[];
    careInstructions: string;
}

interface UniformsData {
    config: UniformConfig;
    variants: UniformVariant[];
}

const defaultUniformsData: UniformsData = {
    config: {
        logoPlacement: "left-chest",
        logoSize: "medium",
        embroideryColor: "#000000",
        materials: ["Algodón premium", "Poliéster transpirable"],
        careInstructions: "Lavar en agua fría, no usar blanqueador, secar a temperatura baja."
    },
    variants: [
        {
            id: "1",
            name: "Staff General",
            role: "Atención al cliente",
            description: "Uniforme para personal de tienda y atención al cliente",
            items: ["Camisa polo", "Pantalón chino", "Delantal", "Gafete de identificación"],
            colors: ["#1a1a1a", "#f5f5f5", "#e74c3c"]
        },
        {
            id: "2",
            name: "Gerentes",
            role: "Supervisión",
            description: "Uniforme distinguible para personal gerencial",
            items: ["Chaqueta formal", "Camisa dress", "Corbata", "Pantalón dress"],
            colors: ["#2c3e50", "#1a1a1a", "#c0392b"]
        }
    ]
};

function UniformsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [uniformData, setUniformData] = useState<UniformsData>(data?.content?.uniformData || defaultUniformsData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingVariant, setEditingVariant] = useState<string | null>(null);
    const [newVariant, setNewVariant] = useState<Partial<UniformVariant>>({ items: [], colors: [] });

    const updateConfig = useCallback((field: keyof UniformConfig, value: any) => {
        setUniformData(prev => ({
            ...prev,
            config: { ...prev.config, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const updateVariant = useCallback((id: string, field: keyof UniformVariant, value: any) => {
        setUniformData(prev => ({
            ...prev,
            variants: prev.variants.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
        setHasChanges(true);
    }, []);

    const addVariant = useCallback(() => {
        if (newVariant.name && newVariant.role) {
            const variant: UniformVariant = {
                id: Date.now().toString(),
                name: newVariant.name,
                role: newVariant.role,
                description: newVariant.description || "",
                items: newVariant.items || [],
                colors: newVariant.colors || []
            };
            setUniformData(prev => ({ ...prev, variants: [...prev.variants, variant] }));
            setNewVariant({ items: [], colors: [] });
            setHasChanges(true);
        }
    }, [newVariant]);

    const deleteVariant = useCallback((id: string) => {
        setUniformData(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, uniformData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setUniformData(data?.content?.uniformData || defaultUniformsData);
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
                        <TabsTrigger value="overview"><User size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Uniformes</h2>
                                    <p className="text-zinc-400">Guías de vestimenta para empleados con identidad de marca.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Staff", icon: "👤", desc: "Personal de atención" },
                                        { title: "Gerentes", icon: "👔", desc: "Personal directivo" },
                                        { title: "Especiales", icon: "👷", desc: "Roles técnicos" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Configuración Global</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-zinc-500">Ubicación del Logo:</span>
                                            <p className="text-white capitalize">{uniformData.config.logoPlacement.replace("-", " ")}</p>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500">Tamaño del Logo:</span>
                                            <p className="text-white capitalize">{uniformData.config.logoSize}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Configuración General</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Ubicación del Logo</Label>
                                            <select value={uniformData.config.logoPlacement} onChange={e => updateConfig("logoPlacement", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                <option value="left-chest">Pecho izquierdo</option>
                                                <option value="right-chest">Pecho derecho</option>
                                                <option value="center">Centro</option>
                                                <option value="back">Espalda</option>
                                                <option value="sleeve">Manga</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Tamaño del Logo</Label>
                                            <select value={uniformData.config.logoSize} onChange={e => updateConfig("logoSize", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                <option value="small">Pequeño (2-3cm)</option>
                                                <option value="medium">Mediano (4-5cm)</option>
                                                <option value="large">Grande (6-8cm)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Color de Bordado</Label>
                                            <div className="flex gap-2">
                                                <input type="color" value={uniformData.config.embroideryColor} onChange={e => updateConfig("embroideryColor", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                                                <Input value={uniformData.config.embroideryColor} onChange={e => updateConfig("embroideryColor", e.target.value)} className="bg-zinc-950 flex-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Materiales</Label>
                                        <Input value={uniformData.config.materials.join(", ")} onChange={e => updateConfig("materials", e.target.value.split(", "))} placeholder="Algodón, Poliéster..." className="bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Instrucciones de Cuidado</Label>
                                        <Textarea value={uniformData.config.careInstructions} onChange={e => updateConfig("careInstructions", e.target.value)} className="bg-zinc-950" rows={3} />
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Variantes de Uniforme</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingVariant("new")} className="bg-zinc-800">
                                            <Plus size={14} className="mr-2" /> Agregar Variante
                                        </Button>
                                    </div>

                                    {editingVariant === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre</Label>
                                                    <Input value={newVariant.name || ""} onChange={e => setNewVariant({ ...newVariant, name: e.target.value })} placeholder="Ej: Staff General" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Rol</Label>
                                                    <Input value={newVariant.role || ""} onChange={e => setNewVariant({ ...newVariant, role: e.target.value })} placeholder="Ej: Atención al cliente" className="bg-zinc-950" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Descripción</Label>
                                                <Textarea value={newVariant.description || ""} onChange={e => setNewVariant({ ...newVariant, description: e.target.value })} placeholder="Describe este uniforme..." className="bg-zinc-950" rows={2} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addVariant} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingVariant(null); setNewVariant({ items: [], colors: [] }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {uniformData.variants.map(variant => (
                                            <div key={variant.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="text-white font-medium">{variant.name}</h4>
                                                        <p className="text-sm text-zinc-500">{variant.role}</p>
                                                    </div>
                                                    <button onClick={() => deleteVariant(variant.id)} className="text-red-400 hover:text-red-300">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Descripción</Label>
                                                        <Textarea value={variant.description} onChange={e => updateVariant(variant.id, "description", e.target.value)} className="bg-zinc-950" rows={2} />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Prendas (separadas por coma)</Label>
                                                        <Input value={variant.items.join(", ")} onChange={e => updateVariant(variant.id, "items", e.target.value.split(", "))} className="bg-zinc-950" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Colores (hex, separados por coma)</Label>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {variant.colors.map((color, i) => (
                                                                <div key={i} className="flex items-center gap-2 bg-zinc-950 rounded px-2 py-1">
                                                                    <div className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                                                                    <Input value={color} onChange={e => {
                                                                        const newColors = [...variant.colors];
                                                                        newColors[i] = e.target.value;
                                                                        updateVariant(variant.id, "colors", newColors);
                                                                    }} className="w-20 bg-transparent text-xs border-0 p-0" />
                                                                </div>
                                                            ))}
                                                            <Button size="sm" variant="outline" onClick={() => updateVariant(variant.id, "colors", [...variant.colors, "#000000"])} className="h-8 text-xs">+</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-8">
                                    <h3 className="text-white font-semibold mb-6">Vista Previa de Uniformes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {uniformData.variants.map(variant => (
                                            <div key={variant.id} className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                                                        <Shirt className="text-zinc-400" size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{variant.name}</h4>
                                                        <p className="text-sm text-zinc-500">{variant.role}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-zinc-400">{variant.description}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {variant.items.map((item, i) => (
                                                            <span key={i} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{item}</span>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-1 mt-3">
                                                        {variant.colors.map((color, i) => (
                                                            <div key={i} className="w-6 h-6 rounded border border-zinc-700" style={{ backgroundColor: color }} title={color} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Especificaciones del Logo</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <p className="text-zinc-500 mb-1">Ubicación</p>
                                            <p className="text-white capitalize">{uniformData.config.logoPlacement.replace("-", " ")}</p>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <p className="text-zinc-500 mb-1">Tamaño</p>
                                            <p className="text-white capitalize">{uniformData.config.logoSize}</p>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <p className="text-zinc-500 mb-1">Color Bordado</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded" style={{ backgroundColor: uniformData.config.embroideryColor }} />
                                                <span className="text-white">{uniformData.config.embroideryColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(uniformData, null, 2));
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

export default function UniformsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="uniforms"
            moduleName="Uniformes"
            moduleSubtitle="Guías de vestimenta para empleados"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <UniformsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
