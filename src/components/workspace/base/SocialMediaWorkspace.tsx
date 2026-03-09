"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Instagram, Linkedin, Twitter, LayoutGrid, Image as ImageIcon, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialTemplate {
    id: string;
    name: string;
    platform: "instagram" | "linkedin" | "twitter";
    type: "story" | "post" | "cover";
    dimensions: string;
    previewUrl?: string; // Placeholder for now
}

const templates: SocialTemplate[] = [
    { id: "insta-post", name: "Instagram Square", platform: "instagram", type: "post", dimensions: "1080x1080" },
    { id: "insta-story", name: "Instagram Story", platform: "instagram", type: "story", dimensions: "1080x1920" },
    { id: "linkedin-post", name: "LinkedIn Post", platform: "linkedin", type: "post", dimensions: "1200x627" },
    { id: "twitter-header", name: "Twitter Header", platform: "twitter", type: "cover", dimensions: "1500x500" },
];

const TemplateGallery = () => {
    return (
        <div className="p-6 space-y-8">
            <h3 className="text-lg font-medium text-white">Plantillas Oficiales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                        <div className="aspect-video bg-zinc-950 relative flex items-center justify-center text-zinc-700">
                            <LayoutGrid size={48} opacity={0.2} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                <Button size="sm" variant="secondary" className="gap-2">
                                    <Download size={14} /> Descargar
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-white font-medium">{template.name}</h4>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-zinc-500">{template.dimensions} px</span>
                                <span className="text-xs text-amber-500 uppercase px-2 py-0.5 bg-amber-950/30 rounded-full border border-amber-900/50">
                                    {template.platform}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeedPreview = () => {
    return (
        <div className="p-6 space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Preview de Feed (Instagram)</h3>
                <Button variant="outline" size="sm">
                    <Share2 size={14} className="mr-2" /> Conectar cuenta
                </Button>
            </div>

            <div className="border border-zinc-800 rounded-xl bg-black p-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-800"></div>
                    <div>
                        <div className="h-4 w-32 bg-zinc-800 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-zinc-900 rounded"></div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="aspect-square bg-zinc-900 relative group cursor-pointer hover:opacity-90">
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-bold text-2xl">
                                {i}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function SocialMediaWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="socialMediaKit"
            moduleName="Social Media Kit"
            moduleSubtitle="Plantillas y recursos para redes sociales"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="templates" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="templates" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <LayoutGrid size={14} className="mr-2" /> Plantillas
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Instagram size={14} className="mr-2" /> Feed Preview
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="templates" className="m-0 min-h-full">
                                            <TemplateGallery />
                                        </TabsContent>

                                        <TabsContent value="preview" className="m-0">
                                            <FeedPreview />
                                        </TabsContent>
                                    </ScrollArea>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                )
            }}
        </BaseWorkspace>
    );
}
