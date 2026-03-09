"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCheck, ShieldCheck, AlertCircle, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const HealthMetric = ({ label, score, color = "bg-green-500" }: { label: string, score: number, color?: string }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-zinc-300">{label}</span>
            <span className="text-white font-mono">{score}%</span>
        </div>
        <Progress value={score} className="h-2" indicatorColor={color} />
    </div>
);

const AuditOverview = () => {
    return (
        <div className="p-6 space-y-8 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 items-center bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                <div className="text-center space-y-2">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="8" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="283" strokeDashoffset="42" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">85</span>
                            <span className="text-zinc-500 text-xs uppercase tracking-wider">Health Score</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-6">
                    <h3 className="text-xl font-bold text-white">Estado del Sistema de Marca</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <HealthMetric label="Consistencia Visual" score={92} />
                        <HealthMetric label="Accesibilidad (WCAG)" score={78} color="bg-amber-500" />
                        <HealthMetric label="Tono de Voz" score={88} />
                        <HealthMetric label="Completitud de Assets" score={65} color="bg-red-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">Logotipo</h4>
                        <p className="text-xs text-zinc-500 mt-1">Todas las variantes requeridas existen y tienen áreas de protección definidas.</p>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">Color</h4>
                        <p className="text-xs text-zinc-500 mt-1">2 combinaciones de texto tienen bajo contraste (Ratio 3.5:1).</p>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">Packaging</h4>
                        <p className="text-xs text-zinc-500 mt-1">Faltan modelos 3D para la línea de envío internacional.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IssuesList = () => (
    <div className="p-6 max-w-4xl space-y-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <ClipboardCheck size={20} className="text-amber-500" />
            Acciones Requeridas
        </h3>

        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                        <div>
                            <h4 className="text-white text-sm font-medium">
                                {i === 1 ? "Actualizar enlace roto en template de email" :
                                    i === 2 ? "Subir versión vectorial del logo secundario" :
                                        "Revisar contraste en modo oscuro"}
                            </h4>
                            <p className="text-xs text-zinc-500">Detectado en: {i === 1 ? "Email Workspace" : i === 2 ? "Logo Workspace" : "Color Workspace"}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Corregir</Button>
                </div>
            ))}
        </div>
    </div>
);

export default function BrandAuditWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="brandAudit"
            moduleName="Brand Audit"
            moduleSubtitle="Análisis de salud y consistencia de marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="overview" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <BarChart3 size={14} className="mr-2" /> Reporte General
                                    </TabsTrigger>
                                    <TabsTrigger value="issues" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <ShieldCheck size={14} className="mr-2" /> Cumplimiento
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="overview" className="m-0 min-h-full">
                                            <AuditOverview />
                                        </TabsContent>

                                        <TabsContent value="issues" className="m-0 min-h-full">
                                            <IssuesList />
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
