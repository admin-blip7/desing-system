"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Sticker, Box, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const PackagingPreview = ({ type }: { type: "mailer-box" | "shipping-box" | "pouch" | "bag" }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
            <div className="aspect-video bg-zinc-950 relative flex items-center justify-center p-8">
                {/* Mailer Box */}
                {type === 'mailer-box' && (
                    <div className="w-64 h-48 relative">
                        {/* Box Body */}
                        <div className="absolute bottom-0 w-full h-24 bg-zinc-800 border bg-gradient-to-r from-zinc-800 to-zinc-700 border-zinc-600 skew-x-12 origin-bottom-left shadow-xl" />
                        {/* Lid */}
                        <div className="absolute top-8 left-6 w-full h-24 bg-zinc-700 border bg-gradient-to-r from-zinc-700 to-zinc-600 border-zinc-500 skew-x-12 origin-bottom-left -rotate-12 transform-gpu shadow-lg flex items-center justify-center">
                            <div className="font-bold text-white text-2xl -skew-x-12 rotate-12 bg-black px-4 py-2">LOGO</div>
                        </div>
                    </div>
                )}

                {/* Shipping Box */}
                {type === 'shipping-box' && (
                    <div className="w-48 h-48 bg-[#C8AD7F] relative border border-[#A68A5C] shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
                        {/* Tape */}
                        <div className="absolute top-0 w-12 h-full bg-[#E5D5B5]/50 border-x border-[#A68A5C]/30 flex items-center justify-center">
                            <div className="w-8 h-full border-l border-r border-dashed border-black/10"></div>
                        </div>
                        {/* Side Label */}
                        <div className="absolute right-4 bottom-4 w-12 h-12 border-2 border-black flex items-center justify-center rotate-45">
                            <Box size={20} className="text-black" />
                        </div>
                    </div>
                )}

                {/* Pouch */}
                {type === 'pouch' && (
                    <div className="w-40 h-56 bg-zinc-200 rounded-lg relative shadow-xl overflow-hidden flex flex-col items-center pt-8 border border-zinc-300 bg-gradient-to-br from-white to-zinc-300">
                        <div className="w-full h-6 border-b border-zinc-300 absolute top-4 bg-zinc-100/50"></div>
                        <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs ring-4 ring-amber-400">LOGO</div>
                        <div className="mt-8 text-center px-4">
                            <div className="h-2 w-20 bg-zinc-400 rounded mb-2 mx-auto"></div>
                            <div className="h-1 w-24 bg-zinc-300 rounded mb-1"></div>
                            <div className="h-1 w-16 bg-zinc-300 rounded"></div>
                        </div>
                    </div>
                )}

                {/* Bag */}
                {type === 'bag' && (
                    <div className="w-48 h-56 bg-black rounded-sm relative shadow-xl flex items-center justify-center border-t-8 border-amber-500">
                        {/* Handles omitted specifically for simplicity or added via CSS */}
                        <div className="absolute -top-16 left-12 w-2 border-l-2 border-t-2 border-r-2 border-zinc-800 h-16 rounded-t-full"></div>
                        <div className="absolute -top-16 right-12 w-2 border-l-2 border-t-2 border-r-2 border-zinc-800 h-16 rounded-t-full"></div>

                        <div className="font-bold text-white text-3xl tracking-widest">LOGO</div>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">Editar Diseño</Button>
                </div>
            </div>
            <div className="p-4">
                <h4 className="text-white font-medium capitalize">{type.replace('-', ' ')}</h4>
                <p className="text-xs text-zinc-500">
                    {type === 'mailer-box' && "Caja de envío premium con impresión interior/exterior."}
                    {type === 'shipping-box' && "Caja corrugada estándar para logística."}
                    {type === 'pouch' && "Bolsa tipo Doypack para productos granel o pequeños."}
                    {type === 'bag' && "Bolsa de boutique (Papel couche o Kraft)."}
                </p>
            </div>
        </div>
    );
};

const LabelEditor = () => (
    <div className="p-6 max-w-4xl space-y-8">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Sticker size={20} className="text-amber-500" />
            Etiquetas y Stickers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                    LOGO
                </div>
                <div className="text-center">
                    <h4 className="text-white font-medium">Sticker Redondo</h4>
                    <p className="text-xs text-zinc-500">Para cerrar papel de seda o cajas.</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4">
                <div className="w-48 h-24 bg-white flex items-center justify-between px-4 shadow-lg transform hover:scale-105 transition-transform cursor-pointer border border-zinc-200">
                    <span className="font-bold text-black">LOGO</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500">P.V.P.</span>
                        <span className="font-bold text-black text-lg">$####</span>
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="text-white font-medium">Etiqueta de Precio</h4>
                    <p className="text-xs text-zinc-500">Para productos en tienda.</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4">
                <div className="w-40 h-24 bg-black border border-zinc-800 flex flex-col items-center justify-center gap-2 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-white font-medium text-sm">Gracias por tu compra</span>
                    <div className="w-24 h-8 bg-white/20 rounded"></div>
                </div>
                <div className="text-center">
                    <h4 className="text-white font-medium">Tarjeta de Agradecimiento</h4>
                    <p className="text-xs text-zinc-500">Incluida dentro del paquete.</p>
                </div>
            </div>
        </div>
    </div>
);

export default function PackagingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="packaging"
            moduleName="Packaging"
            moduleSubtitle="Diseño de empaques y experiencia unboxing"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="models" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="models" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Box size={14} className="mr-2" /> Modelos 3D
                                    </TabsTrigger>
                                    <TabsTrigger value="labels" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Ticket size={14} className="mr-2" /> Etiquetas
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="models" className="m-0 min-h-full">
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <PackagingPreview type="mailer-box" />
                                                <PackagingPreview type="pouch" />
                                                <PackagingPreview type="bag" />
                                                <PackagingPreview type="shipping-box" />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="labels" className="m-0">
                                            <LabelEditor />
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
