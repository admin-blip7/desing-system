"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Printer, CreditCard, Mail, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";

const StationeryGallery = () => {
    return (
        <div className="p-6 space-y-8">
            <h3 className="text-lg font-medium text-white">Papelería Corporativa</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Business Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                    <div className="aspect-[1.58/1] bg-zinc-950 relative flex items-center justify-center p-8">
                        <div className="w-full h-full bg-white shadow-lg flex flex-col justify-between p-4 transform group-hover:scale-105 transition-transform duration-300">
                            <div className="font-bold text-lg text-black">LOGO</div>
                            <div className="text-[10px] text-zinc-600 space-y-1">
                                <p className="font-bold">Nombre Apellido</p>
                                <p>Cargo / Puesto</p>
                                <div className="mt-2 text-zinc-400">
                                    <p>+52 55 1234 5678</p>
                                    <p>email@empresa.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h4 className="text-white font-medium text-sm">Tarjeta de Presentación</h4>
                            <p className="text-xs text-zinc-500">90 x 50 mm</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <Printer size={16} />
                        </Button>
                    </div>
                </div>

                {/* Letterhead */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                    <div className="aspect-[1/1.41] bg-zinc-950 relative flex items-center justify-center p-6">
                        <div className="w-3/4 h-full bg-white shadow-lg p-4 flex flex-col transform group-hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="font-bold text-xs text-black">LOGO</div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-1 w-1/3 bg-zinc-100 rounded"></div>
                                <div className="h-1 w-full bg-zinc-100 rounded"></div>
                                <div className="h-1 w-full bg-zinc-100 rounded"></div>
                                <div className="h-1 w-2/3 bg-zinc-100 rounded"></div>
                            </div>
                            <div className="mt-4 border-t border-zinc-100 pt-2 flex justify-between text-[6px] text-zinc-400">
                                <span>www.empresa.com</span>
                                <span>Calle Falsa 123</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-white font-medium text-sm">Hoja Membretada</h4>
                        <p className="text-xs text-zinc-500">Carta / A4</p>
                    </div>
                </div>

                {/* Envelope */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                    <div className="aspect-[1.5/1] bg-zinc-950 relative flex items-center justify-center p-6">
                        <div className="w-full h-1/2 bg-white shadow-lg p-3 flex justify-between items-end transform group-hover:scale-105 transition-transform duration-300">
                            <div className="text-[8px] font-bold text-black mb-auto">LOGO</div>
                            <div className="text-[6px] text-zinc-400 text-right">
                                <div className="w-8 h-8 border border-zinc-200 flex items-center justify-center mb-1">
                                    <Stamp size={12} className="opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-white font-medium text-sm">Sobre Americano</h4>
                        <p className="text-xs text-zinc-500">DL 220 x 110 mm</p>
                    </div>
                </div>

                {/* ID Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                    <div className="aspect-[1/1.5] bg-zinc-950 relative flex items-center justify-center p-6">
                        <div className="w-1/2 h-full bg-white shadow-lg flex flex-col items-center p-4 transform group-hover:scale-105 transition-transform duration-300 rounded-t-lg relative">
                            <div className="w-2 h-2 rounded-full bg-black mx-auto mb-4 absolute top-2"></div>
                            <div className="w-12 h-12 bg-zinc-200 rounded-full mb-4"></div>
                            <div className="font-bold text-xs text-black text-center">Nombre</div>
                            <div className="text-[6px] text-zinc-500 text-center uppercase tracking-wider mb-auto">Staff</div>
                            <div className="font-bold text-xs text-black mb-2">LOGO</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-white font-medium text-sm">Gafete / ID</h4>
                        <p className="text-xs text-zinc-500">CR80</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrintSpecs = () => (
    <div className="p-6 max-w-4xl space-y-8">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Printer size={20} className="text-amber-500" />
            Especificaciones de Impresión
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
                <h4 className="text-white font-medium">Papeles Recomendados</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="flex justify-between border-b border-zinc-800 pb-2">
                        <span>Tarjetas de Presentación</span>
                        <span className="text-white">Opalina 300g / Couché Mate 350g</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-800 pb-2">
                        <span>Hojas Membretadas</span>
                        <span className="text-white">Bond 90g (Blancura 98%)</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-800 pb-2">
                        <span>Sobres</span>
                        <span className="text-white">Bond 120g</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Carpetas</span>
                        <span className="text-white">Sulfatada 12 pts</span>
                    </li>
                </ul>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
                <h4 className="text-white font-medium">Acabados Especiales</h4>
                <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center font-serif italic text-amber-500 border border-amber-500/30">
                            UV
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Barniz UV a Registro</p>
                            <p className="text-xs text-zinc-500">Usar sobre el logotipo en tarjetas mate.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center font-bold text-zinc-300 border border-zinc-700 shadow-inner">
                            H
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Hot Stamping / Grabado</p>
                            <p className="text-xs text-zinc-500">Para papelería de alta gama (Plata/Oro).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function StationeryWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="stationery"
            moduleName="Stationery"
            moduleSubtitle="Papelería corporativa y administrativa"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="gallery" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <FileText size={14} className="mr-2" /> Galería
                                    </TabsTrigger>
                                    <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Printer size={14} className="mr-2" /> Especificaciones
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="gallery" className="m-0 min-h-full">
                                            <StationeryGallery />
                                        </TabsContent>

                                        <TabsContent value="specs" className="m-0">
                                            <PrintSpecs />
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
