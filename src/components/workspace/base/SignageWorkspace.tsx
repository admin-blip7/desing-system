"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Signpost, Store, Info, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignageItem = ({ type }: { type: "facade" | "totem" | "indoor" | "wayfinding" }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="aspect-video bg-zinc-950 relative flex items-center justify-center">
                {/* Facade Mockup */}
                {type === 'facade' && (
                    <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
                        {/* Building */}
                        <div className="w-3/4 h-3/4 border-2 border-zinc-700 border-b-0 relative bg-zinc-800">
                            <div className="w-full h-12 bg-zinc-900 absolute top-0 flex items-center justify-center border-b border-zinc-700">
                                <div className="text-white font-bold text-xl tracking-widest px-4 border border-white/20 py-1 bg-black/50 backdrop-blur-sm">LOGO STORE</div>
                            </div>
                            <div className="w-16 h-24 border border-zinc-700 bottom-0 left-1/2 -translate-x-1/2 absolute bg-zinc-900"></div>
                            <div className="w-16 h-16 border border-zinc-600 top-20 left-12 absolute bg-blue-500/10"></div>
                            <div className="w-16 h-16 border border-zinc-600 top-20 right-12 absolute bg-blue-500/10"></div>
                        </div>
                    </div>
                )}

                {/* Totem Mockup */}
                {type === 'totem' && (
                    <div className="w-full h-full relative flex items-center justify-center">
                        <div className="w-24 h-48 bg-zinc-800 rounded-lg shadow-2xl flex flex-col items-center pt-8 relative">
                            <div className="w-16 h-16 bg-black rounded-full mb-4 flex items-center justify-center text-white font-bold text-xs ring-4 ring-zinc-700">LOGO</div>
                            <div className="space-y-2 w-full px-6">
                                <div className="h-1 w-full bg-zinc-600 rounded"></div>
                                <div className="h-1 w-2/3 bg-zinc-600 rounded"></div>
                            </div>
                            <div className="absolute bottom-0 w-32 h-2 bg-zinc-900 rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Indoor Sign */}
                {type === 'indoor' && (
                    <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
                        <div className="w-full h-4 absolute top-1/3 bg-zinc-800 flex items-center justify-center gap-12 px-12">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <div className="w-4 h-4 bg-zinc-700 rounded-sm"></div>
                                <span>Baños</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                                <span>Cajas</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <div className="w-4 h-4 bg-zinc-700 rounded-sm"></div>
                                <span>Salida</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">Ver Detalle</Button>
                </div>
            </div>
            <div className="p-4">
                <h4 className="text-white font-medium capitalize">{type} Signage</h4>
                <p className="text-xs text-zinc-500">
                    {type === 'facade' && "Letrero principal de fachada. Materiales resistentes a intemperie."}
                    {type === 'totem' && "Señalización vertical para visibilidad a distancia."}
                    {type === 'indoor' && "Señalética direccional y de identificación de áreas."}
                </p>
            </div>
        </div>
    );
};

const MaterialGuide = () => (
    <div className="p-6 max-w-4xl space-y-8">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Construction size={20} className="text-amber-500" />
            Guía de Materiales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
                <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold">
                    Al
                </div>
                <h4 className="text-white font-medium">Aluminio Cepillado</h4>
                <p className="text-sm text-zinc-500">Para placas corporativas y señalética de alto nivel. Acabado elegante y duradero.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
                <div className="w-12 h-12 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                    Ac
                </div>
                <h4 className="text-white font-medium">Acrílico</h4>
                <p className="text-sm text-zinc-500">Para letras 3D, cajas de luz y directorios. Permite retroiluminación.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
                <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-white font-bold">
                    Vin
                </div>
                <h4 className="text-white font-medium">Vinil de Corte</h4>
                <p className="text-sm text-zinc-500">Para cristales, vehículos y gráficos temporales. Económico y versátil.</p>
            </div>
        </div>
    </div>
);

export default function SignageWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="signage"
            moduleName="Signage"
            moduleSubtitle="Sistema de señalización y wayfinding"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="preview" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Signpost size={14} className="mr-2" /> Previsualización
                                    </TabsTrigger>
                                    <TabsTrigger value="materials" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Construction size={14} className="mr-2" /> Materiales
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="preview" className="m-0 min-h-full">
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <SignageItem type="facade" />
                                                <SignageItem type="totem" />
                                                <SignageItem type="indoor" />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="materials" className="m-0">
                                            <MaterialGuide />
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
