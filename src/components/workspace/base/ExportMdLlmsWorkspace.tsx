"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Edit, Eye, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface ModuleExport {
    moduleKey: string;
    moduleName: string;
    include: boolean;
}

interface LlmProvider {
    name: string;
    format: "xml" | "json" | "markdown";
    description: string;
}

interface ExportMdData {
    selectedModules: ModuleExport[];
    format: "markdown" | "json" | "xml";
    llmProvider: LlmProvider["name"];
    includeExamples: boolean;
    outputTemplate: string;
}

const defaultModules: ModuleExport[] = [
    { moduleKey: "colors", moduleName: "Colores", include: true },
    { moduleKey: "typography", moduleName: "Tipografía", include: true },
    { moduleKey: "logo", moduleName: "Logotipo", include: true },
    { moduleKey: "imagery", moduleName: "Imaginería", include: true },
    { moduleKey: "voice", moduleName: "Voz de Marca", include: true },
    { moduleKey: "components", moduleName: "Componentes UI", include: false },
    { moduleKey: "patterns", moduleName: "Patrones", include: false }
];

const llmProviders: LlmProvider[] = [
    { name: "chatgpt", format: "markdown", description: "Optimizado para ChatGPT y GPT-4" },
    { name: "claude", format: "markdown", description: "Optimizado para Claude (Anthropic)" },
    { name: "copilot", format: "xml", description: "Formato estructurado para GitHub Copilot" },
    { name: "custom", format: "json", description: "Formato JSON personalizado" }
];

const defaultExportData: ExportMdData = {
    selectedModules: defaultModules,
    format: "markdown",
    llmProvider: "claude",
    includeExamples: true,
    outputTemplate: `# Brand Manual: {brandName}

## Overview
{overview}

## Colors
{colors}

## Typography
{typography}

## Logo
{logo}`
};

function ExportMdLlmsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [exportData, setExportData] = useState<ExportMdData>(data?.content?.exportData || defaultExportData);
    const [hasChanges, setHasChanges] = useState(false);
    const [copied, setCopied] = useState(false);

    const updateField = useCallback((field: keyof ExportMdData, value: any) => {
        setExportData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const toggleModule = useCallback((moduleKey: string) => {
        setExportData(prev => ({
            ...prev,
            selectedModules: prev.selectedModules.map(m =>
                m.moduleKey === moduleKey ? { ...m, include: !m.include } : m
            )
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, exportData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setExportData(data?.content?.exportData || defaultExportData);
        setHasChanges(false);
    };

    const handleCopyToClipboard = () => {
        const content = generateExport();
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const content = generateExport();
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brand-manual-${exportData.format}.${exportData.format === "json" ? "json" : exportData.format === "xml" ? "xml" : "md"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Archivo descargado");
    };

    const generateExport = () => {
        const selected = exportData.selectedModules.filter(m => m.include);
        let content = exportData.outputTemplate;

        // Reemplazar marcadores con contenido (simplificado)
        content = content.replace("{brandName}", "Tu Marca");
        content = content.replace("{overview}", "# Brand Overview\n\nEste documento contiene las guías de identidad de marca.");
        content = content.replace("{colors}", "## Paleta de Colores\n\n- Primary: #000000\n- Secondary: #FFFFFF");
        content = content.replace("{typography}", "## Tipografía\n\n- Primary: Inter\n- Secondary: Roboto");
        content = content.replace("{logo}", "## Logotipo\n\nUsar el logo oficial en todas las comunicaciones.");

        if (exportData.format === "json") {
            return JSON.stringify({
                brandName: "Tu Marca",
                modules: selected.map(m => m.moduleKey),
                provider: exportData.llmProvider,
                includeExamples: exportData.includeExamples
            }, null, 2);
        }

        if (exportData.format === "xml") {
            return `<?xml version="1.0" encoding="UTF-8"?>
<brand-manual>
    <brand-name>Tu Marca</brand-name>
    <modules>
        ${selected.map(m => `        <module key="${m.moduleKey}">${m.moduleName}</module>`).join("\n")}
    </modules>
    <provider>${exportData.llmProvider}</provider>
</brand-manual>`;
        }

        return content;
    };

    const previewContent = generateExport();

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
                        <TabsTrigger value="generator"><Edit size={14} className="mr-2" /> Generador</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Exportar para LLMs</h2>
                                    <p className="text-zinc-400">Genera documentación optimizada para asistentes de IA.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Formatos", icon: "📄", desc: "Markdown, JSON, XML" },
                                        { title: "Proveedores", icon: "🤖", desc: "GPT, Claude, Copilot" },
                                        { title: "Prompting", icon: "💬", desc: "Optimizado para contextos" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Módulos Seleccionados</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {exportData.selectedModules.filter(m => m.include).map(m => (
                                            <span key={m.moduleKey} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                                                {m.moduleName}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-zinc-500 text-sm mt-3">
                                        {exportData.selectedModules.filter(m => m.include).length} de {exportData.selectedModules.length} módulos seleccionados
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="generator" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Módulos a Exportar</h3>
                                    <p className="text-sm text-zinc-500">Selecciona los módulos que incluirás en la exportación</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {exportData.selectedModules.map(module => (
                                            <label key={module.moduleKey} className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3 cursor-pointer hover:bg-zinc-900 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={module.include}
                                                    onChange={() => toggleModule(module.moduleKey)}
                                                    className="w-5 h-5"
                                                />
                                                <span className={module.include ? "text-white" : "text-zinc-500"}>{module.moduleName}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-white font-semibold">Formato de Salida</h3>
                                        <div className="space-y-2">
                                            {["markdown", "json", "xml"].map(format => (
                                                <label key={format} className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="format"
                                                        checked={exportData.format === format}
                                                        onChange={() => updateField("format", format)}
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-white capitalize">{format.toUpperCase()}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-white font-semibold">Proveedor LLM</h3>
                                        <div className="space-y-2">
                                            {llmProviders.map(provider => (
                                                <label key={provider.name} className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="llm"
                                                        checked={exportData.llmProvider === provider.name}
                                                        onChange={() => updateField("llmProvider", provider.name)}
                                                        className="w-5 h-5"
                                                    />
                                                    <div>
                                                        <span className="text-white capitalize">{provider.name}</span>
                                                        <p className="text-xs text-zinc-500">{provider.description}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Opciones Adicionales</h3>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exportData.includeExamples}
                                            onChange={e => updateField("includeExamples", e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-white">Incluir ejemplos de uso</span>
                                    </label>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Plantilla de Salida</h3>
                                    <p className="text-sm text-zinc-500">Personaliza la estructura del documento generado</p>
                                    <Textarea
                                        value={exportData.outputTemplate}
                                        onChange={e => updateField("outputTemplate", e.target.value)}
                                        className="bg-zinc-950 font-mono text-sm"
                                        rows={12}
                                    />
                                    <p className="text-xs text-zinc-500">Variables disponibles: {"{brandName}"}, {"{overview}"}, {"{colors}"}, {"{typography}"}, {"{logo}"}, etc.</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-semibold">Vista Previa</h3>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                                                {copied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                                                {copied ? "Copiado" : "Copiar"}
                                            </Button>
                                            <Button size="sm" onClick={handleDownload}>Descargar</Button>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-950 rounded-lg p-4 max-h-[500px] overflow-auto">
                                        <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">{previewContent}</pre>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={handleDownload}>
                                    <Download size={20} />
                                    <span>Descargar Archivo</span>
                                    <span className="text-xs text-zinc-500">.{exportData.format}</span>
                                </Button>
                                <Button variant="outline" className="w-full h-20 flex-col gap-2" onClick={handleCopyToClipboard}>
                                    <Copy size={20} />
                                    <span>Copiar al Portapapeles</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function ExportMdLlmsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="exportMdLlms"
            moduleName="Export para LLMs"
            moduleSubtitle="Documentación optimizada para IA"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <ExportMdLlmsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
