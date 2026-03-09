"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, Edit, Eye, Download, Map, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface MaterialSpec {
    name: string;
    finish: string;
    colorCode: string;
    application: string;
}

interface SpaceConfig {
    id: string;
    name: string;
    type: "storefront" | "office" | "warehouse" | "showroom" | "other";
    wallColor: string;
    flooring: string;
    lighting: string;
    signagePlacement: string;
    brandElements: string[];
}

interface ArchitecturalData {
    primaryMaterials: MaterialSpec[];
    spaces: SpaceConfig[];
    exteriorSignage: {
        types: string[];
        illumination: boolean;
        materials: string[];
    };
    lightingAmbience: {
        indoorKelvin: string;
        outdoorKelvin: string;
        accentColors: string[];
    };
}

const defaultArchitecturalData: ArchitecturalData = {
    primaryMaterials: [
        { name: "Paredes", finish: "Mate", colorCode: "#F5F5F5", application: "Interiores" },
        { name: "Piso", finish: "Pulido", colorCode: "#E8E8E8", application: "Tránsito medio" },
        { name: "Acabados", finish: "Brillante", colorCode: "#1A1A1A", application: "Detalles" }
    ],
    spaces: [
        {
            id: "1",
            name: "Fachada Principal",
            type: "storefront",
            wallColor: "#FFFFFF",
            flooring: "Granito pulido",
            lighting: "LED 4000K",
            signagePlacement: "Central sobre entrada",
            brandElements: ["Logo iluminado", "Vinilo ventana", "Bandera"]
        },
        {
            id: "2",
            name: "Área de Atención",
            type: "showroom",
            wallColor: "#F8F8F8",
            flooring: "Porcelanato",
            lighting: "LED 3500K",
            signagePlacement: "Pared fondo",
            brandElements: ["Backlight", "Totem", "Carteleras"]
        }
    ],
    exteriorSignage: {
        types: ["Box sign", "Channel letters", "Vinilo perforado"],
        illumination: true,
        materials: ["Acrílico", "Aluminio", "LED"]
    },
    lightingAmbience: {
        indoorKelvin: "3500K",
        outdoorKelvin: "4000K",
        accentColors: ["#FF6B35", "#004E89"]
    }
};

function ArchitecturalWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [archData, setArchData] = useState<ArchitecturalData>(data?.content?.archData || defaultArchitecturalData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingSpace, setEditingSpace] = useState<string | null>(null);
    const [newSpace, setNewSpace] = useState<Partial<SpaceConfig>>({ brandElements: [] });

    const updateField = useCallback((field: keyof ArchitecturalData, value: any) => {
        setArchData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateSpace = useCallback((id: string, field: keyof SpaceConfig, value: any) => {
        setArchData(prev => ({
            ...prev,
            spaces: prev.spaces.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
        setHasChanges(true);
    }, []);

    const addSpace = useCallback(() => {
        if (newSpace.name && newSpace.type) {
            const space: SpaceConfig = {
                id: Date.now().toString(),
                name: newSpace.name,
                type: newSpace.type as any,
                wallColor: newSpace.wallColor || "#FFFFFF",
                flooring: newSpace.flooring || "",
                lighting: newSpace.lighting || "",
                signagePlacement: newSpace.signagePlacement || "",
                brandElements: newSpace.brandElements || []
            };
            setArchData(prev => ({ ...prev, spaces: [...prev.spaces, space] }));
            setNewSpace({ brandElements: [] });
            setHasChanges(true);
        }
    }, [newSpace]);

    const deleteSpace = useCallback((id: string) => {
        setArchData(prev => ({ ...prev, spaces: prev.spaces.filter(s => s.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, archData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setArchData(data?.content?.archData || defaultArchitecturalData);
        setHasChanges(false);
    };

    const getSpaceIcon = (type: SpaceConfig["type"]) => {
        switch (type) {
            case "storefront": return <Store size={20} />;
            case "office": return <Building size={20} />;
            case "showroom": return <Home size={20} />;
            default: return <Map size={20} />;
        }
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
                        <TabsTrigger value="overview"><Building size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Arquitectura de Marca</h2>
                                    <p className="text-zinc-400">Guías de diseño para espacios físicos con identidad de marca.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Fachadas", icon: "🏢", desc: "Identidad exterior" },
                                        { title: "Interiores", icon: "🏠", desc: "Ambientes de marca" },
                                        { title: "Señalética", icon: "📍", desc: "Wayfinding" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Espacios Configurados</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {archData.spaces.map(space => (
                                            <div key={space.id} className="bg-zinc-950 rounded-lg p-3 flex items-center gap-3">
                                                <div className="text-zinc-400">{getSpaceIcon(space.type)}</div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{space.name}</p>
                                                    <p className="text-zinc-500 text-xs capitalize">{space.type}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Materiales Principales</h3>
                                    {archData.primaryMaterials.map((mat, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-3">
                                            <Input value={mat.name} onChange={e => {
                                                const updated = [...archData.primaryMaterials];
                                                updated[i] = { ...mat, name: e.target.value };
                                                updateField("primaryMaterials", updated);
                                            }} placeholder="Nombre" className="bg-zinc-950" />
                                            <Input value={mat.finish} onChange={e => {
                                                const updated = [...archData.primaryMaterials];
                                                updated[i] = { ...mat, finish: e.target.value };
                                                updateField("primaryMaterials", updated);
                                            }} placeholder="Acabado" className="bg-zinc-950" />
                                            <div className="flex gap-2">
                                                <Input value={mat.colorCode} onChange={e => {
                                                    const updated = [...archData.primaryMaterials];
                                                    updated[i] = { ...mat, colorCode: e.target.value };
                                                    updateField("primaryMaterials", updated);
                                                }} placeholder="#HEX" className="bg-zinc-950 flex-1" />
                                                <div className="w-10 h-10 rounded border border-zinc-700" style={{ backgroundColor: mat.colorCode }} />
                                            </div>
                                            <Input value={mat.application} onChange={e => {
                                                const updated = [...archData.primaryMaterials];
                                                updated[i] = { ...mat, application: e.target.value };
                                                updateField("primaryMaterials", updated);
                                            }} placeholder="Aplicación" className="bg-zinc-950" />
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Señalética Exterior</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Tipos (separados por coma)</Label>
                                            <Input value={archData.exteriorSignage.types.join(", ")} onChange={e => updateField("exteriorSignage", { ...archData.exteriorSignage, types: e.target.value.split(", ") })} className="bg-zinc-950" />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Materiales (separados por coma)</Label>
                                            <Input value={archData.exteriorSignage.materials.join(", ")} onChange={e => updateField("exteriorSignage", { ...archData.exteriorSignage, materials: e.target.value.split(", ") })} className="bg-zinc-950" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="illumination" checked={archData.exteriorSignage.illumination} onChange={e => updateField("exteriorSignage", { ...archData.exteriorSignage, illumination: e.target.checked })} className="w-5 h-5" />
                                        <Label htmlFor="illumination" className="text-sm text-zinc-400">Señalética iluminada</Label>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Ambiente Lumínico</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Temperatura Interior</Label>
                                            <select value={archData.lightingAmbience.indoorKelvin} onChange={e => updateField("lightingAmbience", { ...archData.lightingAmbience, indoorKelvin: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                <option value="2700K">2700K (Cálido)</option>
                                                <option value="3000K">3000K (Cálido)</option>
                                                <option value="3500K">3500K (Neutro)</option>
                                                <option value="4000K">4000K (Neutro)</option>
                                                <option value="5000K">5000K (Frío)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Temperatura Exterior</Label>
                                            <select value={archData.lightingAmbience.outdoorKelvin} onChange={e => updateField("lightingAmbience", { ...archData.lightingAmbience, outdoorKelvin: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                <option value="3000K">3000K (Cálido)</option>
                                                <option value="4000K">4000K (Neutro)</option>
                                                <option value="5000K">5000K (Frío)</option>
                                                <option value="6000K">6000K (Daylight)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Colores de Acento (hex, separados por coma)</Label>
                                        <Input value={archData.lightingAmbience.accentColors.join(", ")} onChange={e => updateField("lightingAmbience", { ...archData.lightingAmbience, accentColors: e.target.value.split(", ") })} className="bg-zinc-950" />
                                        <div className="flex gap-2 mt-2">
                                            {archData.lightingAmbience.accentColors.map((color, i) => (
                                                <div key={i} className="w-8 h-8 rounded border border-zinc-700" style={{ backgroundColor: color }} title={color} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Espacios</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingSpace("new")} className="bg-zinc-800">
                                            Agregar Espacio
                                        </Button>
                                    </div>

                                    {editingSpace === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre</Label>
                                                    <Input value={newSpace.name || ""} onChange={e => setNewSpace({ ...newSpace, name: e.target.value })} placeholder="Ej: Recepción" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Tipo</Label>
                                                    <select value={newSpace.type || "other"} onChange={e => setNewSpace({ ...newSpace, type: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="storefront">Fachada</option>
                                                        <option value="office">Oficina</option>
                                                        <option value="warehouse">Almacén</option>
                                                        <option value="showroom">Showroom</option>
                                                        <option value="other">Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addSpace} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingSpace(null); setNewSpace({ brandElements: [] }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {archData.spaces.map(space => (
                                            <div key={space.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-zinc-400">{getSpaceIcon(space.type)}</div>
                                                        <div>
                                                            <h4 className="text-white font-medium">{space.name}</h4>
                                                            <p className="text-sm text-zinc-500 capitalize">{space.type}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteSpace(space.id)} className="text-red-400 hover:text-red-300">
                                                        ×
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Color de Pared</Label>
                                                        <div className="flex gap-2">
                                                            <Input value={space.wallColor} onChange={e => updateSpace(space.id, "wallColor", e.target.value)} className="bg-zinc-950 flex-1" />
                                                            <div className="w-8 h-8 rounded border border-zinc-700" style={{ backgroundColor: space.wallColor }} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Piso</Label>
                                                        <Input value={space.flooring} onChange={e => updateSpace(space.id, "flooring", e.target.value)} className="bg-zinc-950" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Iluminación</Label>
                                                        <Input value={space.lighting} onChange={e => updateSpace(space.id, "lighting", e.target.value)} className="bg-zinc-950" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Ubicación Señalética</Label>
                                                        <Input value={space.signagePlacement} onChange={e => updateSpace(space.id, "signagePlacement", e.target.value)} className="bg-zinc-950" />
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <Label className="text-xs text-zinc-500">Elementos de Marca (separados por coma)</Label>
                                                    <Input value={space.brandElements.join(", ")} onChange={e => updateSpace(space.id, "brandElements", e.target.value.split(", "))} className="bg-zinc-950" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Materiales Principales</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {archData.primaryMaterials.map((mat, i) => (
                                            <div key={i} className="bg-zinc-950 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded border border-zinc-700" style={{ backgroundColor: mat.colorCode }} />
                                                    <div>
                                                        <p className="text-white font-medium">{mat.name}</p>
                                                        <p className="text-xs text-zinc-500">{mat.finish}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-zinc-400">{mat.application}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Espacios</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {archData.spaces.map(space => (
                                            <div key={space.id} className="bg-zinc-950 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="text-zinc-400">{getSpaceIcon(space.type)}</div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{space.name}</h4>
                                                        <p className="text-xs text-zinc-500 capitalize">{space.type}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: space.wallColor }} />
                                                        <span className="text-zinc-400">Paredes: {space.wallColor}</span>
                                                    </div>
                                                    <p className="text-zinc-400">🏠 Piso: {space.flooring}</p>
                                                    <p className="text-zinc-400">💡 Iluminación: {space.lighting}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {space.brandElements.map((elem, i) => (
                                                            <span key={i} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs">{elem}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Especificaciones de Señalética</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <p className="text-zinc-500 mb-2">Tipos</p>
                                            <div className="flex flex-wrap gap-1">
                                                {archData.exteriorSignage.types.map((type, i) => (
                                                    <span key={i} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{type}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <p className="text-zinc-500 mb-2">Iluminación</p>
                                            <p className="text-white">{archData.exteriorSignage.illumination ? "✅ Sí" : "❌ No"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(archData, null, 2));
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

export default function ArchitecturalWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="architectural"
            moduleName="Arquitectura"
            moduleSubtitle="Diseño de espacios físicos de marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <ArchitecturalWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
