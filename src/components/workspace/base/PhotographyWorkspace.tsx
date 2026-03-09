"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { useAIGeneration } from "@/components/workspace/shared/withAIGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Camera, Sliders, CheckCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { useLogoUpload } from "@/lib/hooks/useLogoUpload";

interface PhotoItem {
    id: string;
    url: string;
    name: string;
    tags: string[];
}

const PhotoGallery = ({
    photos,
    onAdd,
    onDelete,
    brandId
}: {
    photos: PhotoItem[],
    onAdd: (photo: PhotoItem) => void,
    onDelete: (id: string) => void,
    brandId: string
}) => {
    const { uploadLogo, isUploading } = useLogoUpload(brandId); // Reuse upload logic

    const handleUpload = async (file: File) => {
        const url = await uploadLogo(file, `photos/${Date.now()}`);
        if (url) {
            onAdd({
                id: Date.now().toString(),
                url,
                name: file.name.replace(/\.[^/.]+$/, ""),
                tags: []
            });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Banco de Imágenes</h3>
                <div className="w-64">
                    <FileUploader
                        onFileSelect={handleUpload}
                        isLoading={isUploading}
                        label="Subir Imagen"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                    <div key={photo.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="aspect-video bg-zinc-950 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <p className="text-sm font-medium text-white truncate" title={photo.name}>{photo.name}</p>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="destructive" size="icon" className="h-8 w-8 bg-black/50 hover:bg-red-500 backdrop-blur-sm" onClick={() => onDelete(photo.id)}>
                                <X size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {photos.length === 0 && (
                <div className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    No hay imágenes subidas todavía.
                </div>
            )}
        </div>
    );
};

const StyleGuide = () => (
    <div className="p-6 max-w-4xl space-y-12">
        <section className="space-y-6">
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
                <Camera size={20} className="text-amber-500" />
                Dirección de Arte
            </h3>
            <div className="prose prose-invert prose-sm text-zinc-400">
                <p>
                    Nuestra fotografía debe capturar momentos auténticos y humanos. Evitamos las poses rígidas
                    y la iluminación artificial excesiva. Buscamos naturalidad, emoción y diversidad.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                    Ejemplo de iluminación natural
                </div>
                <div className="aspect-video bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                    Ejemplo de composición dinámica
                </div>
            </div>
        </section>

        <section className="space-y-6">
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
                <Sliders size={20} className="text-amber-500" />
                Tratamiento y Edición
            </h3>
            <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                <li>Saturación natural, sin colores excesivamente vibrantes.</li>
                <li>Contraste medio para preservar detalles en luces y sombras.</li>
                <li>Balance de blancos cálido para evocar cercanía.</li>
            </ul>
        </section>
    </div>
);

export default function PhotographyWorkspace({ brandId }: { brandId: string }) {
    const [activeTab, setActiveTab] = useState("gallery");
    const { headerActions, aiPanel } = useAIGeneration(
        brandId,
        "photography",
        (data) => {
            console.log("Photography data generated:", data);
            // TODO: Process generated data
        }
    );

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="photography"
            moduleName="Fotografía"
            moduleSubtitle="Dirección de arte y banco de imágenes"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={headerActions}
        >
            {({ data, saveModule }) => (
                <>
                    {aiPanel}
                    {(() => {
                const photos = data?.content?.photos || [];

                const handleAdd = (item: PhotoItem) => {
                    const updated = [...photos, item];
                    saveModule({ ...data, content: { ...data?.content, photos: updated } });
                };

                const handleDelete = (id: string) => {
                    const updated = photos.filter((i: PhotoItem) => i.id !== id);
                    saveModule({ ...data, content: { ...data?.content, photos: updated } });
                };

                return (
                    <div className="h-full flex flex-col">
                        <Tabs 
                            value={activeTab} 
                            onValueChange={setActiveTab}
                            defaultValue="gallery" 
                            className="h-full flex flex-col"
                        >
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <ImageIcon size={14} className="mr-2" /> Galería
                                    </TabsTrigger>
                                    <TabsTrigger value="style" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Camera size={14} className="mr-2" /> Estilo Visual
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="gallery" className="m-0 min-h-full">
                                            <PhotoGallery
                                                photos={photos}
                                                onAdd={handleAdd}
                                                onDelete={handleDelete}
                                                brandId={brandId}
                                            />
                                        </TabsContent>

                                        <TabsContent value="style" className="m-0">
                                            <StyleGuide />
                                        </TabsContent>
                                    </ScrollArea>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                )
                })()}
                </>
            )}
        </BaseWorkspace>
    );
}
