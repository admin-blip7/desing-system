"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Car, Edit, Eye, Download, Truck, Van, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface VehicleType {
    id: string;
    name: string;
    category: "car" | "suv" | "truck" | "van" | "motorcycle" | "bicycle";
    logoPlacement: "hood" | "side" | "rear" | "roof" | "full-wrap";
    dimensions: string;
    notes: string;
}

interface VehicleDecal {
    name: string;
    fileType: "vector" | "raster";
    minDpi: number;
    colorSpace: "CMYK" | "RGB" | "Pantone";
}

interface VehiclesData {
    vehicleTypes: VehicleType[];
    decals: VehicleDecal[];
    fullWrapSpecs: {
        material: string;
        laminate: boolean;
                        lifespan: string;
        provider: string;
    };
    magneticSpecs: {
        material: string;
        thickness: string;
        minSize: string;
        maxSize: string;
    };
}

const defaultVehiclesData: VehiclesData = {
    vehicleTypes: [
        {
            id: "1",
            name: "Sedán Ejecutivo",
            category: "car",
            logoPlacement: "hood",
            dimensions: "4.5m x 1.8m",
            notes: "Logo en capó, contacto en puertas traseras"
        },
        {
            id: "2",
            name: "Van de Entrega",
            category: "van",
            logoPlacement: "full-wrap",
            dimensions: "5.5m x 2m x 2.2m",
            notes: "Full wrap con branding completo en lateral y trasero"
        }
    ],
    decals: [
        { name: "Logo principal", fileType: "vector", minDpi: 300, colorSpace: "CMYK" },
        { name: "Datos de contacto", fileType: "vector", minDpi: 300, colorSpace: "CMYK" },
        { name: "Imágenes promocionales", fileType: "raster", minDpi: 150, colorSpace: "CMYK" }
    ],
    fullWrapSpecs: {
        material: "Vinilo de alta adherencia 3M",
        laminate: true,
        lifespan: "3-5 años",
        provider: "Proveedor especializado en gráficos vehiculares"
    },
    magneticSpecs: {
        material: "Magnético de 0.8mm",
        thickness: "0.8mm",
        minSize: "30cm x 30cm",
        maxSize: "60cm x 90cm"
    }
};

function VehiclesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [vehicleData, setVehicleData] = useState<VehiclesData>(data?.content?.vehicleData || defaultVehiclesData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
    const [newVehicle, setNewVehicle] = useState<Partial<VehicleType>>({});

    const updateField = useCallback((field: keyof VehiclesData, value: any) => {
        setVehicleData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateWrapSpec = useCallback((field: keyof VehiclesData["fullWrapSpecs"], value: any) => {
        setVehicleData(prev => ({
            ...prev,
            fullWrapSpecs: { ...prev.fullWrapSpecs, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const updateMagneticSpec = useCallback((field: keyof VehiclesData["magneticSpecs"], value: any) => {
        setVehicleData(prev => ({
            ...prev,
            magneticSpecs: { ...prev.magneticSpecs, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const updateVehicle = useCallback((id: string, field: keyof VehicleType, value: any) => {
        setVehicleData(prev => ({
            ...prev,
            vehicleTypes: prev.vehicleTypes.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
        setHasChanges(true);
    }, []);

    const addVehicle = useCallback(() => {
        if (newVehicle.name && newVehicle.category) {
            const vehicle: VehicleType = {
                id: Date.now().toString(),
                name: newVehicle.name,
                category: newVehicle.category as any,
                logoPlacement: newVehicle.logoPlacement || "side",
                dimensions: newVehicle.dimensions || "",
                notes: newVehicle.notes || ""
            };
            setVehicleData(prev => ({ ...prev, vehicleTypes: [...prev.vehicleTypes, vehicle] }));
            setNewVehicle({});
            setHasChanges(true);
        }
    }, [newVehicle]);

    const deleteVehicle = useCallback((id: string) => {
        setVehicleData(prev => ({ ...prev, vehicleTypes: prev.vehicleTypes.filter(v => v.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, vehicleData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setVehicleData(data?.content?.vehicleData || defaultVehiclesData);
        setHasChanges(false);
    };

    const getVehicleIcon = (category: VehicleType["category"]) => {
        switch (category) {
            case "car":
            case "suv":
                return <Car size={20} />;
            case "truck":
                return <Truck size={20} />;
            case "van":
                return <Van size={20} />;
            case "motorcycle":
                return <Bike size={20} />;
            default:
                return <Car size={20} />;
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
                        <TabsTrigger value="overview"><Car size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Branding Vehicular</h2>
                                    <p className="text-zinc-400">Especificaciones para aplicar marca en flotas y vehículos.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Full Wrap", icon: "🚐", desc: "Cubierta completa" },
                                        { title: "Magnéticos", icon: "🧲", desc: "Removibles" },
                                        { title: "Decalcos", icon: "🏷️", desc: "Aplicaciones específicas" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Tipos de Vehículo</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {vehicleData.vehicleTypes.map(vehicle => (
                                            <div key={vehicle.id} className="bg-zinc-950 rounded-lg p-3 flex items-center gap-3">
                                                <div className="text-zinc-400">{getVehicleIcon(vehicle.category)}</div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{vehicle.name}</p>
                                                    <p className="text-zinc-500 text-xs capitalize">{vehicle.category}</p>
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
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Tipos de Vehículo</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingVehicle("new")} className="bg-zinc-800">
                                            Agregar Vehículo
                                        </Button>
                                    </div>

                                    {editingVehicle === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre</Label>
                                                    <Input value={newVehicle.name || ""} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} placeholder="Ej: Camión de reparto" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Categoría</Label>
                                                    <select value={newVehicle.category || "car"} onChange={e => setNewVehicle({ ...newVehicle, category: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="car">Automóvil</option>
                                                        <option value="suv">SUV</option>
                                                        <option value="truck">Camión</option>
                                                        <option value="van">Van</option>
                                                        <option value="motorcycle">Motocicleta</option>
                                                        <option value="bicycle">Bicicleta</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Ubicación del Logo</Label>
                                                    <select value={newVehicle.logoPlacement || "side"} onChange={e => setNewVehicle({ ...newVehicle, logoPlacement: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="hood">Capó</option>
                                                        <option value="side">Lateral</option>
                                                        <option value="rear">Trasero</option>
                                                        <option value="roof">Techo</option>
                                                        <option value="full-wrap">Full Wrap</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Dimensiones</Label>
                                                    <Input value={newVehicle.dimensions || ""} onChange={e => setNewVehicle({ ...newVehicle, dimensions: e.target.value })} placeholder="Ej: 5m x 2m" className="bg-zinc-950" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Notas</Label>
                                                <Textarea value={newVehicle.notes || ""} onChange={e => setNewVehicle({ ...newVehicle, notes: e.target.value })} placeholder="Instrucciones específicas..." className="bg-zinc-950" rows={2} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addVehicle} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingVehicle(null); setNewVehicle({ }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {vehicleData.vehicleTypes.map(vehicle => (
                                            <div key={vehicle.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-zinc-400">{getVehicleIcon(vehicle.category)}</div>
                                                        <div>
                                                            <h4 className="text-white font-medium">{vehicle.name}</h4>
                                                            <p className="text-sm text-zinc-500 capitalize">{vehicle.category}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteVehicle(vehicle.id)} className="text-red-400 hover:text-red-300">
                                                        ×
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Logo</Label>
                                                        <select value={vehicle.logoPlacement} onChange={e => updateVehicle(vehicle.id, "logoPlacement", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                                                            <option value="hood">Capó</option>
                                                            <option value="side">Lateral</option>
                                                            <option value="rear">Trasero</option>
                                                            <option value="roof">Techo</option>
                                                            <option value="full-wrap">Full Wrap</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Dimensiones</Label>
                                                        <Input value={vehicle.dimensions} onChange={e => updateVehicle(vehicle.id, "dimensions", e.target.value)} className="bg-zinc-950" />
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <Label className="text-xs text-zinc-500">Notas</Label>
                                                    <Textarea value={vehicle.notes} onChange={e => updateVehicle(vehicle.id, "notes", e.target.value)} className="bg-zinc-950" rows={2} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-white font-semibold">Especificaciones Full Wrap</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-xs text-zinc-500">Material</Label>
                                                <Input value={vehicleData.fullWrapSpecs.material} onChange={e => updateWrapSpec("material", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="laminate" checked={vehicleData.fullWrapSpecs.laminate} onChange={e => updateWrapSpec("laminate", e.target.checked)} className="w-5 h-5" />
                                                <Label htmlFor="laminate" className="text-sm text-zinc-400">Con laminado</Label>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Vida útil</Label>
                                                <Input value={vehicleData.fullWrapSpecs.lifespan} onChange={e => updateWrapSpec("lifespan", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Proveedor</Label>
                                                <Input value={vehicleData.fullWrapSpecs.provider} onChange={e => updateWrapSpec("provider", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-white font-semibold">Especificaciones Magnéticos</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-xs text-zinc-500">Material</Label>
                                                <Input value={vehicleData.magneticSpecs.material} onChange={e => updateMagneticSpec("material", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Espesor</Label>
                                                <Input value={vehicleData.magneticSpecs.thickness} onChange={e => updateMagneticSpec("thickness", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Tamaño mínimo</Label>
                                                <Input value={vehicleData.magneticSpecs.minSize} onChange={e => updateMagneticSpec("minSize", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Tamaño máximo</Label>
                                                <Input value={vehicleData.magneticSpecs.maxSize} onChange={e => updateMagneticSpec("maxSize", e.target.value)} className="bg-zinc-950" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Especificaciones de Decalcos</h3>
                                    {vehicleData.decals.map((decal, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-3">
                                            <Input value={decal.name} onChange={e => {
                                                const updated = [...vehicleData.decals];
                                                updated[i] = { ...decal, name: e.target.value };
                                                updateField("decals", updated);
                                            }} placeholder="Nombre" className="bg-zinc-950" />
                                            <select value={decal.fileType} onChange={e => {
                                                const updated = [...vehicleData.decals];
                                                updated[i] = { ...decal, fileType: e.target.value as any };
                                                updateField("decals", updated);
                                            }} className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                                                <option value="vector">Vector</option>
                                                <option value="raster">Raster</option>
                                            </select>
                                            <Input type="number" value={decal.minDpi} onChange={e => {
                                                const updated = [...vehicleData.decals];
                                                updated[i] = { ...decal, minDpi: parseInt(e.target.value) };
                                                updateField("decals", updated);
                                            }} placeholder="DPI mín" className="bg-zinc-950" />
                                            <select value={decal.colorSpace} onChange={e => {
                                                const updated = [...vehicleData.decals];
                                                updated[i] = { ...decal, colorSpace: e.target.value as any };
                                                updateField("decals", updated);
                                            }} className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                                                <option value="CMYK">CMYK</option>
                                                <option value="RGB">RGB</option>
                                                <option value="Pantone">Pantone</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Vista Previa de Vehículos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vehicleData.vehicleTypes.map(vehicle => (
                                            <div key={vehicle.id} className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center">
                                                        {getVehicleIcon(vehicle.category)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{vehicle.name}</h4>
                                                        <p className="text-sm text-zinc-500 capitalize">{vehicle.category} • {vehicle.dimensions}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-zinc-400">Logo:</span>
                                                        <span className="text-white capitalize">{vehicle.logoPlacement.replace("-", " ")}</span>
                                                    </div>
                                                    {vehicle.notes && (
                                                        <div className="bg-zinc-800 rounded p-2 text-zinc-400 text-xs mt-2">
                                                            {vehicle.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 rounded-xl p-5">
                                        <h3 className="text-white font-semibold mb-3">Full Wrap</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Material:</span>
                                                <span className="text-white">{vehicleData.fullWrapSpecs.material}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Laminado:</span>
                                                <span className="text-white">{vehicleData.fullWrapSpecs.laminate ? "Sí" : "No"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Vida útil:</span>
                                                <span className="text-white">{vehicleData.fullWrapSpecs.lifespan}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 rounded-xl p-5">
                                        <h3 className="text-white font-semibold mb-3">Magnéticos</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Material:</span>
                                                <span className="text-white">{vehicleData.magneticSpecs.material}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Espesor:</span>
                                                <span className="text-white">{vehicleData.magneticSpecs.thickness}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Tamaño:</span>
                                                <span className="text-white">{vehicleData.magneticSpecs.minSize} - {vehicleData.magneticSpecs.maxSize}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(vehicleData, null, 2));
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

export default function VehiclesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="vehicles"
            moduleName="Vehículos"
            moduleSubtitle="Branding para flotas vehiculares"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <VehiclesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
