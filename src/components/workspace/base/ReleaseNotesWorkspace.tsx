"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Edit, Eye, Download, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

type ReleaseCategory = "new" | "improved" | "fixed" | "removed";

interface ReleaseItem {
    id: string;
    category: ReleaseCategory;
    description: string;
    module?: string;
}

interface ReleaseEntry {
    id: string;
    version: string;
    date: string;
    title: string;
    items: ReleaseItem[];
    published: boolean;
    module?: string;
}

interface ReleaseNotesData {
    entries: ReleaseEntry[];
    categories: Array<{ key: ReleaseCategory; label: string; color: string }>;
}

const defaultCategories: Array<{ key: ReleaseCategory; label: string; color: string }> = [
    { key: "new", label: "Novedades", color: "bg-green-500/20 text-green-400" },
    { key: "improved", label: "Mejoras", color: "bg-blue-500/20 text-blue-400" },
    { key: "fixed", label: "Correcciones", color: "bg-amber-500/20 text-amber-400" },
    { key: "removed", label: "Eliminado", color: "bg-red-500/20 text-red-400" }
];

const defaultReleaseData: ReleaseNotesData = {
    entries: [
        {
            id: "1",
            version: "1.0.0",
            date: new Date().toISOString().split("T")[0],
            title: "Lanzamiento Inicial del Brand Manual",
            items: [
                { id: "1-1", category: "new", description: "Sistema de gestión de colores", module: "colors" },
                { id: "1-2", category: "new", description: "Tipografías primarias y secundarias", module: "typography" },
                { id: "1-3", category: "new", description: "Galería de logotipos y variaciones", module: "logo" }
            ],
            published: true
        }
    ],
    categories: defaultCategories
};

function ReleaseNotesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [releaseData, setReleaseData] = useState<ReleaseNotesData>(data?.content?.releaseData || defaultReleaseData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [newEntry, setNewEntry] = useState<Partial<ReleaseEntry>>({ items: [] });
    const [addingItem, setAddingItem] = useState<string | null>(null);

    const updateField = useCallback((field: keyof ReleaseNotesData, value: any) => {
        setReleaseData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updateEntry = useCallback((id: string, field: keyof ReleaseEntry, value: any) => {
        setReleaseData(prev => ({
            ...prev,
            entries: prev.entries.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
        setHasChanges(true);
    }, []);

    const updateItem = useCallback((entryId: string, itemId: string, field: keyof ReleaseItem, value: any) => {
        setReleaseData(prev => ({
            ...prev,
            entries: prev.entries.map(e =>
                e.id === entryId
                    ? { ...e, items: e.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
                    : e
            )
        }));
        setHasChanges(true);
    }, []);

    const addEntry = useCallback(() => {
        if (newEntry.version && newEntry.title) {
            const entry: ReleaseEntry = {
                id: Date.now().toString(),
                version: newEntry.version,
                date: newEntry.date || new Date().toISOString().split("T")[0],
                title: newEntry.title,
                items: newEntry.items || [],
                published: false
            };
            setReleaseData(prev => ({ ...prev, entries: [entry, ...prev.entries] }));
            setNewEntry({ items: [] });
            setEditingEntry(null);
            setHasChanges(true);
        }
    }, [newEntry]);

    const deleteEntry = useCallback((id: string) => {
        setReleaseData(prev => ({ ...prev, entries: prev.entries.filter(e => e.id !== id) }));
        setHasChanges(true);
    }, []);

    const addItem = useCallback((entryId: string) => {
        const item: ReleaseItem = {
            id: `${entryId}-${Date.now()}`,
            category: "new",
            description: ""
        };
        setReleaseData(prev => ({
            ...prev,
            entries: prev.entries.map(e =>
                e.id === entryId ? { ...e, items: [...e.items, item] } : e
            )
        }));
        setHasChanges(true);
    }, []);

    const deleteItem = useCallback((entryId: string, itemId: string) => {
        setReleaseData(prev => ({
            ...prev,
            entries: prev.entries.map(e =>
                e.id === entryId ? { ...e, items: e.items.filter(i => i.id !== itemId) } : e
            )
        }));
        setHasChanges(true);
    }, []);

    const togglePublish = useCallback((id: string) => {
        updateEntry(id, "published", !releaseData.entries.find(e => e.id === id)?.published);
    }, [releaseData.entries, updateEntry]);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, releaseData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setReleaseData(data?.content?.releaseData || defaultReleaseData);
        setHasChanges(false);
    };

    const getCategoryInfo = (category: ReleaseCategory) => {
        return releaseData.categories.find(c => c.key === category) || releaseData.categories[0];
    };

    const generateMarkdown = () => {
        let md = "# Release Notes - Brand Manual\n\n";

        releaseData.entries
            .filter(e => e.published)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .forEach(entry => {
                md += `## ${entry.version} - ${entry.title}\n`;
                md += `**${new Date(entry.date).toLocaleDateString()}**\n\n`;

                releaseData.categories.forEach(cat => {
                    const items = entry.items.filter(i => i.category === cat.key);
                    if (items.length > 0) {
                        md += `### ${cat.label}\n`;
                        items.forEach(item => {
                            md += `- ${item.description}${item.module ? ` (${item.module})` : ""}\n`;
                        });
                        md += "\n";
                    }
                });
                    });

        return md;
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
                        <TabsTrigger value="overview"><FileText size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="changelog"><Edit size={14} className="mr-2" /> Changelog</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Release Notes</h2>
                                    <p className="text-zinc-400">Gestiona el historial de cambios de tu Brand Manual.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Versiones", icon: "🏷️", desc: "Control de versiones" },
                                        { title: "Categorías", icon: "📂", desc: "Tipo de cambios" },
                                        { title: "Historia", icon: "📜", desc: "Timeline completo" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Versiones Recientes</h3>
                                    <div className="space-y-3">
                                        {releaseData.entries
                                            .filter(e => e.published)
                                            .slice(0, 3)
                                            .map(entry => (
                                                <div key={entry.id} className="flex items-center justify-between bg-zinc-950 rounded-lg p-3">
                                                    <div>
                                                        <p className="text-white font-medium">{entry.version} - {entry.title}</p>
                                                        <p className="text-sm text-zinc-500">{new Date(entry.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="text-zinc-400 text-sm">{entry.items.length} cambios</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="changelog" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-semibold">Historial de Versiones</h3>
                                    <Button onClick={() => setEditingEntry("new")} className="bg-amber-500 hover:bg-amber-600 text-white">
                                        <Plus size={14} className="mr-2" /> Nueva Versión
                                    </Button>
                                </div>

                                {editingEntry === "new" && (
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h4 className="text-white font-medium">Nueva Versión</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs text-zinc-500">Versión</Label>
                                                <Input value={newEntry.version || ""} onChange={e => setNewEntry({ ...newEntry, version: e.target.value })} placeholder="1.0.0" className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Fecha</Label>
                                                <Input type="date" value={newEntry.date || ""} onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} className="bg-zinc-950" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Módulo (opcional)</Label>
                                                <Input value={newEntry.module || ""} onChange={e => setNewEntry({ ...newEntry, module: e.target.value })} placeholder="colors" className="bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-zinc-500">Título</Label>
                                            <Input value={newEntry.title || ""} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} placeholder="Ej: Actualización de colores" className="bg-zinc-950" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={addEntry} className="bg-amber-500 hover:bg-amber-600 text-white">Crear</Button>
                                            <Button size="sm" variant="ghost" onClick={() => { setEditingEntry(null); setNewEntry({ items: [] }); }}>Cancelar</Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {releaseData.entries.map(entry => (
                                        <div key={entry.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-zinc-950 text-white px-3 py-1 rounded font-mono">{entry.version}</span>
                                                    <div>
                                                        <h4 className="text-white font-medium">{entry.title}</h4>
                                                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(entry.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant={entry.published ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => togglePublish(entry.id)}
                                                        className={entry.published ? "bg-green-500 hover:bg-green-600" : ""}
                                                    >
                                                        {entry.published ? "Publicado" : "Borrador"}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)} className="text-red-400">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">Cambios ({entry.items.length})</span>
                                                    <Button variant="outline" size="sm" onClick={() => addItem(entry.id)} className="bg-zinc-800">
                                                        <Plus size={12} className="mr-1" /> Agregar
                                                    </Button>
                                                </div>
                                                {entry.items.map(item => {
                                                    const catInfo = getCategoryInfo(item.category);
                                                    return (
                                                        <div key={item.id} className="bg-zinc-950 rounded-lg p-3">
                                                            <div className="flex items-start gap-3">
                                                                <span className={`px-2 py-0.5 rounded text-xs ${catInfo.color}`}>{catInfo.label}</span>
                                                                <Input
                                                                    value={item.description}
                                                                    onChange={e => updateItem(entry.id, item.id, "description", e.target.value)}
                                                                    placeholder="Descripción del cambio..."
                                                                    className="bg-transparent flex-1 border-0 focus-visible:ring-0 p-0 text-sm"
                                                                />
                                                                <select
                                                                    value={item.category}
                                                                    onChange={e => updateItem(entry.id, item.id, "category", e.target.value as ReleaseCategory)}
                                                                    className="bg-zinc-800 text-xs rounded px-2 py-1"
                                                                >
                                                                    {releaseData.categories.map(cat => (
                                                                        <option key={cat.key} value={cat.key}>{cat.label}</option>
                                                                    ))}
                                                                </select>
                                                                <Button variant="ghost" size="sm" onClick={() => deleteItem(entry.id, item.id)} className="text-red-400 h-6 w-6 p-0">×</Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-semibold">Vista Previa</h3>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => {
                                                navigator.clipboard.writeText(generateMarkdown());
                                                toast.success("Markdown copiado");
                                            }}>
                                                        Copiar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-950 rounded-lg p-6">
                                        <div className="prose prose-invert max-w-none">
                                            {releaseData.entries
                                                .filter(e => e.published)
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .map(entry => (
                                                    <div key={entry.id} className="mb-8 last:mb-0">
                                                        <h2 className="text-xl font-bold text-white mb-2">{entry.version} - {entry.title}</h2>
                                                        <p className="text-sm text-zinc-500 mb-4">{new Date(entry.date).toLocaleDateString()}</p>
                                                        {releaseData.categories.map(cat => {
                                                            const items = entry.items.filter(i => i.category === cat.key);
                                                            if (items.length === 0) return null;
                                                            return (
                                                                <div key={cat.key} className="mb-3">
                                                                    <h4 className={`text-sm font-medium mb-2 ${cat.color.split(" ")[1]}`}>{cat.label}</h4>
                                                                    <ul className="space-y-1">
                                                                        {items.map(item => (
                                                                            <li key={item.id} className="text-sm text-zinc-300 flex items-start gap-2">
                                                                                <span>•</span>
                                                                                <span>{item.description}</span>
                                                                                {item.module && <code className="text-xs bg-zinc-800 px-1 rounded text-zinc-500">{item.module}</code>}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(releaseData, null, 2));
                                    toast.success("JSON copiado al portapapeles");
                                }}>
                                    <Download size={20} />
                                    <span>Exportar JSON</span>
                                </Button>
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(generateMarkdown());
                                    toast.success("Markdown copiado al portapapeles");
                                }}>
                                    <FileText size={20} />
                                    <span>Exportar Markdown</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function ReleaseNotesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="releaseNotes"
            moduleName="Release Notes"
            moduleSubtitle="Historial de cambios del Brand Manual"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <ReleaseNotesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
