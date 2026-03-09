"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface VideoTemplate {
    id: string;
    name: string;
    duration: string;
    format: "9:16" | "16:9" | "1:1" | "4:5" | "story";
}

interface VideoTemplatesData {
    selectedTemplate: string;
    branding: {
        introAnimation: string;
        outroAnimation: string;
        lowerThirds: string;
        musicStyle: string;
    };
    templates: VideoTemplate[];
}

const defaultVideoTemplatesData: VideoTemplatesData = {
    selectedTemplate: "story",
    branding: {
        introAnimation: "fade-in",
        outroAnimation: "fade-out",
        lowerThirds: "logo-left",
        musicStyle: "upbeat"
    },
    templates: [
        { id: "1", name: "Product Showcase", duration: "0:30", format: "9:16" },
        { id: "2", name: "Testimonial", duration: "0:45", format: "16:9" },
        { id: "3", name: "Tutorial", duration: "1:00", format: "1:1" },
        { id: "4", name: "Story", duration: "0:15", format: "story" }
    ]
};

function VideoTemplatesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [videoData, setVideoData] = useState<VideoTemplatesData>(
        data?.content?.videoData || defaultVideoTemplatesData
    );
    const [hasChanges, setHasChanges] = useState(false);

    const updateBranding = useCallback((field: keyof VideoTemplatesData["branding"], value: string) => {
        setVideoData(prev => ({
            ...prev,
            branding: { ...prev.branding, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, videoData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setVideoData(data?.content?.videoData || defaultVideoTemplatesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Video size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Video Templates</h2>
                                    <p className="text-zinc-400">Lineamientos audiovisuales para contenido de video.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {videoData.templates.map(t => (
                                        <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-2">🎬</div>
                                            <h3 className="text-white font-medium">{t.name}</h3>
                                            <p className="text-xs text-zinc-500 mt-1">{t.format} • {t.duration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Branding de Video</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Intro Animation</Label>
                                            <select
                                                value={videoData.branding.introAnimation}
                                                onChange={e => updateBranding("introAnimation", e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white"
                                            >
                                                <option>fade-in</option>
                                                <option>slide-in</option>
                                                <option>zoom-in</option>
                                                <option>none</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Outro Animation</Label>
                                            <select
                                                value={videoData.branding.outroAnimation}
                                                onChange={e => updateBranding("outroAnimation", e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white"
                                            >
                                                <option>fade-out</option>
                                                <option>slide-out</option>
                                                <option>zoom-out</option>
                                                <option>none</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Lower Thirds</Label>
                                            <select
                                                value={videoData.branding.lowerThirds}
                                                onChange={e => updateBranding("lowerThirds", e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white"
                                            >
                                                <option>logo-left</option>
                                                <option>logo-right</option>
                                                <option>center</option>
                                                <option>none</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Music Style</Label>
                                            <select
                                                value={videoData.branding.musicStyle}
                                                onChange={e => updateBranding("musicStyle", e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white"
                                            >
                                                <option>upbeat</option>
                                                <option>chill</option>
                                                <option>corporate</option>
                                                <option>none</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-5xl mx-auto">
                                <div className="bg-zinc-900 rounded-xl overflow-hidden">
                                    <div className="aspect-video bg-black flex items-center justify-center relative">
                                        <Video size={64} className="text-zinc-700" />
                                        <p className="text-white text-lg">Preview del video</p>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur rounded text-zinc-900 text-sm">
                                            Template: {videoData.selectedTemplate} • {videoData.templates.find(t => t.id === videoData.selectedTemplate)?.duration}
                                        </div>
                                    </div>
                                    <div className="p-6 grid grid-cols-4 gap-4">
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">Intro</h4>
                                            <p className="text-zinc-500 text-xs">{videoData.branding.introAnimation}</p>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">Lower Thirds</h4>
                                            <p className="text-zinc-500 text-xs">{videoData.branding.lowerThirds}</p>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">Outro</h4>
                                            <p className="text-zinc-500 text-xs">{videoData.branding.outroAnimation}</p>
                                        </div>
                                        <div className="bg-zinc-950 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">Music</h4>
                                            <p className="text-zinc-500 text-xs">{videoData.branding.musicStyle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(videoData, null, 2));
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

export default function VideoTemplatesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="videoTemplates"
            moduleName="Video Templates"
            moduleSubtitle="Lineamientos audiovisuales para video"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <VideoTemplatesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
