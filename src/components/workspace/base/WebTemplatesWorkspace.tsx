"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Monitor, AppWindow, Square, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
    {
        id: "landing-saas",
        name: "SaaS Landing Page",
        category: "Marketing",
        preview: "bg-zinc-900 border border-zinc-800",
        elements: ["Hero", "Features", "Pricing", "Testimonials"]
    },
    {
        id: "ecommerce-product",
        name: "E-commerce Product",
        category: "E-commerce",
        preview: "bg-zinc-900 border border-zinc-800",
        elements: ["Gallery", "Product Info", "Reviews", "Related"]
    },
    {
        id: "blog-post",
        name: "Blog Post",
        category: "Content",
        preview: "bg-zinc-900 border border-zinc-800",
        elements: ["Header", "Article Body", "Author Bio", "Comments"]
    },
    {
        id: "dashboard-layout",
        name: "Dashboard Layout",
        category: "App",
        preview: "bg-zinc-900 border border-zinc-800",
        elements: ["Sidebar", "Header", "Stats Grid", "Table"]
    }
];

const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col hover:border-zinc-700 transition-colors">
        <div className={`aspect-video ${template.preview} relative p-4 flex flex-col gap-2`}>
            {/* Abstract representation of layout */}
            <div className="w-full h-8 bg-zinc-800 rounded opacity-50 mb-2"></div>
            <div className="flex gap-2 mb-2">
                <div className="w-1/3 h-24 bg-zinc-800 rounded opacity-30"></div>
                <div className="w-2/3 space-y-2">
                    <div className="w-full h-4 bg-zinc-800 rounded opacity-40"></div>
                    <div className="w-full h-4 bg-zinc-800 rounded opacity-40"></div>
                    <div className="w-3/4 h-4 bg-zinc-800 rounded opacity-40"></div>
                </div>
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">Ver Detalle</Button>
            </div>
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium">{template.name}</h4>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{template.category}</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {template.elements.map(el => (
                    <span key={el} className="text-[10px] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded">
                        {el}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const WebComponentsCollection = () => {
    return (
        <div className="p-6 max-w-4xl space-y-12">
            {/* Navbar Preview */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Navegación</h4>
                <div className="w-full bg-black border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                    <div className="flex gap-6 text-sm text-zinc-400">
                        <span>Producto</span>
                        <span>Soluciones</span>
                        <span>Precios</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-sm text-white px-3 py-1.5">Log in</span>
                        <span className="text-sm bg-white text-black px-3 py-1.5 rounded font-medium">Sign up</span>
                    </div>
                </div>
            </div>

            {/* Hero Preview */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Hero Section</h4>
                <div className="w-full bg-black border border-zinc-800 rounded-lg p-12 text-center space-y-6">
                    <h1 className="text-4xl font-bold text-white max-w-2xl mx-auto">
                        Construye el futuro de tu marca con nuestras herramientas
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        Una plataforma unificada para gestionar cada aspecto de tu identidad visual y estrategia de comunicación.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button className="bg-white text-black hover:bg-zinc-200">Empezar Ahora</Button>
                        <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-900">Agendar Demo</Button>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Features Grid</h4>
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg space-y-3">
                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                                <AppWindow size={20} />
                            </div>
                            <h5 className="text-white font-medium">Feature {i}</h5>
                            <p className="text-sm text-zinc-500">Descripción breve de la característica que aporta valor al usuario final.</p>
                            <a href="#" className="text-xs text-white flex items-center gap-1 hover:underline">
                                Saber más <ArrowRight size={10} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function WebTemplatesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="webTemplates"
            moduleName="Web Templates"
            moduleSubtitle="Layouts y componentes para presencia web"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="layouts" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="layouts" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Monitor size={14} className="mr-2" /> Layouts
                                    </TabsTrigger>
                                    <TabsTrigger value="components" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <AppWindow size={14} className="mr-2" /> Componentes
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="layouts" className="m-0 min-h-full">
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {templates.map(t => <TemplateCard key={t.id} template={t} />)}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="components" className="m-0">
                                            <WebComponentsCollection />
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
