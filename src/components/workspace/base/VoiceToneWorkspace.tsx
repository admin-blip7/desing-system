"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Users, MessageSquare, Volume2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Persona {
    id: string;
    name: string;
    role: string;
    traits: string[];
    description: string;
}

const PersonaEditor = ({
    personas,
    onUpdate
}: {
    personas: Persona[],
    onUpdate: (p: Persona[]) => void
}) => {
    const addPersona = () => {
        onUpdate([...personas, {
            id: Date.now().toString(),
            name: "Nuevo Cliente Ideal",
            role: "Rol / Ocupación",
            traits: ["Rasgo 1", "Rasgo 2"],
            description: "Descripción breve..."
        }]);
    };

    const updatePersona = (index: number, field: keyof Persona, value: any) => {
        const newPersonas = [...personas];
        newPersonas[index] = { ...newPersonas[index], [field]: value };
        onUpdate(newPersonas);
    };

    const removePersona = (index: number) => {
        onUpdate(personas.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Target Personas</h3>
                <Button size="sm" onClick={addPersona}>
                    <Plus size={14} className="mr-2" /> Agregar Persona
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personas.map((persona, index) => (
                    <div key={persona.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 relative group">
                        <Input
                            value={persona.name}
                            onChange={(e) => updatePersona(index, 'name', e.target.value)}
                            className="text-lg font-bold bg-transparent border-none px-0 h-auto focus-visible:ring-0 text-white placeholder:text-zinc-600"
                            placeholder="Nombre del Persona"
                        />
                        <Input
                            value={persona.role}
                            onChange={(e) => updatePersona(index, 'role', e.target.value)}
                            className="text-sm text-amber-500 bg-transparent border-none px-0 h-auto -mt-2 focus-visible:ring-0 placeholder:text-zinc-600"
                            placeholder="Rol / Ocupación"
                        />

                        <Textarea
                            value={persona.description}
                            onChange={(e) => updatePersona(index, 'description', e.target.value)}
                            className="bg-zinc-950/50 border-zinc-800 text-sm min-h-[80px]"
                            placeholder="Describe brevemente a este arquetipo de cliente..."
                        />

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 uppercase">Rasgos Clave</label>
                            <div className="flex flex-wrap gap-2">
                                {persona.traits.map((trait, tIndex) => (
                                    <div key={tIndex} className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 flex items-center gap-1">
                                        <input
                                            value={trait}
                                            onChange={(e) => {
                                                const newTraits = [...persona.traits];
                                                newTraits[tIndex] = e.target.value;
                                                updatePersona(index, 'traits', newTraits);
                                            }}
                                            className="bg-transparent w-full min-w-[40px] outline-none"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => updatePersona(index, 'traits', [...persona.traits, "Nuevo Rasgo"])}
                                    className="px-2 py-1 rounded text-xs text-zinc-500 border border-dashed border-zinc-700 hover:text-white"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => removePersona(index)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ToneSliders = ({ tones, onChange }: { tones: any, onChange: (t: any) => void }) => {
    const dimensions = [
        { key: "formal_casual", left: "Formal", right: "Casual" },
        { key: "serious_humorous", left: "Serio", right: "Humorístico" },
        { key: "respectful_irreverent", left: "Respetuoso", right: "Irreverente" },
        { key: "enthusiastic_matter_of_fact", left: "Entusiasta", right: "Pragmático" },
    ];

    const updateTone = (key: string, value: number) => {
        onChange({ ...tones, [key]: value });
    };

    return (
        <div className="p-6 max-w-3xl space-y-8">
            <h3 className="text-lg font-medium text-white">Dimensiones del Tono</h3>
            <div className="space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                {dimensions.map((dim) => (
                    <div key={dim.key} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-zinc-400">
                            <span>{dim.left}</span>
                            <span>{dim.right}</span>
                        </div>
                        <input
                            type="range"
                            min="0" // 0 = left fully
                            max="100" // 100 = right fully
                            value={tones[dim.key] || 50}
                            onChange={(e) => updateTone(dim.key, Number(e.target.value))}
                            className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                ))}
            </div>

            <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded text-amber-200/80 text-sm">
                <p>💡 Ajusta los deslizadores para definir la personalidad de tu marca. El centro (50) indica neutralidad.</p>
            </div>
        </div>
    );
};

interface VoiceToneContentProps {
    data: any;
    saveModule: (data: any) => void;
}

const VoiceToneContent = ({ data, saveModule }: VoiceToneContentProps) => {
    const [personas, setPersonas] = useState<Persona[]>(data?.content?.personas || []);
    const [tones, setTones] = useState(data?.content?.tones || {});

    const handleUpdatePersonas = (newPersonas: Persona[]) => {
        setPersonas(newPersonas);
        saveModule({ ...data, content: { ...data?.content, personas: newPersonas } });
    };

    const handleUpdateTones = (newTones: any) => {
        setTones(newTones);
        saveModule({ ...data, content: { ...data?.content, tones: newTones } });
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="personas" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="personas" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Users size={14} className="mr-2" /> Personas
                        </TabsTrigger>
                        <TabsTrigger value="tone" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Volume2 size={14} className="mr-2" /> Tono de Voz
                        </TabsTrigger>
                        <TabsTrigger value="examples" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <MessageSquare size={14} className="mr-2" /> Ejemplos
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="personas" className="m-0 min-h-full">
                                <PersonaEditor personas={personas} onUpdate={handleUpdatePersonas} />
                            </TabsContent>

                            <TabsContent value="tone" className="m-0">
                                <ToneSliders tones={tones} onChange={handleUpdateTones} />
                            </TabsContent>

                            <TabsContent value="examples" className="m-0 p-8">
                                <p className="text-zinc-500">Ejemplos de aplicación (email, redes sociales, web) próximamente...</p>
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function VoiceToneWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="voiceTone"
            moduleName="Voz y Tono"
            moduleSubtitle="Define la personalidad y estilo de comunicación de tu marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => (
                <VoiceToneContent data={data} saveModule={saveModule} />
            )}
        </BaseWorkspace>
    );
}
