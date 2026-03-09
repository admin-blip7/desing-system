"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface ProductPageData {
    productName: string;
    productTagline: string;
    price: string;
    description: string;
    features: string[];
    specifications: Record<string, string>;
}

const defaultProductPageData: ProductPageData = {
    productName: "Nombre del Producto",
    productTagline: "Tagline o eslogan",
    price: "$0.00",
    description: "Descripción del producto...",
    features: ["Característica 1", "Característica 2", "Característica 3"],
    specifications: { "Material": "", "Dimensiones": "", "Peso": "" }
};

function ProductPageWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [productData, setProductData] = useState<ProductPageData>(
        data?.content?.productData || defaultProductPageData
    );
    const [hasChanges, setHasChanges] = useState(false);

    const updateField = useCallback((field: keyof ProductPageData, value: any) => {
        setProductData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, productData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setProductData(data?.content?.productData || defaultProductPageData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Package size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Página de Producto</h2>
                                    <p className="text-zinc-400">Ficha de producto con galería, specs y CTAs.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                        <p className="text-3xl mb-2">🛍️</p>
                                        <h3 className="text-white font-medium">Galería</h3>
                                        <p className="text-sm text-zinc-500 mt-2">Imágenes y videos del producto</p>
                                    </div>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                        <p className="text-3xl mb-2">📋</p>
                                        <h3 className="text-white font-medium">Especificaciones</h3>
                                        <p className="text-sm text-zinc-500 mt-2">Detalles técnicos</p>
                                    </div>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                        <p className="text-3xl mb-2">🎯</p>
                                        <h3 className="text-white font-medium">CTAs</h3>
                                        <p className="text-sm text-zinc-500 mt-2">Botones de acción</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Información del Producto</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Nombre</Label>
                                            <Input value={productData.productName} onChange={e => updateField("productName", e.target.value)} className="bg-zinc-950" />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Tagline</Label>
                                            <Input value={productData.productTagline} onChange={e => updateField("productTagline", e.target.value)} className="bg-zinc-950" />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Precio</Label>
                                            <Input value={productData.price} onChange={e => updateField("price", e.target.value)} className="bg-zinc-950" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Descripción</Label>
                                        <Textarea value={productData.description} onChange={e => updateField("description", e.target.value)} className="min-h-[100px] bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                                        <div>
                                            <h1 className="text-3xl font-bold text-zinc-900">{productData.productName}</h1>
                                            <p className="text-lg text-zinc-600 mb-4">{productData.productTagline}</p>
                                            <p className="text-zinc-700 mb-6">{productData.description}</p>
                                            <div className="text-3xl font-bold text-blue-600">{productData.price}</div>
                                        </div>
                                        <div className="bg-zinc-100 rounded-xl p-6">
                                            <h3 className="font-semibold text-zinc-900 mb-4">Características</h3>
                                            <ul className="space-y-2">
                                                {productData.features.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-zinc-700">
                                                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                                        {f}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto">
                                                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                                                    navigator.clipboard.writeText(JSON.stringify(productData, null, 2));
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

export default function ProductPageWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="productPage"
            moduleName="Página de Producto"
            moduleSubtitle="Ficha de producto y arquitectura de detalle"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <ProductPageWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
