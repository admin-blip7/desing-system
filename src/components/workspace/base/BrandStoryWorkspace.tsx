"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Edit, Eye, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface StorySection {
    id: string;
    title: string;
    content: string;
    order: number;
}

interface BrandStoryData {
    sections: StorySection[];
    originStory?: string;
    pivotMoment?: string;
    vision5yr?: string;
}

const defaultBrandStoryData: BrandStoryData = {
    sections: [
        { id: "1", title: "Orígenes", content: "", order: 0 },
        { id: "2", title: "Transformación", content: "", order: 1 },
        { id: "3", title: "Presente", content: "", order: 2 },
        { id: "4", title: "Visión Futura", content: "", order: 3 },
    ],
};

function BrandStoryWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [storyData, setStoryData] = useState<BrandStoryData>(
        data?.content?.storyData || defaultBrandStoryData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [newSectionTitle, setNewSectionTitle] = useState("");

    const updateSection = useCallback((sectionId: string, content: string) => {
        setStoryData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? { ...s, content } : s
            )
        }));
        setHasChanges(true);
    }, []);

    const addSection = useCallback(() => {
        if (!newSectionTitle.trim()) return;
        const newSection: StorySection = {
            id: Date.now().toString(),
            title: newSectionTitle,
            content: "",
            order: storyData.sections.length
        };
        setStoryData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
        setNewSectionTitle("");
        setHasChanges(true);
    }, [newSectionTitle, storyData.sections.length]);

    const deleteSection = useCallback((sectionId: string) => {
        setStoryData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId)
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({
            ...data,
            content: {
                ...data?.content,
                storyData
            }
        });
        if (success) {
            setHasChanges(false);
        }
    };

    const handleDiscard = () => {
        setStoryData(data?.content?.storyData || defaultBrandStoryData);
        setHasChanges(false);
    };

    const sortedSections = [...storyData.sections].sort((a, b) => a.order - b.order);

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
                            <BookOpen size={14} className="mr-2" /> Resumen
                        </TabsTrigger>
                        <TabsTrigger value="editor">
                            <Edit size={14} className="mr-2" /> Editor
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Brand Story</h2>
                                    <p className="text-zinc-400">Construye la narrativa completa de tu marca con origen, evolución y visión futura.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Secciones de tu Historia</h3>
                                    <div className="space-y-3">
                                        {sortedSections.map(section => (
                                            <div key={section.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg">
                                                <span className="text-white">{section.title}</span>
                                                <span className={section.content ? "text-green-400" : "text-zinc-600"}>
                                                    {section.content ? "✓ Completado" : "Pendiente"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Tips para una Brand Story efectiva</h3>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500">•</span>
                                            <span>Comienza con el "por qué" - la motivación behind your business</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500">•</span>
                                            <span>Incluye momentos de transformación que definieron el rumbo</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500">•</span>
                                            <span>Sé auténtico: la vulnerabilidad genera conexión</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-500">•</span>
                                            <span>Proyecta una visión inspiradora pero realista</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Editar Secciones</h3>
                                    <Button variant="outline" size="sm" onClick={() => setEditingSection("new")}>
                                        <Plus size={14} className="mr-2" /> Agregar Sección
                                    </Button>
                                </div>

                                {editingSection === "new" && (
                                    <div className="bg-zinc-900 border border-amber-500/50 rounded-xl p-4">
                                        <Label className="text-sm text-zinc-400 mb-2">Nueva Sección</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newSectionTitle}
                                                onChange={e => setNewSectionTitle(e.target.value)}
                                                placeholder="Título de la sección"
                                                className="flex-1"
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={addSection}>Agregar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingSection(null)}>Cancelar</Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {sortedSections.map(section => (
                                        <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-white font-medium text-lg">{section.title}</h4>
                                                {sortedSections.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteSection(section.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                            <Textarea
                                                value={section.content}
                                                onChange={e => updateSection(section.id, e.target.value)}
                                                placeholder={`Escribe la sección de ${section.title.toLowerCase()}...`}
                                                className="min-h-[150px] bg-zinc-950 border-zinc-700 text-white resize-none"
                                            />
                                            <p className="text-xs text-zinc-500 mt-2">{section.content.length} caracteres</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white text-zinc-900 rounded-xl p-8 md:p-12">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Nuestra Historia</h1>

                                    {sortedSections.every(s => !s.content) ? (
                                        <p className="text-center text-zinc-500 italic">
                                            Tu brand story aparecerá aquí. Comienza a editar las secciones.
                                        </p>
                                    ) : (
                                                                        <div className="space-y-8">
                                            {sortedSections.map(section => (
                                                                                section.content && (
                                                                                    <div key={section.id} className="space-y-3">
                                                                                        <h2 className="text-2xl font-bold text-zinc-800">
                                                                                            {section.title}
                                                                                        </h2>
                                                                                        <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                                                                            {section.content}
                                                                                        </p>
                                                                                    </div>
                                                                                )
                                                                            ))}
                                                                        </div>
                                                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Exportar Brand Story</h3>
                                    <p className="text-sm text-zinc-400">Descarga tu narrativa en diferentes formatos.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                        onClick={() => {
                                            const text = sortedSections.map(s => `# ${s.title}\n\n${s.content}`).join("\n\n");
                                            navigator.clipboard.writeText(text);
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
                                            const text = sortedSections.map(s => `${s.title}\n\n${s.content}`).join("\n\n");
                                            navigator.clipboard.writeText(text);
                                            toast.success("Texto plano copiado");
                                        }}
                                    >
                                        <Download size={20} />
                                        <span className="font-medium">Texto Plano</span>
                                        <span className="text-xs text-zinc-500">Para email/chat</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                        onClick={() => {
                                            const json = JSON.stringify(storyData, null, 2);
                                            navigator.clipboard.writeText(json);
                                            toast.success("JSON copiado al portapapeles");
                                        }}
                                    >
                                        <Download size={20} />
                                        <span className="font-medium">JSON</span>
                                        <span className="text-xs text-zinc-500">Para integraciones</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                        onClick={() => {
                                            const text = JSON.stringify(storyData, null, 2);
                                            const blob = new Blob([text], { type: "application/json" });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url;
                                            a.download = "brand-story.json";
                                            a.click();
                                            URL.revokeObjectURL(url);
                                            toast.success("Archivo descargado");
                                        }}
                                    >
                                        <Download size={20} />
                                        <span className="font-medium">Descargar Archivo</span>
                                        <span className="text-xs text-zinc-500">JSON local</span>
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

export default function BrandStoryWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="brandStory"
            moduleName="Brand Story"
            moduleSubtitle="Construye la narrativa completa de tu marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <BrandStoryWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
