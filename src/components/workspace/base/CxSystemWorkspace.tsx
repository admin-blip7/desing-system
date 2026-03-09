"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Edit, Eye, Download, Plus, Trash2, MessageCircle, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface Touchpoint {
    id: string;
    name: string;
    stage: "awareness" | "consideration" | "purchase" | "retention" | "advocacy";
    channel: string;
    experience: string;
    painPoints: string[];
    opportunities: string[];
}

interface JourneyStage {
    name: string;
    color: string;
    description: string;
}

interface CxData {
    touchpoints: Touchpoint[];
    journeyStages: JourneyStage[];
    principles: string[];
    metrics: Array<{ name: string; target: string; current: string }>;
}

const defaultCxData: CxData = {
    touchpoints: [
        {
            id: "1",
            name: "Descubre la marca",
            stage: "awareness",
            channel: "Redes sociales",
            experience: "Primer contacto visual con contenido atractivo",
            painPoints: ["Dificultad para encontrar información"],
            opportunities: ["Mejorar SEO", "Contenido educativo"]
        },
        {
            id: "2",
            name: "Visita la tienda",
            stage: "purchase",
            channel: "Presencial",
            experience: "Atención personalizada y ambiente de marca",
            painPoints: ["Tiempos de espera"],
            opportunities: ["Sistema de citas", "Autocheckout"]
        }
    ],
    journeyStages: [
        { name: "Descubrimiento", color: "#3B82F6", description: "El cliente conoce la marca" },
        { name: "Consideración", color: "#8B5CF6", description: "Evalúa opciones" },
        { name: "Compra", color: "#EC4899", description: "Toma la decisión" },
        { name: "Retención", color: "#F59E0B", description: "Fidelización" },
        { name: "Recomendación", color: "#10B981", description: "Promotor de marca" }
    ],
    principles: [
        "Cada interacción cuenta",
        "Personalización sobre estandarización",
        "Proactividad en la resolución",
        "Consistencia en todos los canales"
    ],
    metrics: [
        { name: "NPS", target: "> 70", current: "65" },
        { name: "CSAT", target: "> 4.5/5", current: "4.2/5" },
        { name: "Retención", target: "> 80%", current: "75%" }
    ]
};

function CxSystemWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [cxData, setCxData] = useState<CxData>(data?.content?.cxData || defaultCxData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingTouchpoint, setEditingTouchpoint] = useState<string | null>(null);
    const [newTouchpoint, setNewTouchpoint] = useState<Partial<Touchpoint>>({ painPoints: [], opportunities: [] });

    const updateField = useCallback((field: keyof CxData, value: any) => {
        setCxData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateTouchpoint = useCallback((id: string, field: keyof Touchpoint, value: any) => {
        setCxData(prev => ({
            ...prev,
            touchpoints: prev.touchpoints.map(t => t.id === id ? { ...t, [field]: value } : t)
        }));
        setHasChanges(true);
    }, []);

    const addTouchpoint = useCallback(() => {
        if (newTouchpoint.name && newTouchpoint.stage) {
            const touchpoint: Touchpoint = {
                id: Date.now().toString(),
                name: newTouchpoint.name,
                stage: newTouchpoint.stage as any,
                channel: newTouchpoint.channel || "",
                experience: newTouchpoint.experience || "",
                painPoints: newTouchpoint.painPoints || [],
                opportunities: newTouchpoint.opportunities || []
            };
            setCxData(prev => ({ ...prev, touchpoints: [...prev.touchpoints, touchpoint] }));
            setNewTouchpoint({ painPoints: [], opportunities: [] });
            setHasChanges(true);
        }
    }, [newTouchpoint]);

    const deleteTouchpoint = useCallback((id: string) => {
        setCxData(prev => ({ ...prev, touchpoints: prev.touchpoints.filter(t => t.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, cxData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setCxData(data?.content?.cxData || defaultCxData);
        setHasChanges(false);
    };

    const getStageInfo = (stage: Touchpoint["stage"]) => {
        const stageMap: Record<Touchpoint["stage"], { icon: React.ReactNode; color: string }> = {
            awareness: { icon: <Zap size={16} />, color: "#3B82F6" },
            consideration: { icon: <MessageCircle size={16} />, color: "#8B5CF6" },
            purchase: { icon: <Star size={16} />, color: "#EC4899" },
            retention: { icon: <Heart size={16} />, color: "#F59E0B" },
            advocacy: { icon: <Star size={16} />, color: "#10B981" }
        };
        return stageMap[stage];
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
                        <TabsTrigger value="overview"><Heart size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Sistema de Experiencia del Cliente</h2>
                                    <p className="text-zinc-400">Framework para diseñar y gestionar experiencias consistentes.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Touchpoints", icon: "🎯", desc: "Puntos de contacto" },
                                        { title: "Journey", icon: "🗺️", desc: "Mapa del recorrido" },
                                        { title: "Métricas", icon: "📊", desc: "KPIs de experiencia" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Principios de Experiencia</h3>
                                    <ul className="space-y-2">
                                        {cxData.principles.map((principle, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className="text-amber-500">✓</span>
                                                {principle}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Touchpoints</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingTouchpoint("new")} className="bg-zinc-800">
                                            <Plus size={14} className="mr-2" /> Agregar Touchpoint
                                        </Button>
                                    </div>

                                    {editingTouchpoint === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre</Label>
                                                    <Input value={newTouchpoint.name || ""} onChange={e => setNewTouchpoint({ ...newTouchpoint, name: e.target.value })} placeholder="Ej: Descubre la marca" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Etapa</Label>
                                                    <select value={newTouchpoint.stage || "awareness"} onChange={e => setNewTouchpoint({ ...newTouchpoint, stage: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="awareness">Descubrimiento</option>
                                                        <option value="consideration">Consideración</option>
                                                        <option value="purchase">Compra</option>
                                                        <option value="retention">Retención</option>
                                                        <option value="advocacy">Recomendación</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Canal</Label>
                                                    <Input value={newTouchpoint.channel || ""} onChange={e => setNewTouchpoint({ ...newTouchpoint, channel: e.target.value })} placeholder="Ej: Redes sociales" className="bg-zinc-950" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Experiencia esperada</Label>
                                                <Textarea value={newTouchpoint.experience || ""} onChange={e => setNewTouchpoint({ ...newTouchpoint, experience: e.target.value })} placeholder="Describe la experiencia..." className="bg-zinc-950" rows={2} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addTouchpoint} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingTouchpoint(null); setNewTouchpoint({ painPoints: [], opportunities: [] }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {cxData.touchpoints.map(touchpoint => {
                                            const stageInfo = getStageInfo(touchpoint.stage);
                                            return (
                                                <div key={touchpoint.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: stageInfo.color + "20" }}>
                                                                <span style={{ color: stageInfo.color }}>{stageInfo.icon}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-white font-medium">{touchpoint.name}</h4>
                                                                <p className="text-sm text-zinc-500">{touchpoint.channel}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => deleteTouchpoint(touchpoint.id)} className="text-red-400 hover:text-red-300">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <Label className="text-xs text-zinc-500">Etapa</Label>
                                                            <select value={touchpoint.stage} onChange={e => updateTouchpoint(touchpoint.id, "stage", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                                                                <option value="awareness">Descubrimiento</option>
                                                                <option value="consideration">Consideración</option>
                                                                <option value="purchase">Compra</option>
                                                                <option value="retention">Retención</option>
                                                                <option value="advocacy">Recomendación</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-zinc-500">Canal</Label>
                                                            <Input value={touchpoint.channel} onChange={e => updateTouchpoint(touchpoint.id, "channel", e.target.value)} className="bg-zinc-950" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <Label className="text-xs text-zinc-500">Experiencia</Label>
                                                        <Textarea value={touchpoint.experience} onChange={e => updateTouchpoint(touchpoint.id, "experience", e.target.value)} className="bg-zinc-950" rows={2} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                                        <div>
                                                            <Label className="text-xs text-zinc-500">Puntos de dolor (separados por coma)</Label>
                                                            <Input value={touchpoint.painPoints.join(", ")} onChange={e => updateTouchpoint(touchpoint.id, "painPoints", e.target.value.split(", "))} className="bg-zinc-950" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-zinc-500">Oportunidades (separadas por coma)</Label>
                                                            <Input value={touchpoint.opportunities.join(", ")} onChange={e => updateTouchpoint(touchpoint.id, "opportunities", e.target.value.split(", "))} className="bg-zinc-950" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Principios de Experiencia</h3>
                                    {cxData.principles.map((principle, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={principle} onChange={e => {
                                                const updated = [...cxData.principles];
                                                updated[i] = e.target.value;
                                                updateField("principles", updated);
                                            }} className="bg-zinc-950" />
                                            <Button variant="ghost" size="sm" onClick={() => updateField("principles", cxData.principles.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("principles", [...cxData.principles, ""])} className="bg-zinc-800">Agregar principio</Button>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Métricas</h3>
                                    {cxData.metrics.map((metric, i) => (
                                        <div key={i} className="grid grid-cols-3 gap-3">
                                            <Input value={metric.name} onChange={e => {
                                                const updated = [...cxData.metrics];
                                                updated[i] = { ...metric, name: e.target.value };
                                                updateField("metrics", updated);
                                            }} placeholder="Nombre" className="bg-zinc-950" />
                                            <Input value={metric.target} onChange={e => {
                                                const updated = [...cxData.metrics];
                                                updated[i] = { ...metric, target: e.target.value };
                                                updateField("metrics", updated);
                                            }} placeholder="Objetivo" className="bg-zinc-950" />
                                            <div className="flex gap-2">
                                                <Input value={metric.current} onChange={e => {
                                                    const updated = [...cxData.metrics];
                                                    updated[i] = { ...metric, current: e.target.value };
                                                    updateField("metrics", updated);
                                                }} placeholder="Actual" className="bg-zinc-950 flex-1" />
                                                <Button variant="ghost" size="sm" onClick={() => updateField("metrics", cxData.metrics.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("metrics", [...cxData.metrics, { name: "", target: "", current: "" }])} className="bg-zinc-800">Agregar métrica</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Journey Map</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-4">
                                        {cxData.journeyStages.map((stage, i) => (
                                            <div key={i} className="flex-shrink-0 w-32">
                                                <div className="h-2 rounded-t-lg" style={{ backgroundColor: stage.color }} />
                                                <div className="bg-zinc-950 rounded-b-lg p-3 text-center border-x border-b border-zinc-800">
                                                    <p className="text-white font-medium text-sm">{stage.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Touchpoints por Etapa</h3>
                                    <div className="space-y-4">
                                        {cxData.journeyStages.map((stage, i) => {
                                            const stageTouchpoints = cxData.touchpoints.filter(t => t.stage === stage.name.toLowerCase().replace("ación", "").replace("n", "n"));
                                            const stageKey = stage.name.toLowerCase().replace("ciación", "cy").replace("ón", "on").replace("amiento", "areness").replace("ación", "acy").replace("ón", "on") as Touchpoint["stage"];
                                            const mappedKey: Touchpoint["stage"][] = ["awareness", "consideration", "purchase", "retention", "advocacy"];
                                            const key = mappedKey[i] || "awareness";
                                            const filtered = cxData.touchpoints.filter(t => t.stage === key);
                                            return (
                                                <div key={i}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                                                        <h4 className="text-white font-medium">{stage.name}</h4>
                                                    </div>
                                                    <div className="ml-5 space-y-2">
                                                        {filtered.length > 0 ? filtered.map(t => (
                                                            <div key={t.id} className="bg-zinc-950 rounded-lg p-3 text-sm">
                                                                <p className="text-white">{t.name}</p>
                                                                <p className="text-zinc-500 text-xs">{t.channel}</p>
                                                            </div>
                                                        )) : (
                                                            <p className="text-zinc-600 text-sm italic">Sin touchpoints configurados</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">KPIs de Experiencia</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {cxData.metrics.map((metric, i) => (
                                            <div key={i} className="bg-zinc-950 rounded-lg p-4">
                                                <p className="text-zinc-400 text-sm">{metric.name}</p>
                                                <div className="flex items-end gap-2 mt-2">
                                                    <p className="text-2xl font-bold text-white">{metric.current}</p>
                                                    <p className="text-zinc-500 text-xs mb-1">/ {metric.target}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(cxData, null, 2));
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

export default function CxSystemWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="cxSystem"
            moduleName="Sistema CX"
            moduleSubtitle="Customer Experience framework"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <CxSystemWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
