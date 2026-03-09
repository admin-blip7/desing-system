"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { useAIGeneration } from "@/components/workspace/shared/withAIGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Lightbulb, Target, ArrowRight, Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PillarItem {
    id: string;
    name: string;
    description: string;
}

interface ValueItem {
    id: string;
    name: string;
    description: string;
}

interface BrandPhilosophyModuleData {
    content?: {
        pillars?: PillarItem[];
        values?: ValueItem[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

function parseGeneratedListItems(data: unknown, key: "pillars" | "values"): { name: string; description: string }[] {
    if (!data || typeof data !== "object") {
        return [];
    }

    const asRecord = data as Record<string, unknown>;
    const payload = typeof asRecord.content === "object" && asRecord.content !== null
        ? (asRecord.content as Record<string, unknown>)
        : asRecord;

    const rawList = payload[key];
    if (!Array.isArray(rawList)) {
        const textSource = [
            typeof payload.content === "string" ? payload.content : "",
            typeof payload.text === "string" ? payload.text : "",
            typeof asRecord.content === "string" ? asRecord.content : "",
            typeof asRecord.text === "string" ? asRecord.text : "",
        ].find((value) => value.length > 0) || "";

        if (!textSource) {
            return [];
        }

        const bullets = textSource
            .split("\n")
            .map((line) => line.replace(/^[-*]\s+/, "").trim())
            .filter((line) => line.length > 0);

        if (key === "values") {
            const valueItems = bullets
                .slice(0, 6)
                .map((line) => ({ name: line.slice(0, 80), description: "" }))
                .filter((item) => item.name.length > 0);
            if (valueItems.length > 0) {
                return valueItems;
            }
        }

        return [{
            name: key === "pillars" ? "Pilar Estratégico IA" : "Valor de Marca IA",
            description: textSource.slice(0, 1000),
        }];
    }

    return rawList
        .map((item) => {
            if (typeof item === "string") {
                return { name: item.trim(), description: "" };
            }
            if (item && typeof item === "object") {
                const candidate = item as Record<string, unknown>;
                return {
                    name: String(candidate.name || candidate.title || "").trim(),
                    description: String(candidate.description || candidate.detail || "").trim(),
                };
            }
            return { name: "", description: "" };
        })
        .filter((item) => item.name.length > 0);
}

const PillarsEditor = ({
    pillars,
    onAdd,
    onDelete,
    onUpdate
}: {
    pillars: PillarItem[],
        onAdd: (item: PillarItem) => void,
        onDelete: (id: string) => void,
        onUpdate: (item: PillarItem) => void
    }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");

    const handleSave = (id: string) => {
        if (editName.trim()) {
            onUpdate({ id, name: editName.trim(), description: editDesc.trim() });
            setEditingId(null);
            setEditName("");
            setEditDesc("");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white">Pilares de la Marca</h3>
                    <p className="text-sm text-zinc-400">Define los pilares estratégicos que sustentan tu marca.</p>
                </div>
                <Button
                    onClick={() => setEditingId("new")}
                    variant="outline"
                    className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                >
                    <Plus size={14} className="mr-2" />
                    Agregar Pilar
                </Button>
            </div>

            <div className="space-y-4">
                {pillars.map((pillar) => (
                    <div key={pillar.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 group">
                        {editingId === pillar.id ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-2">Nombre del Pilar</label>
                                    <input
                                        type="text"
                                        defaultValue={pillar.name}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm"
                                        placeholder="Ej: Innovación"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-2">Descripción</label>
                                    <textarea
                                        defaultValue={pillar.description}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm min-h-[80px]"
                                        placeholder="Describe cómo este pilar se manifiesta en tu marca..."
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        onClick={() => handleSave(pillar.id)}
                                        size="sm"
                                        className="bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        onClick={() => setEditingId(null)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium text-lg">{pillar.name}</h4>
                                        <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{pillar.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(pillar.id);
                                                setEditName(pillar.name);
                                                setEditDesc(pillar.description);
                                            }}
                                            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 0-1 1v2m0 6h11a2 2 0 0 1 1v6m0-6h11a2 2 0 0 1 1" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(pillar.id)}
                                            className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {pillars.length === 0 && (
                    <div className="text-center py-12 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg">
                        <Target size={32} className="mx-auto mb-3 text-zinc-600" />
                        <p className="text-white font-medium mb-2">Sin pilares definidos</p>
                        <p className="text-sm text-zinc-400 mb-4">
                            Los pilares son la base de tu identidad de marca. Comienza agregando al menos 3.
                        </p>
                        <Button
                            onClick={() => setEditingId("new")}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            Crear Primer Pilar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ValuesEditor = ({
    values,
    onAdd,
    onDelete,
    onUpdate
}: {
    values: ValueItem[],
        onAdd: (item: ValueItem) => void,
        onDelete: (id: string) => void,
        onUpdate: (item: ValueItem) => void
    }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");

    const handleSave = (id: string) => {
        if (editName.trim()) {
            onUpdate({ id, name: editName.trim(), description: editDesc.trim() });
            setEditingId(null);
            setEditName("");
            setEditDesc("");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white">Valores de Marca</h3>
                    <p className="text-sm text-zinc-400">Los principios que guían todas las decisiones de tu marca.</p>
                </div>
                <Button
                    onClick={() => setEditingId("new")}
                    variant="outline"
                    className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                >
                    <Plus size={14} className="mr-2" />
                    Agregar Valor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((value) => (
                    <div key={value.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 group">
                        {editingId === value.id ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-2">Nombre del Valor</label>
                                    <input
                                        type="text"
                                        defaultValue={value.name}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm"
                                        placeholder="Ej: Autenticidad"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-2">Descripción</label>
                                    <textarea
                                        defaultValue={value.description}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm min-h-[80px]"
                                        placeholder="Describe cómo este valor se aplica en tu marca..."
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        onClick={() => handleSave(value.id)}
                                        size="sm"
                                        className="bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        onClick={() => setEditingId(null)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium text-lg">{value.name}</h4>
                                        <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{value.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(value.id);
                                                setEditName(value.name);
                                                setEditDesc(value.description);
                                            }}
                                            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 0-1 1v2m0 6h11a2 2 0 0 1 1v6m0-6h11a2 2 0 0 1 1" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(value.id)}
                                            className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {values.length === 0 && (
                    <div className="text-center py-12 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg">
                        <Lightbulb size={32} className="mx-auto mb-3 text-zinc-600" />
                        <p className="text-white font-medium mb-2">Sin valores definidos</p>
                        <p className="text-sm text-zinc-400 mb-4">
                            Los valores definen la personalidad de tu marca. Comienza agregando al menos 3.
                        </p>
                        <Button
                            onClick={() => setEditingId("new")}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            Crear Primer Valor
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PhilosophyPreview = () => (
    <div className="p-6 space-y-6">
        <div>
            <h3 className="text-lg font-medium text-white mb-4">Vista Previa</h3>
            <p className="text-sm text-zinc-400 mb-6">Así se verá la sección de filosofía en tu Brand Manual:</p>
        </div>

        <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Ejemplo de Visualización</h4>
                <div className="space-y-4 text-sm text-zinc-400">
                    <p className="flex items-start gap-3">
                        <Sparkles className="text-amber-500 flex-shrink-0 mt-1" size={16} />
                        <span><strong className="text-white">Pilares:</strong> Innovación, Calidad, Sostenibilidad</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <Target className="text-blue-500 flex-shrink-0 mt-1" size={16} />
                        <span><strong className="text-white">Valores:</strong> Autenticidad, Transparencia, Excelencia</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <ArrowRight className="text-green-500 flex-shrink-0 mt-1" size={16} />
                        <span><strong className="text-white">Propósito:</strong> Empoderar a través del diseño consciente</span>
                    </p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Estructura Sugerida</h4>
                <div className="space-y-3 text-sm text-zinc-400">
                    <p>1. Un párrafo introductorio (2-3 líneas)</p>
                    <p>2. Los 3-5 pilares con icono y descripción</p>
                    <p>3. Los 5-7 valores con icono y descripción</p>
                    <p>4. Un párrafo de propósito (máximo 3 líneas)</p>
                    <p>5. Sección de aplicación práctica (opcional)</p>
                </div>
            </div>
        </div>
    </div>
);

const PhilosophyExport = () => (
    <div className="p-6 space-y-6">
        <div>
            <h3 className="text-lg font-medium text-white mb-4">Exportar Filosofía</h3>
            <p className="text-sm text-zinc-400 mb-6">Descarga tu filosofía de marca en diferentes formatos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 h-full flex flex-col items-center justify-center gap-3 p-6 hover:text-white">
                <Download size={20} />
                <span className="font-medium">JSON</span>
                <span className="text-xs text-zinc-500">Para importar/exportar</span>
            </Button>

            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 h-full flex flex-col items-center justify-center gap-3 p-6 hover:text-white">
                <Download size={20} />
                <span className="font-medium">Markdown</span>
                <span className="text-xs text-zinc-500">Para documentación</span>
            </Button>

            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 h-full flex flex-col items-center justify-center gap-3 p-6 hover:text-white">
                <Download size={20} />
                <span className="font-medium">PDF</span>
                <span className="text-xs text-zinc-500">Para Brand Manual completo</span>
            </Button>
        </div>
    </div>
);

interface BrandPhilosophyContentProps {
    data: BrandPhilosophyModuleData | null;
    saveModule: (data: BrandPhilosophyModuleData) => void;
    generatedData?: unknown;
}

const BrandPhilosophyContent = ({ data, saveModule, generatedData }: BrandPhilosophyContentProps) => {
    const [pillars, setPillars] = useState<PillarItem[]>([]);
    const [values, setValues] = useState<ValueItem[]>([]);

    // Update state when data changes
    React.useEffect(() => {
        if (data?.content?.pillars) {
            setPillars(data.content.pillars);
        }
    }, [data?.content?.pillars]);

    React.useEffect(() => {
        if (data?.content?.values) {
            setValues(data.content.values);
        }
    }, [data?.content?.values]);

    // Save module when pillars or values change
    React.useEffect(() => {
        if (pillars.length > 0 && data) {
            saveModule({ ...data, content: { ...data?.content, pillars } });
        }
    }, [pillars, data, saveModule]);

    React.useEffect(() => {
        if (values.length > 0 && data) {
            saveModule({ ...data, content: { ...data?.content, values } });
        }
    }, [values, data, saveModule]);

    React.useEffect(() => {
        if (!generatedData || !data) {
            return;
        }

        const generatedPillars = parseGeneratedListItems(generatedData, "pillars").map((item, idx) => ({
            id: `ai-pillar-${Date.now()}-${idx}`,
            name: item.name,
            description: item.description,
        }));
        const generatedValues = parseGeneratedListItems(generatedData, "values").map((item, idx) => ({
            id: `ai-value-${Date.now()}-${idx}`,
            name: item.name,
            description: item.description,
        }));

        if (generatedPillars.length > 0) {
            setPillars(generatedPillars);
        }

        if (generatedValues.length > 0) {
            setValues(generatedValues);
        }

        if (generatedPillars.length > 0 || generatedValues.length > 0) {
            saveModule({
                ...data,
                content: {
                    ...data?.content,
                    ...(generatedPillars.length > 0 ? { pillars: generatedPillars } : {}),
                    ...(generatedValues.length > 0 ? { values: generatedValues } : {}),
                },
            });
        }
    }, [generatedData, data, saveModule]);

    const handleAddPillar = (pillar: PillarItem) => {
        const updated = [...pillars, pillar];
        setPillars(updated);
    };

    const handleDeletePillar = (id: string) => {
        const updated = pillars.filter(p => p.id !== id);
        setPillars(updated);
    };

    const handleUpdatePillar = (pillar: PillarItem) => {
        const updated = pillars.map(p => p.id === pillar.id ? pillar : p);
        setPillars(updated);
    };

    const handleAddValue = (value: ValueItem) => {
        const updated = [...values, value];
        setValues(updated);
    };

    const handleDeleteValue = (id: string) => {
        const updated = values.filter(v => v.id !== id);
        setValues(updated);
    };

    const handleUpdateValue = (value: ValueItem) => {
        const updated = values.map(v => v.id === value.id ? value : v);
        setValues(updated);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            <Tabs defaultValue="pillars" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="pillars" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Target size={14} className="mr-2" /> Pilares
                        </TabsTrigger>
                        <TabsTrigger value="values" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Lightbulb size={14} className="mr-2" /> Valores
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Sparkles size={14} className="mr-2" /> Vista Previa
                        </TabsTrigger>
                        <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Download size={14} className="mr-2" /> Exportar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="pillars" className="m-0 focus:outline-none min-h-full">
                                <PillarsEditor
                                    pillars={pillars}
                                    onAdd={handleAddPillar}
                                    onDelete={handleDeletePillar}
                                    onUpdate={handleUpdatePillar}
                                />
                            </TabsContent>

                            <TabsContent value="values" className="m-0 focus:outline-none min-h-full">
                                <ValuesEditor
                                    values={values}
                                    onAdd={handleAddValue}
                                    onDelete={handleDeleteValue}
                                    onUpdate={handleUpdateValue}
                                />
                            </TabsContent>

                            <TabsContent value="preview" className="m-0 focus:outline-none min-h-full">
                                <PhilosophyPreview />
                            </TabsContent>

                            <TabsContent value="export" className="m-0 focus:outline-none min-h-full">
                                <PhilosophyExport />
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function BrandPhilosophyWorkspace({ brandId }: { brandId: string }) {
    const [generatedData, setGeneratedData] = useState<unknown>(null);
    const { headerActions, aiPanel } = useAIGeneration(
        brandId,
        "brandPhilosophy",
        (data) => {
            console.log("Brand Philosophy data generated:", data);
            setGeneratedData(data);
            toast.success("Filosofía de marca generada exitosamente");
        }
    );

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="brandPhilosophy"
            moduleName="Filosofía de Marca"
            moduleSubtitle="Misión, visión, valores y pilares estratégicos"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={headerActions}
        >
            {({ data, saveModule }) => (
                <>
                    {aiPanel}
                    <BrandPhilosophyContent data={data} saveModule={saveModule} generatedData={generatedData} />
                </>
            )}
        </BaseWorkspace>
    );
}
