"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Shirt, Sticker, Coffee, CupSoda } from "lucide-react";
import { Button } from "@/components/ui/button";

const MerchProduct = ({
    type,
    color = "bg-white",
    logoColor = "text-black"
}: {
    type: "tshirt" | "mug" | "tote" | "cap",
    color?: string,
    logoColor?: string
}) => {
    return (
        <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center relative group overflow-hidden">
            {/* T-Shirt Mockup */}
            {type === 'tshirt' && (
                <div className="relative w-48 h-56">
                    {/* Simplified T-Shirt Shape */}
                    <div className={`absolute inset-0 ${color} rounded-t-3xl shadow-lg`} style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)" }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-b-full"></div>
                        <div className={`absolute top-16 left-1/2 -translate-x-1/2 font-bold text-xl ${logoColor}`}>LOGO</div>
                    </div>
                    {/* Sleeves */}
                    <div className={`absolute top-4 -left-4 w-12 h-16 ${color} -rotate-12 rounded-l-lg`} style={{ zIndex: -1 }}></div>
                    <div className={`absolute top-4 -right-4 w-12 h-16 ${color} rotate-12 rounded-r-lg`} style={{ zIndex: -1 }}></div>
                </div>
            )}

            {/* Mug Mockup */}
            {type === 'mug' && (
                <div className="relative w-32 h-32">
                    <div className={`w-full h-full ${color} rounded-lg shadow-lg flex items-center justify-center relative z-10`}>
                        <div className={`font-bold text-lg ${logoColor} -rotate-6`}>LOGO</div>
                    </div>
                    <div className={`absolute top-1/2 -translate-y-1/2 -right-8 w-12 h-20 border-[6px] border-${color.replace('bg-', '')} rounded-r-3xl`} />
                </div>
            )}

            {/* Tote Bag Mockup */}
            {type === 'tote' && (
                <div className="relative w-40 h-48">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-24 border-[4px] border-zinc-400 rounded-t-full bg-transparent z-0"></div>
                    <div className={`w-full h-full ${color} rounded-b-lg shadow-lg relative z-10 flex items-center justify-center`}>
                        <div className={`font-bold text-2xl ${logoColor}`}>LOGO</div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                <Button size="sm" variant="secondary">Editar</Button>
            </div>
        </div>
    );
};

const MerchCatalog = () => {
    return (
        <div className="p-6 space-y-8">
            <h3 className="text-lg font-medium text-white">Catálogo de Productos</h3>

            <div className="space-y-8">
                <div>
                    <h4 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                        <Shirt size={16} /> Ropa y Textiles
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <MerchProduct type="tshirt" color="bg-zinc-100" />
                        <MerchProduct type="tshirt" color="bg-zinc-900" logoColor="text-white" />
                        <MerchProduct type="tote" color="bg-amber-100" />
                        <MerchProduct type="cap" color="bg-blue-600" logoColor="text-white" />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                        <Coffee size={16} /> Accesorios y Regalo
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <MerchProduct type="mug" color="bg-white" />
                        <MerchProduct type="mug" color="bg-black" logoColor="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MerchandisingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="merchandising"
            moduleName="Merchandising"
            moduleSubtitle="Productos promocionales y de marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="catalog" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="catalog" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <ShoppingBag size={14} className="mr-2" /> Catálogo Virtual
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="catalog" className="m-0 min-h-full">
                                            <MerchCatalog />
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
