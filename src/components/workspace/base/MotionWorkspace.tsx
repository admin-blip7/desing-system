"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Activity, Clock, Trash2, Upload, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { useLogoUpload } from "@/lib/hooks/useLogoUpload";

interface MotionAsset {
    id: string;
    url: string;
    name: string;
    type: "video" | "gif";
}

const MotionGallery = ({
    assets,
    onAdd,
    onDelete,
    brandId
}: {
    assets: MotionAsset[],
    onAdd: (asset: MotionAsset) => void,
    onDelete: (id: string) => void,
    brandId: string
}) => {
    const { uploadLogo, isUploading } = useLogoUpload(brandId);

    const handleUpload = async (file: File) => {
        // In a real app, this would handle video specifically
        const url = await uploadLogo(file, `motion/${Date.now()}`);
        if (url) {
            onAdd({
                id: Date.now().toString(),
                url,
                name: file.name.replace(/\.[^/.]+$/, ""),
                type: file.type.includes("video") ? "video" : "gif"
            });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Galería de Motion</h3>
                <div className="w-64">
                    <FileUploader
                        onFileSelect={handleUpload}
                        isLoading={isUploading}
                        label="Subir GIF/Video"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div key={asset.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="aspect-video bg-zinc-950 relative flex items-center justify-center">
                            {asset.type === 'video' ? (
                                <video src={asset.url} controls className="w-full h-full object-cover" />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <p className="text-sm font-medium text-white truncate" title={asset.name}>{asset.name}</p>
                            <span className="text-xs text-zinc-500 uppercase px-2 py-0.5 bg-zinc-800 rounded">{asset.type}</span>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="destructive" size="icon" className="h-8 w-8 bg-black/50 hover:bg-red-500 backdrop-blur-sm" onClick={() => onDelete(asset.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
                {assets.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        No hay assets de movimiento subidos todavía.
                    </div>
                )}
            </div>
        </div>
    );
};

const EasingEditor = () => {
    // Visualization of common easing functions
    const easings = [
        { name: "Linear", bezier: "linear", description: "Velocidad constante. Para spiners y cargas." },
        { name: "Ease Out", bezier: "ease-out", description: "Entrada rápida, salida lenta. Para UI entrante." },
        { name: "Ease In", bezier: "ease-in", description: "Entrada lenta, salida rápida. Para UI saliente." },
        { name: "Ease In Out", bezier: "ease-in-out", description: "Suave al inicio y final. Para transiciones de estado." },
        { name: "Spring", bezier: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", description: "Efecto rebote visual." },
    ];

    return (
        <div className="p-6 space-y-8 max-w-4xl">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Activity size={20} className="text-amber-500" />
                Curvas de Animación
            </h3>

            <div className="grid grid-cols-1 gap-6">
                {easings.map((ease, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center gap-8">
                        <div className="w-32">
                            <h4 className="font-medium text-white">{ease.name}</h4>
                            <p className="text-xs text-zinc-500 mt-1 font-mono">{ease.bezier}</p>
                        </div>

                        <div className="flex-1 bg-zinc-950 h-12 rounded relative overflow-hidden">
                            <div
                                className="absolute top-1 bottom-1 w-10 bg-amber-500 rounded"
                                style={{
                                    animation: `moveRight 2s ${ease.bezier} infinite alternate`,
                                    left: '0%'
                                }}
                            />
                            <style jsx>{`
                                @keyframes moveRight {
                                    from { left: 0%; }
                                    to { left: calc(100% - 40px); }
                                }
                             `}</style>
                        </div>

                        <div className="w-48 text-sm text-zinc-400">
                            {ease.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TimingTokens = () => (
    <div className="p-6 space-y-8 max-w-4xl">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Clock size={20} className="text-amber-500" />
            Tokens de Duración
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { name: "Instant", value: "100ms", usage: "Hover, feedback" },
                { name: "Fast", value: "200ms", usage: "Tooltips, toggles" },
                { name: "Normal", value: "300ms", usage: "Modales, dropdowns" },
                { name: "Slow", value: "500ms", usage: "Transiciones de página" },
            ].map((token) => (
                <div key={token.name} className="bg-zinc-900 border border-zinc-800 rounded p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{token.name}</span>
                        <span className="text-amber-500 text-sm font-mono">{token.value}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                        <div
                            className="h-full bg-zinc-600"
                            style={{
                                animation: `fillWidth ${token.value} ease-in-out infinite alternate`
                            }}
                        />
                        <style jsx>{`
                            @keyframes fillWidth {
                                from { width: 0%; }
                                to { width: 100%; }
                            }
                         `}</style>
                    </div>
                    <p className="text-xs text-zinc-500">{token.usage}</p>
                </div>
            ))}
        </div>
    </div>
);

interface MotionContentProps {
    data: any;
    saveModule: (data: any) => void;
    brandId: string;
}

const MotionContent = ({ data, saveModule, brandId }: MotionContentProps) => {
    const [assets, setAssets] = useState<MotionAsset[]>(data?.content?.assets || []);

    const handleAdd = (asset: MotionAsset) => {
        const updated = [...assets, asset];
        setAssets(updated);
        saveModule({ ...data, content: { ...data?.content, assets: updated } });
    };

    const handleDelete = (id: string) => {
        const updated = assets.filter(i => i.id !== id);
        setAssets(updated);
        saveModule({ ...data, content: { ...data?.content, assets: updated } });
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="gallery" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Film size={14} className="mr-2" /> Galería
                        </TabsTrigger>
                        <TabsTrigger value="easing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Activity size={14} className="mr-2" /> Curvas (Easing)
                        </TabsTrigger>
                        <TabsTrigger value="timing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Clock size={14} className="mr-2" /> Tiempos
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="gallery" className="m-0 min-h-full">
                                <MotionGallery
                                    assets={assets}
                                    onAdd={handleAdd}
                                    onDelete={handleDelete}
                                    brandId={brandId}
                                />
                            </TabsContent>

                            <TabsContent value="easing" className="m-0">
                                <EasingEditor />
                            </TabsContent>

                            <TabsContent value="timing" className="m-0">
                                <TimingTokens />
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function MotionWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="motion"
            moduleName="Motion Branding"
            moduleSubtitle="Define el comportamiento dinámico de tu marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => (
                <MotionContent data={data} saveModule={saveModule} brandId={brandId} />
            )}
        </BaseWorkspace>
    );
}
