"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Flag, CheckCircle2, Circle, ArrowRight } from "lucide-react";


const RoadmapTimeline = () => (
    <div className="p-6 space-y-8 max-w-5xl">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Calendar size={20} className="text-amber-500" />
            Cronograma de Implementación
        </h3>

        <div className="space-y-6 relative ml-4">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-800"></div>

            {/* Phase 1 */}
            <div className="relative pl-12 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500 border-4 border-black flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-black fill-current" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-bold">Fase 1: Fundamentos de Identidad</h4>
                        <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">COMPLETADO</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">Definición de pilares estratégicos, logotipo y sistema visual básico.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-300 flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Logo</div>
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-300 flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Color</div>
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-300 flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Typo</div>
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-300 flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Voice</div>
                    </div>
                </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-12 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-500 border-4 border-black flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                </div>
                <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-bold">Fase 2: Presencia Digital</h4>
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded">EN PROGRESO</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">Despliegue de la marca en canales web y redes sociales.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-300 flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Social</div>
                        <div className="bg-amber-500/10 p-2 rounded text-xs text-amber-500 flex items-center gap-2 border border-amber-500/20"><Circle size={10} className="animate-pulse" /> Web</div>
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-500 flex items-center gap-2"><Circle size={10} /> Email</div>
                        <div className="bg-black/30 p-2 rounded text-xs text-zinc-500 flex items-center gap-2"><Circle size={10} /> Ads</div>
                    </div>
                </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-12 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-zinc-300 font-bold">Fase 3: Identidad Física</h4>
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">PENDIENTE</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-4">Aplicación en papelería, señalética y merchandising.</p>
                </div>
            </div>
        </div>
    </div>
);

const Milestones = () => (
    <div className="p-6 h-full space-y-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Flag size={20} className="text-amber-500" />
            Próximos Hitos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between h-40 group hover:border-zinc-700">
                <div>
                    <h4 className="text-white font-medium mb-1">Lanzamiento Web Beta</h4>
                    <p className="text-xs text-zinc-500">Fecha est: 15 Oct</p>
                </div>
                <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
                    Faltan 12 días <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between h-40 group hover:border-zinc-700">
                <div>
                    <h4 className="text-white font-medium mb-1">Entrega de Manual Impreso</h4>
                    <p className="text-xs text-zinc-500">Fecha est: 01 Nov</p>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                    Faltan 28 días
                </div>
            </div>
        </div>
    </div>
);

export default function RoadmapWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="roadmapGenerator"
            moduleName="Roadmap"
            moduleSubtitle="Planificación y seguimiento del proyecto"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="timeline" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Calendar size={14} className="mr-2" /> Línea de Tiempo
                                    </TabsTrigger>
                                    <TabsTrigger value="milestones" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Flag size={14} className="mr-2" /> Hitos Clave
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="timeline" className="m-0 min-h-full">
                                            <RoadmapTimeline />
                                        </TabsContent>

                                        <TabsContent value="milestones" className="m-0 min-h-full">
                                            <Milestones />
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
