"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link2, Edit, Eye, Download, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface SyncField {
    notionField: string;
    brandModule: string;
    lastSync: string;
}

interface NotionConfig {
    apiKey: string;
    databaseId: string;
    connected: boolean;
    lastSync: string;
    syncFields: SyncField[];
    autoSync: boolean;
    syncInterval: number;
}

interface NotionData {
    config: NotionConfig;
    logs: Array<{ timestamp: string; action: string; status: "success" | "error"; message: string }>;
}

const defaultNotionData: NotionData = {
    config: {
        apiKey: "",
        databaseId: "",
        connected: false,
        lastSync: "",
        syncFields: [
            { notionField: "Nombre", brandModule: "brand.name", lastSync: "" },
            { notionField: "Colores", brandModule: "colors.primary", lastSync: "" },
            { notionField: "Tipografía", brandModule: "typography.primary", lastSync: "" }
        ],
        autoSync: false,
        syncInterval: 60
    },
    logs: []
};

function NotionConnectorWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [notionData, setNotionData] = useState<NotionData>(data?.content?.notionData || defaultNotionData);
    const [hasChanges, setHasChanges] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const updateConfig = useCallback((field: keyof NotionConfig, value: any) => {
        setNotionData(prev => ({
            ...prev,
            config: { ...prev.config, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const addLog = useCallback((action: string, status: "success" | "error", message: string) => {
        setNotionData(prev => ({
            ...prev,
            logs: [...prev.logs, {
                timestamp: new Date().toISOString(),
                action,
                status,
                message
            }],
            config: {
                ...prev.config,
                lastSync: new Date().toISOString()
            }
        }));
    }, []);

    const handleConnect = async () => {
        if (!notionData.config.apiKey || !notionData.config.databaseId) {
            toast.error("Ingresa API Key y Database ID");
            return;
        }

        setIsConnecting(true);
        // Simulación de conexión
        setTimeout(() => {
            setNotionData(prev => ({
                ...prev,
                config: { ...prev.config, connected: true }
            }));
            addLog("Conectar", "success", "Conexión exitosa con Notion");
            setIsConnecting(false);
            toast.success("Conectado a Notion");
            setHasChanges(true);
        }, 1500);
    };

    const handleDisconnect = () => {
        setNotionData(prev => ({
            ...prev,
            config: { ...prev.config, connected: false }
        }));
        addLog("Desconectar", "success", "Desconectado de Notion");
        toast.success("Desconectado de Notion");
        setHasChanges(true);
    };

    const handleSync = () => {
        addLog("Sincronizar", "success", "Brand Manual sincronizado con Notion");
        toast.success("Sincronización completada");
        setHasChanges(true);
    };

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, notionData } });
        if (success) {
            setHasChanges(false);
            toast.success("Configuración guardada");
        }
    };

    const handleDiscard = () => {
        setNotionData(data?.content?.notionData || defaultNotionData);
        setHasChanges(false);
    };

    const addSyncField = useCallback(() => {
        setNotionData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                syncFields: [...prev.config.syncFields, { notionField: "", brandModule: "", lastSync: "" }]
            }
        }));
        setHasChanges(true);
    }, []);

    const updateSyncField = useCallback((index: number, field: keyof SyncField, value: string) => {
        setNotionData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                syncFields: prev.config.syncFields.map((f, i) => i === index ? { ...f, [field]: value } : f)
            }
        }));
        setHasChanges(true);
    }, []);

    const removeSyncField = useCallback((index: number) => {
        setNotionData(prev => ({
            ...prev,
            config: {
                ...prev.config,
                syncFields: prev.config.syncFields.filter((_, i) => i !== index)
            }
        }));
        setHasChanges(true);
    }, []);

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
                        <TabsTrigger value="overview"><Link2 size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="config"><Edit size={14} className="mr-2" /> Configurar</TabsTrigger>
                        <TabsTrigger value="sync"><RefreshCw size={14} className="mr-2" /> Sincronizar</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Notion Connector</h2>
                                    <p className="text-zinc-400">Sincroniza tu Brand Manual con bases de datos de Notion.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Autosync", icon: "🔄", desc: "Sincronización automática" },
                                        { title: "Campos", icon: "📋", desc: "Mapeo personalizado" },
                                        { title: "Logs", icon: "📝", desc: "Historial de cambios" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className={`rounded-xl p-6 flex items-center gap-4 ${notionData.config.connected ? "bg-green-500/10 border border-green-500/30" : "bg-zinc-900 border border-zinc-800"}`}>
                                    {notionData.config.connected ? (
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Check className="text-green-500" size={24} />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                                            <AlertCircle className="text-zinc-500" size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={`font-semibold ${notionData.config.connected ? "text-green-400" : "text-white"}`}>
                                            {notionData.config.connected ? "Conectado a Notion" : "No conectado"}
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            {notionData.config.connected
                                                ? `Última sync: ${notionData.config.lastSync ? new Date(notionData.config.lastSync).toLocaleString() : "Nunca"}`
                                                : "Configura tus credenciales para conectar"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="config" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Credenciales de Notion</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">API Key (Integration Token)</Label>
                                        <Input
                                            type="password"
                                            value={notionData.config.apiKey}
                                            onChange={e => updateConfig("apiKey", e.target.value)}
                                            placeholder="secret_..."
                                            className="bg-zinc-950"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">Obtén tu token en https://www.notion.so/my-integrations</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Database ID</Label>
                                        <Input
                                            value={notionData.config.databaseId}
                                            onChange={e => updateConfig("databaseId", e.target.value)}
                                            placeholder="32 caracteres del URL de tu base de datos"
                                            className="bg-zinc-950"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">El ID está en el URL: https://notion.so/workspaces/{"{database_id}"}?v=...</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!notionData.config.connected ? (
                                            <Button onClick={handleConnect} disabled={isConnecting} className="bg-blue-500 hover:bg-blue-600 text-white">
                                                {isConnecting ? "Conectando..." : "Conectar"}
                                            </Button>
                                        ) : (
                                            <Button onClick={handleDisconnect} variant="outline">Desconectar</Button>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Configuración de Sincronización</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="autoSync"
                                            checked={notionData.config.autoSync}
                                            onChange={e => updateConfig("autoSync", e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <Label htmlFor="autoSync" className="text-sm text-zinc-400">Sincronización automática</Label>
                                    </div>
                                    {notionData.config.autoSync && (
                                        <div>
                                            <Label className="text-sm text-zinc-400">Intervalo (minutos)</Label>
                                            <Input
                                                type="number"
                                                value={notionData.config.syncInterval}
                                                onChange={e => updateConfig("syncInterval", parseInt(e.target.value))}
                                                className="bg-zinc-950 w-32"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Mapeo de Campos</h3>
                                        <Button variant="outline" size="sm" onClick={addSyncField} className="bg-zinc-800">
                                            + Agregar campo
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {notionData.config.syncFields.map((field, i) => (
                                            <div key={i} className="grid grid-cols-3 gap-3 items-center">
                                                <Input
                                                    value={field.notionField}
                                                    onChange={e => updateSyncField(i, "notionField", e.target.value)}
                                                    placeholder="Campo en Notion"
                                                    className="bg-zinc-950"
                                                />
                                                <Input
                                                    value={field.brandModule}
                                                    onChange={e => updateSyncField(i, "brandModule", e.target.value)}
                                                    placeholder="Campo del Brand Manual"
                                                    className="bg-zinc-950"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSyncField(i)}
                                                    className="text-red-400"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="sync" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Sincronizar con Notion</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Button
                                            onClick={handleSync}
                                            disabled={!notionData.config.connected}
                                            className="bg-blue-500 hover:bg-blue-600 text-white"
                                        >
                                            <RefreshCw size={16} className="mr-2" />
                                            Sincronizar ahora
                                        </Button>
                                        <p className="text-sm text-zinc-500">
                                            {!notionData.config.connected ? "Conecta primero a Notion" : "Sincronizará todos los campos mapeados"}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-zinc-500">Campos a sincronizar</p>
                                            <p className="text-white">{notionData.config.syncFields.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-500">Última sincronización</p>
                                            <p className="text-white">
                                                {notionData.config.lastSync ? new Date(notionData.config.lastSync).toLocaleString() : "Nunca"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Historial de Sincronización</h3>
                                    <div className="space-y-2">
                                        {notionData.logs.length === 0 ? (
                                            <p className="text-zinc-500 text-sm">No hay sincronizaciones registradas</p>
                                        ) : (
                                            notionData.logs.slice().reverse().map((log, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.status === "success" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                                                        {log.status === "success" ? (
                                                            <Check className="text-green-500" size={14} />
                                                        ) : (
                                                            <AlertCircle className="text-red-500" size={14} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white text-sm">{log.action}</p>
                                                        <p className="text-zinc-500 text-xs">{log.message}</p>
                                                    </div>
                                                    <p className="text-zinc-500 text-xs">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(notionData, null, 2));
                                    toast.success("JSON copiado al portapapeles");
                                }}>
                                    <Download size={20} />
                                    <span>Exportar Configuración</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function NotionConnectorWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="notionConnector"
            moduleName="Notion Connector"
            moduleSubtitle="Sincronización con Notion"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <NotionConnectorWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
