"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { useAIGeneration } from "@/components/workspace/shared/withAIGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Image as ImageIcon, Palette, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { useLogoUpload } from "@/lib/hooks/useLogoUpload";

interface IllustrationItem {
    id: string;
    url: string;
    name: string;
    style: string;
}

const IllustrationGallery = ({
    items,
    onAdd,
    onDelete,
    brandId
}: {
    items: IllustrationItem[],
    onAdd: (item: IllustrationItem) => void,
    onDelete: (id: string) => void,
    brandId: string
}) => {
    const { uploadLogo, isUploading } = useLogoUpload(brandId);

    const handleUpload = async (file: File) => {
        const url = await uploadLogo(file, `illustrations/${Date.now()}`);
        if (url) {
            onAdd({
                id: Date.now().toString(),
                url,
                name: file.name.replace(/\.[^/.]+$/, ""),
                style: "Vector / Flat"
            });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Galería de Ilustraciones</h3>
                <div className="w-64">
                    <FileUploader
                        onFileSelect={handleUpload}
                        isLoading={isUploading}
                        label="Subir Ilustración"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-4">
                        <div className="aspect-square bg-zinc-950/50 rounded flex items-center justify-center p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="w-full">
                            <p className="text-sm font-medium text-zinc-300 truncate" title={item.name}>{item.name}</p>
                            <p className="text-xs text-zinc-600 truncate">{item.style}</p>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => onDelete(item.id)}>
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        No hay ilustraciones subidas todavía.
                    </div>
                )}
            </div>
        </div>
    );
};

const IllustrationStyle = () => (
    <div className="p-6 max-w-4xl space-y-8">
        <section className="space-y-4">
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
                <Palette size={20} className="text-amber-500" />
                Características del Estilo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded p-6 space-y-2">
                    <h4 className="text-white font-medium">Flat Design</h4>
                    <p className="text-sm text-zinc-400">Utilizamos formas geométricas simples y colores planos sin degradados complejos.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-6 space-y-2">
                    <h4 className="text-white font-medium">Línea y Contorno</h4>
                    <p className="text-sm text-zinc-400">Si se usan líneas, deben ser de grosor constante y  con bordes redondeados.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-6 space-y-2">
                    <h4 className="text-white font-medium">Paleta Limitada</h4>
                    <p className="text-sm text-zinc-400">Usar principalmente los colores de la marca, con acentos mínimos.</p>
                </div>
            </div>
        </section>
    </div>
);

interface WorkspaceContentProps {
    data: any;
    saveModule: (data: any) => void;
    brandId: string;
}

const WorkspaceContent = ({ data, saveModule, brandId }: WorkspaceContentProps) => {
    const [items, setItems] = useState<IllustrationItem[]>(data?.content?.items || []);

    const handleAdd = (item: IllustrationItem) => {
        const updated = [...items, item];
        setItems(updated);
        saveModule({ ...data, content: { ...data?.content, items: updated } });
    };

    const handleDelete = (id: string) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        saveModule({ ...data, content: { ...data?.content, items: updated } });
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            <Tabs defaultValue="gallery" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <ImageIcon size={14} className="mr-2" /> Galería
                        </TabsTrigger>
                        <TabsTrigger value="style" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <PenTool size={14} className="mr-2" /> Estilo
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="gallery" className="m-0 min-h-full">
                                <IllustrationGallery
                                    items={items}
                                    onAdd={handleAdd}
                                    onDelete={handleDelete}
                                    brandId={brandId}
                                />
                            </TabsContent>

                            <TabsContent value="style" className="m-0">
                                <IllustrationStyle />
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function IllustrationWorkspace({ brandId }: { brandId: string }) {
    const { headerActions, aiPanel } = useAIGeneration(
        brandId,
        "illustration",
        (data) => {
            console.log("Illustration data generated:", data);
            // TODO: Process generated data
        }
    );

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="illustration"
            moduleName="Ilustración"
            moduleSubtitle="Estilo y biblioteca de recursos gráficos"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={headerActions}
        >
            {({ data, saveModule }) => (
                <>
                    {aiPanel}
                    <WorkspaceContent data={data} saveModule={saveModule} brandId={brandId} />
                </>
            )}
        </BaseWorkspace>
    );
}
