"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, CheckCircle, XCircle, MessageSquare, Handshake } from "lucide-react";


const ProtocolCard = ({ title, active }: { title: string, active?: boolean }) => (
    <div className={`p-4 rounded-lg border cursor-pointer transition-all ${active ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                <BookOpen size={16} />
            </div>
            <div>
                <h4 className={`text-sm font-medium ${active ? 'text-amber-500' : 'text-white'}`}>{title}</h4>
            </div>
        </div>
    </div>
);

const BehaviorPrinciples = () => {
    return (
        <div className="p-6 space-y-8 max-w-5xl">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Handshake size={20} className="text-amber-500" />
                Principios de Comportamiento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-green-400 font-medium flex items-center gap-2 border-b border-green-400/20 pb-2">
                        <CheckCircle size={18} /> Lo que Hacemos (Do's)
                    </h4>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Escuchar activamente</p>
                                <p className="text-xs text-zinc-500">Siempre dejamos que el cliente termine de hablar antes de responder.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Ser proactivos</p>
                                <p className="text-xs text-zinc-500">Anticipamos las necesidades y ofrecemos soluciones antes de que se conviertan en problemas.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Hablar con claridad</p>
                                <p className="text-xs text-zinc-500">Usamos un lenguaje simple y directo, evitando tecnicismos innecesarios.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-red-400 font-medium flex items-center gap-2 border-b border-red-400/20 pb-2">
                        <XCircle size={18} /> Lo que Evitamos (Don'ts)
                    </h4>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Interrumpir</p>
                                <p className="text-xs text-zinc-500">Nunca cortamos la palabra al cliente, incluso si creemos saber la respuesta.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Ser defensivos</p>
                                <p className="text-xs text-zinc-500">No tomamos las quejas como algo personal, sino como oportunidades de mejora.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div></div>
                            <div>
                                <p className="text-white text-sm font-medium">Prometer lo imposible</p>
                                <p className="text-xs text-zinc-500">Gestionamos las expectativas con realismo y honestidad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceProtocols = () => (
    <div className="p-6 h-full flex gap-6">
        <div className="w-64 space-y-3">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Escenarios</h4>
            <ProtocolCard title="Bienvenida en Tienda" active />
            <ProtocolCard title="Atención Telefónica" />
            <ProtocolCard title="Gestión de Quejas" />
            <ProtocolCard title="Despedida y Cierre" />
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-2">Bienvenida en Tienda</h3>
            <p className="text-zinc-400 text-sm mb-6">Objetivo: Hacer sentir al cliente valorado desde el primer segundo.</p>

            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div className="space-y-1">
                        <h5 className="text-white font-medium">Contacto Visual y Sonrisa</h5>
                        <p className="text-sm text-zinc-400">Establecer contacto visual inmediato (regla de los 3 metros) y sonreír de manera genuina.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div className="space-y-1">
                        <h5 className="text-white font-medium">Saludo Verbal</h5>
                        <p className="text-sm text-zinc-400">Usar el saludo estándar: "¡Hola! Bienvenido a [Marca], gracias por visitarnos."</p>
                        <div className="bg-black/30 p-2 rounded border border-zinc-700 mt-2">
                            <p className="text-xs text-zinc-300 italic">"¡Hola! Buenos días, ¿en qué puedo ayudarte hoy?"</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                    <div className="space-y-1">
                        <h5 className="text-white font-medium">Espacio Personal</h5>
                        <p className="text-sm text-zinc-400">Dar espacio al cliente para que se oriente (aprox. 30 segundos) antes de ofrecer asistencia específica, a menos que la soliciten.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function BehaviorWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="behaviorManual"
            moduleName="Behavior Manual"
            moduleSubtitle="Protocolos de comportamiento y servicio"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="principles" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="principles" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <CheckCircle size={14} className="mr-2" /> Principios (Do's & Don'ts)
                                    </TabsTrigger>
                                    <TabsTrigger value="protocols" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <MessageSquare size={14} className="mr-2" /> Protocolos de Servicio
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="principles" className="m-0 min-h-full">
                                            <BehaviorPrinciples />
                                        </TabsContent>

                                        <TabsContent value="protocols" className="m-0 min-h-full">
                                            <ServiceProtocols />
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
