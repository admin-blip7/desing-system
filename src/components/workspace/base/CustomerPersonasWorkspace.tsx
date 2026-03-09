"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Edit, Eye, Download, Plus, Trash2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIGenerateButton } from "@/components/ai/generate-button/AIGenerateButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface Persona {
    id: string;
    name: string;
    role?: string;
    age?: string;
    location?: string;
    income?: string;
    goals: string;
    painPoints: string;
    motivations: string;
    objections: string;
    quote?: string;
}

interface CustomerPersonasData {
    personas: Persona[];
}

const defaultCustomerPersonasData: CustomerPersonasData = {
    personas: []
};

const BUYER_PERSONA_COMPONENTS = [
    {
        title: "Demografía",
        description: "Edad, ubicación, ingresos, rol profesional",
    },
    {
        title: "Metas",
        description: "Lo que quiere lograr con tu producto/servicio",
    },
    {
        title: "Pain Points",
        description: "Frustraciones y problemas actuales",
    },
    {
        title: "Objeciones",
        description: "Barreras para la compra",
    },
];

function parseGeneratedPersonas(data: unknown): Persona[] {
    if (!data || typeof data !== "object") return [];

    const record = data as Record<string, unknown>;
    const root = typeof record.content === "object" && record.content !== null
        ? (record.content as Record<string, unknown>)
        : record;

    const directPersonas =
        (root.personasData as { personas?: unknown } | undefined)?.personas ??
        root.personas;

    if (Array.isArray(directPersonas)) {
        const mapped = directPersonas.flatMap((item, index): Persona[] => {
                if (!item || typeof item !== "object") return [];
                const persona = item as Record<string, unknown>;
                const name = String(persona.name || persona.title || `Persona ${index + 1}`).trim();
                if (!name) return [];
                return [{
                    id: String(persona.id || `ai-${Date.now()}-${index}`),
                    name,
                    role: typeof persona.role === "string" ? persona.role : "Cliente potencial",
                    age: typeof persona.age === "string" ? persona.age : undefined,
                    location: typeof persona.location === "string" ? persona.location : undefined,
                    income: typeof persona.income === "string" ? persona.income : undefined,
                    goals: String(persona.goals || persona.objectives || "Definir meta principal del segmento."),
                    painPoints: String(persona.painPoints || persona.challenges || "Definir frustración principal del segmento."),
                    motivations: String(persona.motivations || ""),
                    objections: String(persona.objections || "Definir barrera de compra principal."),
                    quote: typeof persona.quote === "string" ? persona.quote : undefined,
                }];
            });
        if (mapped.length > 0) return mapped;
    }

    const textSource =
        (typeof root.content === "string" ? root.content : "") ||
        (typeof root.text === "string" ? root.text : "") ||
        (typeof record.content === "string" ? record.content : "") ||
        (typeof record.text === "string" ? record.text : "");

    if (!textSource) return [];

    const chunks = textSource
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0)
        .slice(0, 3);

    return chunks.map((chunk, index) => ({
        id: `ai-text-${Date.now()}-${index}`,
        name: `Persona ${index + 1}`,
        role: "Cliente potencial",
        goals: chunk.slice(0, 220),
        painPoints: "Definir frustración principal del segmento.",
        motivations: "",
        objections: "Definir barrera de compra principal.",
    }));
}

function buildIdealClientSuggestions(personas: Persona[]): string[] {
    return personas
        .map((persona) => {
            const parts = [
                persona.role ? `${persona.role}` : "",
                persona.location ? `en ${persona.location}` : "",
                persona.age ? `(${persona.age})` : "",
            ].filter((part) => part.length > 0);

            const descriptor = parts.length > 0 ? parts.join(" ") : persona.name;
            const painPoint = persona.painPoints?.trim()
                ? ` con dolor principal: ${persona.painPoints.slice(0, 90)}`
                : "";

            return `${descriptor}${painPoint}`;
        })
        .filter((entry) => entry.length > 0)
        .slice(0, 6);
}

