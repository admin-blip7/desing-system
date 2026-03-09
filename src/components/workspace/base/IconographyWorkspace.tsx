"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid, CheckCircle, Ban, Upload, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { useLogoUpload } from "@/lib/hooks/useLogoUpload"; // We can reuse this hook for generic uploads

interface IconItem {
    id: string;
    url: string;
    name: string;
    category: string;
}

const IconGallery = ({
    icons,
    onAdd,
    onDelete,
    brandId
}: {
    icons: IconItem[],
    onAdd: (icon: IconItem) => void,
    onDelete: (id: string) => void,
    brandId: string
}) => {
    const { uploadLogo, isUploading } = useLogoUpload(brandId); // Reuse upload logic

    const handleUpload = async (file: File) => {
        const url = await uploadLogo(file, `icons/${Date.now()}`);
        if (url) {
            onAdd({
                id: Date.now().toString(),
                url,
                name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                category: "General"
            });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Biblioteca de Iconos</h3>
                <div className="w-64">
                    <FileUploader
                        onFileSelect={handleUpload}
                        isLoading={isUploading}
                        label="Subir Icono (SVG/PNG)"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {icons.map((icon) => (
                    <div key={icon.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center gap-4 transition-colors hover:border-zinc-700">
                        <div className="flex-1 w-full aspect-square flex items-center justify-center bg-zinc-950/50 rounded p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={icon.url} alt={icon.name} className="max-w-full max-h-full object-contain filter invert" />
                            {/* Filter invert assuming icons are black/dark by default. If colored, remove filter. */}
                        </div>
                        <div className="w-full text-center">
                            <p className="text-sm font-medium text-zinc-300 truncate w-full" title={icon.name}>{icon.name}</p>
                            <p className="text-xs text-zinc-600 truncate">{icon.category}</p>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => onDelete(icon.id)}>
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    </div>
                ))}

                {icons.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        No hay iconos subidos todavía.
                    </div>
                )}
            </div>
        </div>
    );
};

// Reuse usage gallery logic? Or simplify.
const UsageGuidelines = () => (
    <div className="p-6 max-w-4xl">
        <h3 className="text-lg font-medium text-white mb-6">Guía de Uso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h4 className="text-green-500 flex items-center gap-2 text-sm font-medium"><CheckCircle size={16} /> Correcto</h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                    <li>Usar iconos con trazos consistentes (e.g. 2px).</li>
                    <li>Mantener la legibilidad en tamaños pequeños (mínimo 16px).</li>
                    <li>Usar el color primario o neutro para iconos de interfaz.</li>
                </ul>
            </div>
            <div className="space-y-4">
                <h4 className="text-red-500 flex items-center gap-2 text-sm font-medium"><Ban size={16} /> Incorrecto</h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                    <li>No distorsionar las proporciones.</li>
                    <li>No aplicar sombras o efectos 3D innecesarios.</li>
                    <li>No usar iconos rellenos y de línea mezclados en el mismo contexto.</li>
                </ul>
            </div>
        </div>
    </div>
);

interface IconographyWorkspaceContentProps {
    data: any;
    saveModule: (data: any) => void;
    brandId: string;
}

const IconographyWorkspaceContent = ({ data, saveModule, brandId }: IconographyWorkspaceContentProps) => {
    const [icons, setIcons] = useState<IconItem[]>(data?.content?.icons || []);

    const handleAddIcon = (newIcon: IconItem) => {
        const updated = [...icons, newIcon];
        setIcons(updated);
        saveModule({ ...data, content: { ...data?.content, icons: updated } });
    };

    const handleDeleteIcon = (id: string) => {
        const updated = icons.filter(i => i.id !== id);
        setIcons(updated);
        saveModule({ ...data, content: { ...data?.content, icons: updated } });
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="gallery" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Grid size={14} className="mr-2" /> Biblioteca
                        </TabsTrigger>
                        <TabsTrigger value="guidelines" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <CheckCircle size={14} className="mr-2" /> Reglas de Uso
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="gallery" className="m-0 min-h-full">
                                <IconGallery
                                    icons={icons}
                                    onAdd={handleAddIcon}
                                    onDelete={handleDeleteIcon}
                                    brandId={brandId}
                                />
                            </TabsContent>

                            <TabsContent value="guidelines" className="m-0">
                                <UsageGuidelines />
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function IconographyWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="iconography"
            moduleName="Iconografía"
            moduleSubtitle="Gestiona el set de iconos y sus reglas de uso"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => (
                <IconographyWorkspaceContent data={data} saveModule={saveModule} brandId={brandId} />
            )}
        </BaseWorkspace>
    );
}
