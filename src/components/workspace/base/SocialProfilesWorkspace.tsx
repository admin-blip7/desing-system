"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface SocialProfile {
    platform: string;
    handle: string;
    bio: string;
    link: string;
    avatar: string;
    cover: string;
}

interface SocialProfilesData {
    profiles: SocialProfile[];
}

const defaultSocialProfilesData: SocialProfilesData = {
    profiles: [
        { platform: "Instagram", handle: "@tuempresa", bio: "Tu bio aquí", link: "https://tuempresa.com", avatar: "", cover: "" },
        { platform: "Facebook", handle: "TuEmpresa", bio: "Tu bio aquí", link: "https://tuempresa.com", avatar: "", cover: "" },
        { platform: "LinkedIn", handle: "tu-empresa", bio: "Tu bio aquí", link: "https://tuempresa.com", avatar: "", cover: "" }
    ]
};

function SocialProfilesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [socialData, setSocialData] = useState<SocialProfilesData>(
        data?.content?.socialData || defaultSocialProfilesData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(0);

    const updateProfile = useCallback((field: keyof SocialProfile, value: string) => {
        setSocialData(prev => ({
            ...prev,
            profiles: prev.profiles.map((p, i) =>
                i === selectedPlatform ? { ...p, [field]: value } : p
            )
        }));
        setHasChanges(true);
    }, [selectedPlatform]);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, socialData } });
        if (success) setHasChanges(false);
    };

    const platforms = ["Instagram", "Facebook", "LinkedIn", "TikTok", "X/Twitter"];

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSocialData(data?.content?.socialData || defaultSocialProfilesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Share2 size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Perfiles de Redes</h2>
                                    <p className="text-zinc-400">Optimización visual y textual de perfiles sociales.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {platforms.map(p => (
                                        <div key={p} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <h3 className="text-white font-medium">{p}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex gap-2 mb-4">
                                    {platforms.slice(0, 5).map((p, i) => (
                                        <button
                                            key={p}
                                            onClick={() => setSelectedPlatform(i)}
                                            className={`px-4 py-2 rounded-lg ${selectedPlatform === i ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div>
                                        <Label className="text-sm text-zinc-400">Handle (@usuario)</Label>
                                        <Input value={socialData.profiles[selectedPlatform]?.handle} onChange={e => updateProfile("handle", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Bio</Label>
                                        <Textarea value={socialData.profiles[selectedPlatform]?.bio} onChange={e => updateProfile("bio", e.target.value)} className="min-h-[80px] bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Link</Label>
                                        <Input value={socialData.profiles[selectedPlatform]?.link} onChange={e => updateProfile("link", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {socialData.profiles.map(profile => (
                                        <div key={profile.platform} className="bg-zinc-900 rounded-xl overflow-hidden">
                                            <div className="h-24 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                                <span className="text-white text-2xl font-bold">{profile.platform.charAt(0)}</span>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-white font-bold mb-2">{profile.platform}</h3>
                                                <p className="text-zinc-400 text-sm mb-3">@{profile.handle.replace("@", "")}</p>
                                                <p className="text-zinc-300 text-sm">{profile.bio}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(socialData, null, 2));
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

export default function SocialProfilesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="socialProfiles"
            moduleName="Perfiles de Redes"
            moduleSubtitle="Optimización de perfiles sociales"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <SocialProfilesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