function parseIdealClientSuggestions(data: unknown): string[] {
    if (!data || typeof data !== "object") return [];
    const record = data as Record<string, unknown>;
    const root =
        typeof record.content === "object" && record.content !== null
            ? (record.content as Record<string, unknown>)
            : record;

    const suggestions = root.idealClientSuggestions;
    if (!Array.isArray(suggestions)) return [];
    return suggestions
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0)
        .slice(0, 6);
}

interface CustomerPersonasWorkspaceContentProps extends WorkspaceContentProps {
    brandId: string;
    aiSuggestions?: string[];
    generatedPersonas?: Persona[];
    onAIGenerated?: (data: unknown) => void;
}

function CustomerPersonasWorkspaceContent({
    data,
    saveModule,
    brandId,
    aiSuggestions = [],
    generatedPersonas = [],
    onAIGenerated,
}: CustomerPersonasWorkspaceContentProps) {
    const [personasData, setPersonasData] = useState<CustomerPersonasData>(
        data?.content?.personasData || defaultCustomerPersonasData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPersonaName, setNewPersonaName] = useState("");
    const [quickPersonaDraft, setQuickPersonaDraft] = useState<Omit<Persona, "id">>({
        name: "",
        role: "",
        age: "",
        location: "",
        income: "",
        goals: "",
        painPoints: "",
        motivations: "",
        objections: "",
        quote: "",
    });
    const visiblePersonas = generatedPersonas.length > 0 ? generatedPersonas : personasData.personas;

    React.useEffect(() => {
        setPersonasData(data?.content?.personasData || defaultCustomerPersonasData);
        setHasChanges(false);
    }, [data]);

    React.useEffect(() => {
        if (generatedPersonas.length === 0) return;
        setPersonasData((prev) => ({
            ...prev,
            personas: generatedPersonas,
        }));
        setHasChanges(false);
    }, [generatedPersonas]);

    const updatePersona = useCallback((persona: Persona) => {
        setPersonasData(prev => ({
            ...prev,
            personas: prev.personas.map(p => p.id === persona.id ? persona : p)
        }));
        setHasChanges(true);
    }, []);

    const addPersona = useCallback(() => {
        if (!newPersonaName.trim()) return;
        const newPersona: Persona = {
            id: Date.now().toString(),
            name: newPersonaName,
            goals: "",
            painPoints: "",
            motivations: "",
            objections: ""
        };
        setPersonasData(prev => ({
            ...prev,
            personas: [...prev.personas, newPersona]
        }));
        setNewPersonaName("");
        setEditingId(newPersona.id);
        setHasChanges(true);
    }, [newPersonaName]);

    const addQuickPersona = useCallback(() => {
        if (!quickPersonaDraft.name.trim()) {
            toast.error("Agrega al menos el nombre de la persona.");
            return;
        }

        const newPersona: Persona = {
            id: Date.now().toString(),
            name: quickPersonaDraft.name.trim(),
            role: quickPersonaDraft.role?.trim() || undefined,
            age: quickPersonaDraft.age?.trim() || undefined,
            location: quickPersonaDraft.location?.trim() || undefined,
            income: quickPersonaDraft.income?.trim() || undefined,
            goals: quickPersonaDraft.goals.trim(),
            painPoints: quickPersonaDraft.painPoints.trim(),
            motivations: quickPersonaDraft.motivations.trim(),
            objections: quickPersonaDraft.objections.trim(),
            quote: quickPersonaDraft.quote?.trim() || undefined,
        };

        setPersonasData((prev) => ({
            ...prev,
            personas: [...prev.personas, newPersona],
        }));
        setHasChanges(true);
        setQuickPersonaDraft({
            name: "",
            role: "",
            age: "",
            location: "",
            income: "",
            goals: "",
            painPoints: "",
            motivations: "",
            objections: "",
            quote: "",
        });
        toast.success("Persona agregada.");
    }, [quickPersonaDraft]);

    const deletePersona = useCallback((id: string) => {
        setPersonasData(prev => ({
            ...prev,
            personas: prev.personas.filter(p => p.id !== id)
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({
            ...data,
            content: {
                ...data?.content,
                personasData
            }
        });
        if (success) {
            setHasChanges(false);
        }
    };

    const handleDiscard = () => {
        setPersonasData(data?.content?.personasData || defaultCustomerPersonasData);
        setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>
                            Descartar
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview">
                            <Users size={14} className="mr-2" /> Resumen
                        </TabsTrigger>
                        <TabsTrigger value="personas">
                            <Target size={14} className="mr-2" /> Personas
                        </TabsTrigger>
                        <TabsTrigger value="preview">
                            <Eye size={14} className="mr-2" /> Vista Previa
                        </TabsTrigger>
                        <TabsTrigger value="export">
                            <Download size={14} className="mr-2" /> Exportar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Customer Personas</h2>
                                    <p className="text-zinc-400">Define los perfiles de tus clientes ideales con demografía, motivaciones y frustraciones.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Tus Personas</h3>
                                    {visiblePersonas.length === 0 ? (
                                        <div className="py-6">
                                            <Users size={48} className="mx-auto mb-3 text-zinc-700" />
                                            <p className="text-white font-medium mb-2 text-center">Sin personas definidas</p>
                                            <p className="text-sm text-zinc-500 mb-6 text-center">
                                                Define al menos 2-3 buyer personas para entender mejor a tus clientes.
                                            </p>

                                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 md:p-5 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Nombre de la persona</Label>
                                                        <Input
                                                            value={quickPersonaDraft.name}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, name: e.target.value }))
                                                            }
                                                            placeholder="Ej: María, compradora digital"
                                                            className="bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Rol / ocupación</Label>
                                                        <Input
                                                            value={quickPersonaDraft.role || ""}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, role: e.target.value }))
                                                            }
                                                            placeholder="Ej: Dueña de negocio"
                                                            className="bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Edad</Label>
                                                        <Input
                                                            value={quickPersonaDraft.age || ""}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, age: e.target.value }))
                                                            }
                                                            placeholder="Ej: 25-34"
                                                            className="bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Ubicación</Label>
                                                        <Input
                                                            value={quickPersonaDraft.location || ""}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, location: e.target.value }))
                                                            }
                                                            placeholder="Ej: CDMX"
                                                            className="bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Ingresos</Label>
                                                        <Input
                                                            value={quickPersonaDraft.income || ""}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, income: e.target.value }))
                                                            }
                                                            placeholder="Ej: $20k-$35k"
                                                            className="bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Metas</Label>
                                                        <Textarea
                                                            value={quickPersonaDraft.goals}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, goals: e.target.value }))
                                                            }
                                                            placeholder="¿Qué quiere lograr con tu producto/servicio?"
                                                            className="min-h-[80px] bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Pain Points</Label>
                                                        <Textarea
                                                            value={quickPersonaDraft.painPoints}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, painPoints: e.target.value }))
                                                            }
                                                            placeholder="Frustraciones y problemas actuales"
                                                            className="min-h-[80px] bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Motivaciones</Label>
                                                        <Textarea
                                                            value={quickPersonaDraft.motivations}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, motivations: e.target.value }))
                                                            }
                                                            placeholder="¿Qué la impulsa a decidir?"
                                                            className="min-h-[80px] bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-zinc-400">Objeciones</Label>
                                                        <Textarea
                                                            value={quickPersonaDraft.objections}
                                                            onChange={(e) =>
                                                                setQuickPersonaDraft((prev) => ({ ...prev, objections: e.target.value }))
                                                            }
                                                            placeholder="Barreras para la compra"
                                                            className="min-h-[80px] bg-zinc-900 border-zinc-700"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs text-zinc-400">Frase / quote (opcional)</Label>
                                                    <Input
                                                        value={quickPersonaDraft.quote || ""}
                                                        onChange={(e) =>
                                                            setQuickPersonaDraft((prev) => ({ ...prev, quote: e.target.value }))
                                                        }
                                                        placeholder="Ej: Necesito algo que me ahorre tiempo"
                                                        className="bg-zinc-900 border-zinc-700"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setQuickPersonaDraft({
                                                                name: "",
                                                                role: "",
                                                                age: "",
                                                                location: "",
                                                                income: "",
                                                                goals: "",
                                                                painPoints: "",
                                                                motivations: "",
                                                                objections: "",
                                                                quote: "",
                                                            })
                                                        }
                                                    >
                                                        Limpiar
                                                    </Button>
                                                    <AIGenerateButton
                                                        brandId={brandId}
                                                        moduleKey="customerPersonas"
                                                        onGenerationComplete={(generated) => {
                                                            onAIGenerated?.(generated);
                                                        }}
                                                        onGenerationError={(error) => {
                                                            toast.error(error || "No se pudo generar Customer Personas");
                                                        }}
                                                        showCostEstimate={false}
                                                        showModelBadge={false}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Generar con IA
                                                    </AIGenerateButton>
                                                    <Button onClick={addQuickPersona}>
                                                        <Plus size={14} className="mr-2" />
                                                        Crear Primera Persona
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {visiblePersonas.map(persona => (
                                                <div key={persona.id} className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                                                    <h4 className="text-white font-medium text-lg mb-2">{persona.name}</h4>
                                                    {persona.role && (
                                                        <p className="text-sm text-zinc-500 mb-3">{persona.role}</p>
                                                    )}
                                                    <div className="space-y-2 text-sm text-zinc-400">
                                                        {persona.goals && (
                                                            <p><span className="text-amber-500">Metas:</span> {persona.goals.substring(0, 60)}...</p>
                                                        )}
                                                        {persona.painPoints && (
                                                            <p><span className="text-red-400">Problemas:</span> {persona.painPoints.substring(0, 60)}...</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {aiSuggestions.length > 0 && (
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            Clientes ideales sugeridos por IA (qué buscar)
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {aiSuggestions.map((suggestion, index) => (
                                                <div
                                                    key={`${suggestion}-${index}`}
                                                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200"
                                                >
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Componentes de una Buyer Persona</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {BUYER_PERSONA_COMPONENTS.map((component) => (
                                            <div key={component.title} className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                                    <Target size={18} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">{component.title}</h4>
                                                    <p className="text-zinc-500">{component.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="personas" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Personas</h3>
                                    <Button variant="outline" size="sm" onClick={() => setEditingId("new")}>
                                        <Plus size={14} className="mr-2" /> Nueva Persona
                                    </Button>
                                </div>

                                {editingId === "new" && (
                                    <div className="bg-zinc-900 border border-amber-500/50 rounded-xl p-4">
                                        <Label className="text-sm text-zinc-400 mb-2">Nombre de la Persona</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newPersonaName}
                                                onChange={e => setNewPersonaName(e.target.value)}
                                                placeholder="Ej: María, el tomador de decisiones"
                                                className="flex-1"
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={addPersona}>Crear</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancelar</Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {visiblePersonas.map(persona => (
                                        <div key={persona.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                            {editingId === persona.id ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-white font-medium text-lg">Editando: {persona.name}</h4>
                                                        <Button size="sm" onClick={() => setEditingId(null)}>Terminar Edición</Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <Label className="text-sm text-zinc-400">Rol / Ocupación</Label>
                                                            <Input
                                                                value={persona.role || ""}
                                                                onChange={e => updatePersona({ ...persona, role: e.target.value })}
                                                                placeholder="Ej: Gerente de Marketing"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm text-zinc-400">Edad</Label>
                                                            <Input
                                                                value={persona.age || ""}
                                                                onChange={e => updatePersona({ ...persona, age: e.target.value })}
                                                                placeholder="Ej: 25-34"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm text-zinc-400">Ubicación</Label>
                                                            <Input
                                                                value={persona.location || ""}
                                                                onChange={e => updatePersona({ ...persona, location: e.target.value })}
                                                                placeholder="Ej: Ciudad de México"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Nivel de Ingresos</Label>
                                                        <Input
                                                            value={persona.income || ""}
                                                            onChange={e => updatePersona({ ...persona, income: e.target.value })}
                                                            placeholder="Ej: $20,000 - $35,000 MXN/mes"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Metas y Objetivos</Label>
                                                        <Textarea
                                                            value={persona.goals}
                                                            onChange={e => updatePersona({ ...persona, goals: e.target.value })}
                                                            placeholder="¿Qué quiere lograr esta persona?"
                                                            className="min-h-[80px] bg-zinc-950 border-zinc-700"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Pain Points (Frustraciones)</Label>
                                                        <Textarea
                                                            value={persona.painPoints}
                                                            onChange={e => updatePersona({ ...persona, painPoints: e.target.value })}
                                                            placeholder="¿Qué problemas enfrenta actualmente?"
                                                            className="min-h-[80px] bg-zinc-950 border-zinc-700"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Motivaciones</Label>
                                                        <Textarea
                                                            value={persona.motivations}
                                                            onChange={e => updatePersona({ ...persona, motivations: e.target.value })}
                                                            placeholder="¿Qué la mueve a tomar decisiones?"
                                                            className="min-h-[80px] bg-zinc-950 border-zinc-700"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Objeciones Comunes</Label>
                                                        <Textarea
                                                            value={persona.objections}
                                                            onChange={e => updatePersona({ ...persona, objections: e.target.value })}
                                                            placeholder="¿Qué objeciones tendría antes de comprar?"
                                                            className="min-h-[80px] bg-zinc-950 border-zinc-700"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm text-zinc-400">Quote (Opcional)</Label>
                                                        <Input
                                                            value={persona.quote || ""}
                                                            onChange={e => updatePersona({ ...persona, quote: e.target.value })}
                                                            placeholder='Ej: "Necesito algo que funcione ya"'
                                                            className="bg-zinc-950 border-zinc-700"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <h4 className="text-white font-medium text-xl">{persona.name}</h4>
                                                            {persona.role && <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">{persona.role}</span>}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
                                                            {persona.age && <span>📅 {persona.age}</span>}
                                                            {persona.location && <span>📍 {persona.location}</span>}
                                                            {persona.income && <span>💰 {persona.income}</span>}
                                                        </div>
                                                        {persona.quote && (
                                                            <blockquote className="border-l-4 border-amber-500 pl-4 italic text-zinc-400 mb-4">
                                                                &quot;{persona.quote}&quot;
                                                            </blockquote>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {persona.goals && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-green-400 mb-1">🎯 Metas</h5>
                                                                    <p className="text-sm text-zinc-400">{persona.goals}</p>
                                                                </div>
                                                            )}
                                                            {persona.painPoints && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-red-400 mb-1">😫 Frustraciones</h5>
                                                                    <p className="text-sm text-zinc-400">{persona.painPoints}</p>
                                                                </div>
                                                            )}
                                                            {persona.motivations && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-purple-400 mb-1">💪 Motivaciones</h5>
                                                                    <p className="text-sm text-zinc-400">{persona.motivations}</p>
                                                                </div>
                                                            )}
                                                            {persona.objections && (
                                                                <div>
                                                                    <h5 className="text-sm font-medium text-amber-400 mb-1">🚧 Objetiones</h5>
                                                                    <p className="text-sm text-zinc-400">{persona.objections}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setEditingId(persona.id)}
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deletePersona(persona.id)}
                                                            className="text-red-400"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                {visiblePersonas.length === 0 ? (
                                    <div className="text-center py-16 bg-zinc-900 rounded-xl border border-dashed border-zinc-800">
                                        <Users size={48} className="mx-auto mb-4 text-zinc-700" />
                                        <p className="text-white">Crea tus primeras buyer personas para ver la vista previa</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {visiblePersonas.map(persona => (
                                            <div key={persona.id} className="bg-white text-zinc-900 rounded-xl overflow-hidden shadow-lg">
                                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                                                    <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                                                    {persona.role && <p className="text-white/80 text-sm">{persona.role}</p>}
                                                </div>
                                                <div className="p-5 space-y-4">
                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        {persona.age && <span className="px-2 py-1 bg-zinc-100 rounded-full">{persona.age}</span>}
                                                        {persona.location && <span className="px-2 py-1 bg-zinc-100 rounded-full">{persona.location}</span>}
                                                        {persona.income && <span className="px-2 py-1 bg-zinc-100 rounded-full">{persona.income}</span>}
                                                    </div>
                                                    {persona.quote && (
                                                        <p className="italic text-zinc-600 text-sm border-l-2 border-amber-500 pl-3">
                                                            &quot;{persona.quote}&quot;
                                                        </p>
                                                    )}
                                                    <div className="space-y-3 text-sm">
                                                        {persona.goals && (
                                                            <div>
                                                                <h4 className="font-semibold text-green-700 mb-1">Metas</h4>
                                                                <p className="text-zinc-600">{persona.goals}</p>
                                                            </div>
                                                        )}
                                                        {persona.painPoints && (
                                                            <div>
                                                                <h4 className="font-semibold text-red-700 mb-1">Desafíos</h4>
                                                                <p className="text-zinc-600">{persona.painPoints}</p>
                                                            </div>
                                                        )}
                                                        {persona.motivations && (
                                                            <div>
                                                                <h4 className="font-semibold text-purple-700 mb-1">Motivaciones</h4>
                                                                <p className="text-zinc-600">{persona.motivations}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Exportar Customer Personas</h3>
                                    <p className="text-sm text-zinc-400">Descarga tus buyer personas en diferentes formatos.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                        onClick={() => {
                                            const markdown = visiblePersonas.map(p => `
## ${p.name}
${p.role ? `**Rol:** ${p.role}` : ""}
${p.age ? `**Edad:** ${p.age}` : ""}
${p.location ? `**Ubicación:** ${p.location}` : ""}
${p.income ? `**Ingresos:** ${p.income}` : ""}
${p.quote ? `> "${p.quote}"` : ""}
### Metas
${p.goals}
### Frustraciones
${p.painPoints}
### Motivaciones
${p.motivations}
### Objetiones
${p.objections}
                                            `.trim()).join("\n\n---\n\n");
                                            navigator.clipboard.writeText(markdown);
                                            toast.success("Markdown copiado al portapapeles");
                                        }}
                                    >
                                        <Download size={20} />
                                        <span className="font-medium">Markdown</span>
                                        <span className="text-xs text-zinc-500">Para documentación</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                        onClick={() => {
                                            const json = JSON.stringify({ personas: visiblePersonas }, null, 2);
                                            navigator.clipboard.writeText(json);
                                            toast.success("JSON copiado al portapapeles");
                                        }}
                                    >
                                        <Download size={20} />
                                        <span className="font-medium">JSON</span>
                                        <span className="text-xs text-zinc-500">Para integraciones</span>
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function CustomerPersonasWorkspace({ brandId }: { brandId: string }) {
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [generatedPersonas, setGeneratedPersonas] = useState<Persona[]>([]);
    const handleAIGenerated = useCallback(async (data: unknown) => {
        const personasFromAI = parseGeneratedPersonas(data);
        if (personasFromAI.length === 0) {
            toast.error("La IA no devolvió personas utilizables. Intenta regenerar.");
            return;
        }

        setGeneratedPersonas(personasFromAI);
        const explicitSuggestions = parseIdealClientSuggestions(data);
        setAiSuggestions(
            explicitSuggestions.length > 0
                ? explicitSuggestions
                : buildIdealClientSuggestions(personasFromAI)
        );

        // /api/generate ya persiste el módulo en generateModuleAction.
        // Solo forzamos refresh para sincronizar estado desde backend.
        window.dispatchEvent(
            new CustomEvent("module-updated", {
                detail: { brandId, moduleKey: "customerPersonas" },
            })
        );
        toast.success("Customer Personas generadas.");
    }, [brandId]);

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="customerPersonas"
            moduleName="Customer Personas"
            moduleSubtitle="Define los perfiles de tus clientes ideales"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => (
                <CustomerPersonasWorkspaceContent
                    {...props}
                    brandId={brandId}
                    aiSuggestions={aiSuggestions}
                    generatedPersonas={generatedPersonas}
                    onAIGenerated={handleAIGenerated}
                />
            )}
        </BaseWorkspace>
    );
}
