"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Activity, MessageCircle, FileText, PhoneCall } from "lucide-react";


const SeverityLevel = ({
    level,
    title,
    color,
    description
}: {
    level: string,
    title: string,
    color: string,
    description: string
}) => (
    <div className={`border rounded-lg p-6 flex items-start gap-4 ${color.replace("text-", "border-").replace("500", "800")} bg-zinc-900/50`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${color.replace("text-", "bg-").replace("500", "500/20")} ${color}`}>
            {level}
        </div>
        <div>
            <h4 className={`text-lg font-bold mb-1 ${color}`}>{title}</h4>
            <p className="text-zinc-400 text-sm">{description}</p>
        </div>
    </div>
);

const CrisisFlow = () => (
    <div className="p-6 space-y-8 max-w-5xl">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Activity size={20} className="text-amber-500" />
            Niveles de Severidad
        </h3>

        <div className="grid grid-cols-1 gap-4">
            <SeverityLevel
                level="1"
                title="Incidente Menor"
                color="text-green-500"
                description="Problema aislado que afecta a pocos usuarios. (Ej. Bug visual, error tipográfico)"
            />
            <SeverityLevel
                level="2"
                title="Incidente Mayor"
                color="text-amber-500"
                description="Funcionalidad parcial rota o quejas recurrentes. (Ej. Login lento, error en pagos)"
            />
            <SeverityLevel
                level="3"
                title="Crisis Crítica"
                color="text-red-500"
                description="Interrupción total del servicio o riesgo reputacional grave. (Ej. Caída de servidor, filtración de datos)"
            />
        </div>

        <div className="relative mt-8 p-8 border border-zinc-800 rounded-lg bg-zinc-900">
            <div className="absolute top-0 left-0 bg-zinc-800 px-4 py-1 rounded-br-lg text-xs font-bold text-zinc-400 uppercase">Flujo de Respuesta Nivel 3</div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-center md:text-left mt-4 relative z-10">
                <div className="flex-1 space-y-2">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto md:mx-0">
                        <AlertTriangle size={24} />
                    </div>
                    <h5 className="text-white font-medium">1. Detección</h5>
                    <p className="text-xs text-zinc-500">Alerta de sistemas o reporte masivo.</p>
                </div>

                <div className="hidden md:block w-8 h-0.5 bg-zinc-700"></div>

                <div className="flex-1 space-y-2">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mx-auto md:mx-0">
                        <PhoneCall size={24} />
                    </div>
                    <h5 className="text-white font-medium">2. Comité de Crisis</h5>
                    <p className="text-xs text-zinc-500">CEO, CTO y PR se reúnen en {"<"} 30min.</p>
                </div>

                <div className="hidden md:block w-8 h-0.5 bg-zinc-700"></div>

                <div className="flex-1 space-y-2">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mx-auto md:mx-0">
                        <MessageCircle size={24} />
                    </div>
                    <h5 className="text-white font-medium">3. Comunicación</h5>
                    <p className="text-xs text-zinc-500">Publicar comunicado oficial y pausar marketing.</p>
                </div>
            </div>
        </div>
    </div>
);

const CommsTemplates = () => (
    <div className="p-6 h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <FileText size={20} className="text-amber-500" />
                Plantillas de Respuesta
            </h3>

            <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-600 transition-colors">
                    <h4 className="text-white font-medium mb-1">Comunicado Oficial: Interrupción de Servicio</h4>
                    <p className="text-xs text-zinc-500 mb-3">Para redes sociales y página de estado.</p>
                    <div className="bg-black p-3 rounded text-zinc-400 text-sm italic font-mono">
                        "Actualmente estamos experimentando problemas técnicos... Nuestro equipo ya está trabajando en ello..."
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-600 transition-colors">
                    <h4 className="text-white font-medium mb-1">Respuesta a Usuarios (DM)</h4>
                    <p className="text-xs text-zinc-500 mb-3">Para soporte directo.</p>
                    <div className="bg-black p-3 rounded text-zinc-400 text-sm italic font-mono">
                        "Hola [Nombre], lamentamos los inconvenientes. Esto se debe a [Razón] y esperamos resolverlo en [Tiempo]..."
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Checklist de Comunicación</h3>
            <ul className="space-y-3">
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center"></div>
                    Detener campañas de publicidad activas
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center"></div>
                    Actualizar banner en sitio web
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center"></div>
                    Notificar a socios clave / stakeholders
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 border border-zinc-600 rounded flex items-center justify-center"></div>
                    Monitorear sentimiento en redes sociales
                </li>
            </ul>
        </div>
    </div>
);


export default function IncidentWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="incidentManagement"
            moduleName="Incident Mgmt."
            moduleSubtitle="Gestión de crisis y protocolos de respuesta"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="flow" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="flow" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Activity size={14} className="mr-2" /> Protocolos
                                    </TabsTrigger>
                                    <TabsTrigger value="templates" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <MessageCircle size={14} className="mr-2" /> Comunicación
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="flow" className="m-0 min-h-full">
                                            <CrisisFlow />
                                        </TabsContent>

                                        <TabsContent value="templates" className="m-0 min-h-full">
                                            <CommsTemplates />
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
