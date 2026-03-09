"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface TicketTemplate {
    type: string;
    subject: string;
    response: string;
}

interface TicketsData {
    templates: TicketTemplate[];
}

const defaultTicketsData: TicketsData = {
    templates: [
        { type: "welcome", subject: "¡Bienvenido!", response: "Gracias por contactarnos. ¿En qué podemos ayudarte?" },
        { type: "support", subject: "Hemos recibido tu mensaje", response: "Un especialista te responderá pronto." },
        { type: "resolved", subject: "Tu ticket ha sido resuelto", response: "Esperamos que hayas quedado satisfecho con la solución." },
        { type: "followup", subject: "¿Cómo va todo?", response: "Queremos asegurarnos de que tu problema fue resuelto." }
    ]
};

function SupportTicketsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [ticketsData, setTicketsData] = useState<TicketsData>(data?.content?.ticketsData || defaultTicketsData);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(0);

    const updateTemplate = useCallback((field: keyof TicketTemplate, value: string) => {
        setTicketsData(prev => ({
            ...prev,
            templates: prev.templates.map((t, i) =>
                i === selectedTemplate ? { ...t, [field]: value } : t
            )
        }));
        setHasChanges(true);
    }, [selectedTemplate]);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, ticketsData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTicketsData(data?.content?.ticketsData || defaultTicketsData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><MessageSquare size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Tickets de Soporte</h2>
                                    <p className="text-zinc-400">Mensajería de soporte y flujos de atención.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {ticketsData.templates.map(t => (
                                        <div key={t.type} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">💬</div>
                                            <h3 className="text-white font-medium">{t.subject}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex gap-2 mb-4">
                                    {ticketsData.templates.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedTemplate(i)}
                                            className={`px-4 py-2 rounded-lg ${selectedTemplate === i ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
                                        >
                                            Template {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold mb-2">{ticketsData.templates[selectedTemplate].type.toUpperCase()}</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Asunto</Label>
                                        <Input value={ticketsData.templates[selectedTemplate].subject} onChange={e => updateTemplate("subject", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Respuesta</Label>
                                        <Textarea value={ticketsData.templates[selectedTemplate].response} onChange={e => updateTemplate("response", e.target.value)} className="min-h-[120px] bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-8">
                                    <h3 className="text-white font-semibold mb-4">Vista de Chat</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">U</div>
                                            <div className="flex-1 bg-zinc-800 rounded-xl p-4">
                                                <p className="text-white text-sm">Hola, tengo un problema con mi pedido</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">S</div>
                                            <div className="flex-1 bg-zinc-800 rounded-xl p-4">
                                                <p className="text-zinc-400 text-sm">{ticketsData.templates[1].response}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">U</div>
                                            <div className="flex-1 bg-zinc-800 rounded-xl p-4">
                                                <p className="text-white text-sm">{ticketsData.templates[2].response}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(ticketsData, null, 2));
                                    toast.success("JSON copiado");
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

export default function SupportTicketsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="supportTickets"
            moduleName="Tickets de Soporte"
            moduleSubtitle="Mensajería de soporte y flujos de atención"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <SupportTicketsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
