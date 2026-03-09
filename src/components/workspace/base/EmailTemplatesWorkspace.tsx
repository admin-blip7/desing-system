"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Layout, Smartphone, MousePointerClick, AlignLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmailBuilder = () => {
    return (
        <div className="flex h-full">
            {/* Sidebar Blocks */}
            <div className="w-64 border-r border-zinc-800 p-4 space-y-4 bg-zinc-950/50">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Bloques</h4>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { icon: Layout, label: "Hero" },
                        { icon: AlignLeft, label: "Texto" },
                        { icon: ImageIcon, label: "Imagen" },
                        { icon: MousePointerClick, label: "Botón" },
                        { icon: Layout, label: "Columnas" },
                        { icon: Mail, label: "Footer" },
                    ].map((block, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-zinc-800 transition-colors">
                            <block.icon size={20} className="text-zinc-400" />
                            <span className="text-xs text-zinc-500">{block.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-zinc-900/50 p-8 flex justify-center overflow-y-auto">
                <div className="w-[600px] min-h-[800px] bg-white text-black shadow-xl rounded-lg overflow-hidden flex flex-col">
                    {/* Header Placeholder */}
                    <div className="h-20 bg-zinc-100 flex items-center justify-center border-b border-zinc-200">
                        <span className="text-zinc-400 text-sm dashed-border px-4 py-2 border border-zinc-300 border-dashed rounded">Logo Header</span>
                    </div>

                    {/* Hero Placeholder */}
                    <div className="h-64 bg-zinc-200 flex items-center justify-center relative group">
                        <span className="text-zinc-500">Hero Image Area</span>
                        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Content Placeholder */}
                    <div className="p-8 space-y-4">
                        <h1 className="text-2xl font-bold text-zinc-800">Hola, [Nombre]</h1>
                        <p className="text-zinc-600 leading-relaxed">
                            Este es un ejemplo de cómo se visualiza el contenido del correo.
                            La tipografía y colores se heredan automáticamente de tus Design Tokens.
                        </p>
                        <div className="py-4 flex justify-center">
                            <button className="bg-black text-white px-6 py-3 rounded font-medium">
                                Call to Action
                            </button>
                        </div>
                    </div>

                    {/* Footer Placeholder */}
                    <div className="mt-auto bg-zinc-100 p-6 text-center text-xs text-zinc-500 space-y-2">
                        <p>Empresa S.A. de C.V.</p>
                        <p>Darse de baja | Ver en navegador</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MobilePreview = () => (
    <div className="h-full flex items-center justify-center bg-zinc-900/50 p-8">
        <div className="mockup-phone border-zinc-800 bg-black rounded-[3rem] p-3 border-[8px] h-[700px] w-[350px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
            <div className="h-full w-full bg-white rounded-[2rem] overflow-y-auto no-scrollbar">
                {/* Email Content Mobile */}
                <div className="flex flex-col h-full">
                    <div className="h-16 bg-zinc-100 flex items-center justify-center border-b border-zinc-200 flex-shrink-0">
                        <span className="text-xs font-bold text-zinc-800">LOGO</span>
                    </div>
                    <div className="aspect-square bg-zinc-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-zinc-500">Image</span>
                    </div>
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-zinc-900">Versión Móvil</h2>
                        <p className="text-sm text-zinc-600">
                            El diseño se adapta automáticamente a pantallas pequeñas, apilando columnas y ajustando tamaños de fuente.
                        </p>
                        <button className="w-full bg-black text-white py-3 rounded font-medium text-sm">
                            Botón Full Width
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function EmailTemplatesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="emailNewsletters"
            moduleName="Email Templates"
            moduleSubtitle="Diseño y construcción de correos electrónicos"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="builder" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="builder" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Layout size={14} className="mr-2" /> Constructor Visual
                                    </TabsTrigger>
                                    <TabsTrigger value="mobile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Smartphone size={14} className="mr-2" /> Vista Móvil
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <TabsContent value="builder" className="m-0 h-full">
                                        <EmailBuilder />
                                    </TabsContent>

                                    <TabsContent value="mobile" className="m-0 h-full">
                                        <MobilePreview />
                                    </TabsContent>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                )
            }}
        </BaseWorkspace>
    );
}
