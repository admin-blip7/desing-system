"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, FileText, Film, FolderOpen, Filter, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AssetCard = ({ type, name, size }: { type: "image" | "file" | "video", name: string, size: string }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group cursor-pointer hover:border-zinc-700 transition-colors">
        <div className="aspect-square bg-zinc-950 relative flex items-center justify-center">
            {type === 'image' && <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><ImageIcon size={32} className="text-zinc-600" /></div>}
            {type === 'file' && <FileText size={32} className="text-zinc-600" />}
            {type === 'video' && <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Film size={32} className="text-zinc-600" /></div>}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-white bg-black/50 hover:bg-black/80 rounded-full">
                    <MoreVertical size={12} />
                </Button>
            </div>
        </div>
        <div className="p-3">
            <h4 className="text-white text-sm font-medium truncate mb-1">{name}</h4>
            <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>{size}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 flex items-center gap-1">
                    <Download size={10} /> Descargar
                </span>
            </div>
        </div>
    </div>
);

const AssetGrid = () => (
    <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Filter size={14} className="mr-2" /> Todos
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900">
                    Imágenes
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900">
                    Documentos
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900">
                    Videos
                </Button>
            </div>
            <div className="w-full md:w-64">
                <Input placeholder="Buscar archivos..." className="bg-zinc-900 border-zinc-800 h-8 text-xs text-white placeholder:text-zinc-600" />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-amber-500/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black mb-2">
                    <FolderOpen size={18} />
                </div>
                <span className="text-amber-500 text-sm font-medium">Subir Asset</span>
            </div>

            <AssetCard type="image" name="Logo_Principal_RGB.png" size="2.4 MB" />
            <AssetCard type="image" name="Hero_Banner_Q1.jpg" size="4.1 MB" />
            <AssetCard type="file" name="Brand_Manual_V2.pdf" size="12.5 MB" />
            <AssetCard type="video" name="Intro_Animation.mp4" size="156 MB" />
            <AssetCard type="image" name="Icon_Set_V3.svg" size="128 KB" />
            <AssetCard type="file" name="Letterhead_Template.docx" size="450 KB" />
            <AssetCard type="image" name="Social_Post_04.png" size="1.2 MB" />
            <AssetCard type="file" name="Presentation_Deck.pptx" size="8.3 MB" />
        </div>
    </div>
);

export default function AssetLibraryWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="assetLibrary"
            moduleName="Asset Library"
            moduleSubtitle="Gestor centralizado de recursos de marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="all" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <FolderOpen size={14} className="mr-2" /> Explorador
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="all" className="m-0 min-h-full">
                                            <AssetGrid />
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
