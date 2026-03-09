"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Edit, Eye, Download, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface AudioBrandingData {
    sonicLogo?: string;
    musicStyle: string[];
    voiceoverStyle?: string;
    storePlaylist?: string;
    notificationSounds?: NotificationSound[];
    audioGuidelines?: string;
}

interface NotificationSound {
    id: string;
    name: string;
    description: string;
}

const defaultAudioBrandingData: AudioBrandingData = {
    musicStyle: [],
    notificationSounds: [
        { id: "1", name: "Notificación Éxito", description: "Sonido para confirmaciones positivas" },
        { id: "2", name: "Notificación Error", description: "Sonido para errores y alertas" },
        { id: "3", name: "Mensaje Nuevo", description: "Sonido para mensajes entrantes" },
    ]
};

const musicOptions = [
    "Electrónica/Moderna",
    "Pop/Mainstream",
    "Lofi/Chill",
    "Corporativo/Ambient",
    "Latina/Regional",
    "Jazz/Suave",
    "Rock/Energía",
    "Clásica/Elegante",
    "Sin música, solo efectos"
];

function AudioBrandingWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [audioData, setAudioData] = useState<AudioBrandingData>(
        data?.content?.audioData || defaultAudioBrandingData
    );
    const [hasChanges, setHasChanges] = useState(false);

    const toggleMusicStyle = useCallback((style: string) => {
        setAudioData(prev => ({
            ...prev,
            musicStyle: prev.musicStyle.includes(style)
                ? prev.musicStyle.filter(s => s !== style)
                : [...prev.musicStyle, style]
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({
            ...data,
            content: {
                ...data?.content,
                audioData
            }
        });
        if (success) {
            setHasChanges(false);
        }
    };

    const handleDiscard = () => {
        setAudioData(data?.content?.audioData || defaultAudioBrandingData);
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
                            <Music size={14} className="mr-2" /> Resumen
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Audio Branding</h2>
                                    <p className="text-zinc-400">Define la identidad sonora de tu marca: desde el sonic logo hasta la playlist de tu tienda.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Componentes del Audio Branding</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-amber-500/20 rounded-lg"><Music size={20} className="text-amber-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Sonic Logo</h4>
                                                <p className="text-sm text-zinc-500">Identidad auditiva de marca de 2-3 segundos</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-blue-500/20 rounded-lg"><Volume2 size={20} className="text-blue-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Notificaciones</h4>
                                                <p className="text-sm text-zinc-500">Sonidos para feedback en apps y sitios</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-green-500/20 rounded-lg"><Play size={20} className="text-green-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Playlist de Tienda</h4>
                                                <p className="text-sm text-zinc-500">Música ambiental para espacios físicos</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-purple-500/20 rounded-lg"><Music size={20} className="text-purple-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Voiceover</h4>
                                                <p className="text-sm text-zinc-500">Estilo de voz para videos y ads</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Configurar Identidad Sonora</h3>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h4 className="text-white font-medium mb-4">Estilo Musical</h4>
                                    <p className="text-sm text-zinc-500 mb-4">Selecciona los géneros que representan tu marca:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {musicOptions.map(style => (
                                            <button
                                                key={style}
                                                onClick={() => toggleMusicStyle(style)}
                                                                                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                                                                    audioData.musicStyle.includes(style)
                                                                                        ? "bg-amber-500 text-white"
                                                                                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                                                                }`}
                                                                            >
                                                                                {style}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                                                    <Label className="text-white font-medium mb-2 block">Sonic Logo</Label>
                                                                    <p className="text-sm text-zinc-500 mb-3">Describe cómo debería sonar tu marca en 2-3 segundos</p>
                                                                    <Textarea
                                                                        value={audioData.sonicLogo || ""}
                                                                        onChange={e => {
                                                                            setAudioData(prev => ({ ...prev, sonicLogo: e.target.value }));
                                                                            setHasChanges(true);
                                                                        }}
                                                                        placeholder="Ej: Un ascenso melódico en tonos mayores, finalizando con un 'ding' brillante..."
                                                                        className="min-h-[100px] bg-zinc-950 border-zinc-700"
                                                                    />
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                                                    <Label className="text-white font-medium mb-2 block">Estilo de Voiceover</Label>
                                                                    <p className="text-sm text-zinc-500 mb-3">Describe el estilo de voz para contenido de video</p>
                                                                    <Input
                                                                        value={audioData.voiceoverStyle || ""}
                                                                        onChange={e => {
                                                                            setAudioData(prev => ({ ...prev, voiceoverStyle: e.target.value }));
                                                                            setHasChanges(true);
                                                                        }}
                                                                        placeholder="Ej: Voz femenina, tono cálido, 30-40 años, español neutro"
                                                                        className="bg-zinc-950 border-zinc-700"
                                                                    />
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                                                    <Label className="text-white font-medium mb-2 block">Playlist de Tienda (Opcional)</Label>
                                                                    <p className="text-sm text-zinc-500 mb-3">Descripción del ambiente sonoro para espacios físicos</p>
                                                                    <Textarea
                                                                        value={audioData.storePlaylist || ""}
                                                                        onChange={e => {
                                                                            setAudioData(prev => ({ ...prev, storePlaylist: e.target.value }));
                                                                            setHasChanges(true);
                                                                        }}
                                                                        placeholder="Ej: Lo-fi instrumental durante el día, más energético en tardes..."
                                                                        className="min-h-[80px] bg-zinc-950 border-zinc-700"
                                                                    />
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                                                    <Label className="text-white font-medium mb-4 block">Sonidos de Notificación</Label>
                                                                    <div className="space-y-3">
                                                                        {audioData.notificationSounds?.map((sound, idx) => (
                                                                            <div key={sound.id} className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg">
                                                                                <span className="text-amber-500 font-mono text-sm">{idx + 1}</span>
                                                                                <div className="flex-1">
                                                                                    <p className="text-white text-sm font-medium">{sound.name}</p>
                                                                                    <p className="text-zinc-500 text-xs">{sound.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div className="bg-white text-zinc-900 rounded-xl p-8">
                                                                    <h3 className="text-2xl font-bold mb-6 text-center">Guía de Audio Branding</h3>

                                                                    <div className="space-y-6">
                                                                        <div>
                                                                            <h4 className="font-semibold text-lg mb-2 border-b border-zinc-300 pb-2">Sonic Logo</h4>
                                                                            <p className="text-zinc-600">
                                                                                {audioData.sonicLogo || "Define tu sonic logo en el editor..."}
                                                                            </p>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-semibold text-lg mb-2 border-b border-zinc-300 pb-2">Estilo Musical</h4>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {audioData.musicStyle.length > 0 ? (
                                                                                    audioData.musicStyle.map(style => (
                                                                                        <span key={style} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                                                                                            {style}
                                                                                        </span>
                                                                                    ))
                                                                                ) : (
                                                                                    <span className="text-zinc-500 italic">No seleccionado</span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-semibold text-lg mb-2 border-b border-zinc-300 pb-2">Voiceover</h4>
                                                                            <p className="text-zinc-600">
                                                                                {audioData.voiceoverStyle || "Define el estilo de voiceover en el editor..."}
                                                                            </p>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-semibold text-lg mb-2 border-b border-zinc-300 pb-2">Sonidos de Notificación</h4>
                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                                {audioData.notificationSounds?.map((sound, idx) => (
                                                                                    <div key={sound.id} className="p-3 bg-zinc-100 rounded-lg text-center">
                                                                                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                                            <Volume2 size={18} className="text-white" />
                                                                                        </div>
                                                                                        <p className="font-medium text-sm">{sound.name}</p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white mb-2">Exportar Audio Branding</h3>
                                                                    <p className="text-sm text-zinc-400">Descarga tu guía de identidad sonora.</p>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const markdown = `# Audio Branding

## Sonic Logo
${audioData.sonicLogo || "No definido"}

## Estilo Musical
${audioData.musicStyle.join(", ") || "No definido"}

## Voiceover
${audioData.voiceoverStyle || "No definido"}

## Playlist de Tienda
${audioData.storePlaylist || "No definido"}

## Sonidos de Notificación
${audioData.notificationSounds?.map(s => `- ${s.name}: ${s.description}`).join("\n") || ""}
`;
                                                                            navigator.clipboard.writeText(markdown);
                                                                            toast.success("Markdown copiado");
                                                                        }}
                                                                    >
                                                                        <Download size={20} />
                                                                        <span className="font-medium">Markdown</span>
                                                                        <span className="text-xs text-zinc-500">Guía de documentación</span>
                                                                    </Button>

                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const json = JSON.stringify(audioData, null, 2);
                                                                            navigator.clipboard.writeText(json);
                                                                            toast.success("JSON copiado");
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

export default function AudioBrandingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="audioBranding"
            moduleName="Audio Branding"
            moduleSubtitle="Define la identidad sonora de tu marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <AudioBrandingWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
