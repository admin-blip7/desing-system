"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Edit, Eye, Download, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface Competitor {
    id: string;
    name: string;
    category: "direct" | "indirect" | "aspirational";
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
    website: string;
}

interface BenchmarkCategory {
    name: string;
    metrics: Array<{ competitor: string; score: number; notes: string }>;
}

interface BenchmarkData {
    competitors: Competitor[];
    categories: BenchmarkCategory[];
    insights: string[];
    opportunities: string[];
}

const defaultBenchmarkData: BenchmarkData = {
    competitors: [
        {
            id: "1",
            name: "Competidor Principal",
            category: "direct",
            strengths: ["Presencia digital fuerte", "Buena reputación"],
            weaknesses: ["Producto limitado", "Precio elevado"],
            marketPosition: "Líder del mercado",
            website: "https://competidor.com"
        },
        {
            id: "2",
            name: "Marca Aspiracional",
            category: "aspirational",
            strengths: ["Innovación constante", "Experiencia premium"],
            weaknesses: ["Alcance limitado", "Alto precio"],
            marketPosition: "Nicho premium",
            website: "https://aspiracional.com"
        }
    ],
    categories: [
        {
            name: "Digital Presence",
            metrics: [
                { competitor: "Nosotros", score: 8, notes: "Buen SEO, redes activas" },
                { competitor: "Competidor Principal", score: 9, notes: "Líder en búsqueda orgánica" },
                { competitor: "Marca Aspiracional", score: 7, notes: "Instagram fuerte" }
            ]
        },
        {
            name: "Product Quality",
            metrics: [
                { competitor: "Nosotros", score: 9, notes: "Materiales premium" },
                { competitor: "Competidor Principal", score: 6, notes: "Calidad estándar" },
                { competitor: "Marca Aspiracional", score: 10, notes: "Handmade, exclusivo" }
            ]
        }
    ],
    insights: [
        "El competidor principal invierte más en publicidad digital",
        "Las marcas aspiracionales están ganando en segmento premium",
        "Hay oportunidad en mejora de servicio al cliente"
    ],
    opportunities: [
        "Desarrollar línea premium para competir en nicho alto",
        "Mejorar estrategia de contenido en redes",
        "Expandir canales de venta online"
    ]
};

function BenchmarkWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [benchmarkData, setBenchmarkData] = useState<BenchmarkData>(data?.content?.benchmarkData || defaultBenchmarkData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingCompetitor, setEditingCompetitor] = useState<string | null>(null);
    const [newCompetitor, setNewCompetitor] = useState<Partial<Competitor>>({ strengths: [], weaknesses: [] });

    const updateField = useCallback((field: keyof BenchmarkData, value: any) => {
        setBenchmarkData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateCompetitor = useCallback((id: string, field: keyof Competitor, value: any) => {
        setBenchmarkData(prev => ({
            ...prev,
            competitors: prev.competitors.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
        setHasChanges(true);
    }, []);

    const addCompetitor = useCallback(() => {
        if (newCompetitor.name && newCompetitor.category) {
            const competitor: Competitor = {
                id: Date.now().toString(),
                name: newCompetitor.name,
                category: newCompetitor.category as any,
                strengths: newCompetitor.strengths || [],
                weaknesses: newCompetitor.weaknesses || [],
                marketPosition: newCompetitor.marketPosition || "",
                website: newCompetitor.website || ""
            };
            setBenchmarkData(prev => ({ ...prev, competitors: [...prev.competitors, competitor] }));
            setNewCompetitor({ strengths: [], weaknesses: [] });
            setHasChanges(true);
        }
    }, [newCompetitor]);

    const deleteCompetitor = useCallback((id: string) => {
        setBenchmarkData(prev => ({ ...prev, competitors: prev.competitors.filter(c => c.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, benchmarkData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setBenchmarkData(data?.content?.benchmarkData || defaultBenchmarkData);
        setHasChanges(false);
    };

    const getCategoryColor = (category: Competitor["category"]) => {
        switch (category) {
            case "direct": return "bg-red-500/20 text-red-400";
            case "indirect": return "bg-yellow-500/20 text-yellow-400";
            case "aspirational": return "bg-blue-500/20 text-blue-400";
            default: return "bg-zinc-500/20 text-zinc-400";
        }
    };

    const getCategoryLabel = (category: Competitor["category"]) => {
        switch (category) {
            case "direct": return "Directo";
            case "indirect": return "Indirecto";
            case "aspirational": return "Aspiracional";
            default: return category;
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
                        <TabsTrigger value="overview"><BarChart3 size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Benchmark Competitivo</h2>
                                    <p className="text-zinc-400">Análisis comparativo con competencia y referentes del mercado.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Competidores", icon: "🎯", desc: "Análisis de competencia" },
                                        { title: "Categorías", icon: "📊", desc: "Comparativas por área" },
                                        { title: "Oportunidades", icon: "💡", desc: "Áreas de mejora" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Competidores Registrados</h3>
                                    <div className="space-y-3">
                                        {benchmarkData.competitors.map(competitor => (
                                            <div key={competitor.id} className="flex items-center justify-between bg-zinc-950 rounded-lg p-3">
                                                <div>
                                                    <p className="text-white font-medium">{competitor.name}</p>
                                                    <p className="text-sm text-zinc-500">{competitor.marketPosition}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(competitor.category)}`}>
                                                    {getCategoryLabel(competitor.category)}
                                                </span>
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
                                        <h3 className="text-white font-semibold">Competidores</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingCompetitor("new")} className="bg-zinc-800">
                                            <Plus size={14} className="mr-2" /> Agregar Competidor
                                        </Button>
                                    </div>

                                    {editingCompetitor === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre</Label>
                                                    <Input value={newCompetitor.name || ""} onChange={e => setNewCompetitor({ ...newCompetitor, name: e.target.value })} placeholder="Ej: Competidor X" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Categoría</Label>
                                                    <select value={newCompetitor.category || "direct"} onChange={e => setNewCompetitor({ ...newCompetitor, category: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="direct">Directo</option>
                                                        <option value="indirect">Indirecto</option>
                                                        <option value="aspirational">Aspiracional</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Posición en Mercado</Label>
                                                    <Input value={newCompetitor.marketPosition || ""} onChange={e => setNewCompetitor({ ...newCompetitor, marketPosition: e.target.value })} placeholder="Ej: Líder del segmento" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Sitio Web</Label>
                                                    <Input value={newCompetitor.website || ""} onChange={e => setNewCompetitor({ ...newCompetitor, website: e.target.value })} placeholder="https://..." className="bg-zinc-950" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addCompetitor} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingCompetitor(null); setNewCompetitor({ strengths: [], weaknesses: [] }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {benchmarkData.competitors.map(competitor => (
                                            <div key={competitor.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(competitor.category)}`}>
                                                            {getCategoryLabel(competitor.category)}
                                                        </span>
                                                        <div>
                                                            <h4 className="text-white font-medium">{competitor.name}</h4>
                                                            <p className="text-sm text-zinc-500">{competitor.marketPosition}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteCompetitor(competitor.id)} className="text-red-400 hover:text-red-300">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Fortalezas (separadas por coma)</Label>
                                                        <Input value={competitor.strengths.join(", ")} onChange={e => updateCompetitor(competitor.id, "strengths", e.target.value.split(", "))} className="bg-zinc-950" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Debilidades (separadas por coma)</Label>
                                                        <Input value={competitor.weaknesses.join(", ")} onChange={e => updateCompetitor(competitor.id, "weaknesses", e.target.value.split(", "))} className="bg-zinc-950" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Insights</h3>
                                    {benchmarkData.insights.map((insight, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={insight} onChange={e => {
                                                const updated = [...benchmarkData.insights];
                                                updated[i] = e.target.value;
                                                updateField("insights", updated);
                                            }} className="bg-zinc-950" />
                                            <Button variant="ghost" size="sm" onClick={() => updateField("insights", benchmarkData.insights.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("insights", [...benchmarkData.insights, ""])} className="bg-zinc-800">Agregar insight</Button>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Oportunidades Identificadas</h3>
                                    {benchmarkData.opportunities.map((opp, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={opp} onChange={e => {
                                                const updated = [...benchmarkData.opportunities];
                                                updated[i] = e.target.value;
                                                updateField("opportunities", updated);
                                            }} className="bg-zinc-950" />
                                            <Button variant="ghost" size="sm" onClick={() => updateField("opportunities", benchmarkData.opportunities.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("opportunities", [...benchmarkData.opportunities, ""])} className="bg-zinc-800">Agregar oportunidad</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Análisis de Competidores</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benchmarkData.competitors.map(competitor => (
                                            <div key={competitor.id} className="bg-zinc-950 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-white font-medium">{competitor.name}</h4>
                                                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(competitor.category)}`}>
                                                        {getCategoryLabel(competitor.category)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-400 mb-3">{competitor.marketPosition}</p>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                                            <TrendingUp size={12} className="text-green-500" />
                                                            Fortalezas
                                                        </p>
                                                        <ul className="text-xs text-zinc-400 space-y-1">
                                                            {competitor.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                                            <TrendingDown size={12} className="text-red-500" />
                                                            Debilidades
                                                        </p>
                                                        <ul className="text-xs text-zinc-400 space-y-1">
                                                            {competitor.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 rounded-xl p-6">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                            <BarChart3 size={18} />
                                            Insights
                                        </h3>
                                        <ul className="space-y-2">
                                            {benchmarkData.insights.map((insight, i) => (
                                                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                                    <span className="text-amber-500 mt-1">•</span>
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-zinc-900 rounded-xl p-6">
                                        <h3 className="text-white font-semibold mb-4">Oportunidades</h3>
                                        <ul className="space-y-2">
                                            {benchmarkData.opportunities.map((opp, i) => (
                                                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">→</span>
                                                    {opp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(benchmarkData, null, 2));
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

export default function BenchmarkWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="benchmark"
            moduleName="Benchmark"
            moduleSubtitle="Análisis competitivo de mercado"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <BenchmarkWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
