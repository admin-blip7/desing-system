"use client";

import React from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gift, Book, Users, GraduationCap, CheckSquare } from "lucide-react";


const WelcomeKit = () => (
    <div className="p-6 max-w-5xl space-y-8">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Gift size={20} className="text-amber-500" />
            Kit de Bienvenida (Welcome Pack)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4 group hover:border-zinc-700 transition-colors">
                <div className="relative">
                    <div className="w-32 h-40 bg-zinc-800 rounded shadow-lg transform -rotate-3 border border-zinc-700"></div>
                    <div className="w-32 h-40 bg-zinc-700 rounded shadow-xl absolute top-0 transform rotate-3 flex items-center justify-center border border-zinc-600">
                        <Book size={32} className="text-zinc-500" />
                    </div>
                </div>
                <h4 className="text-white font-medium">Manual de Cultura</h4>
                <p className="text-xs text-zinc-500 text-center">Nuestra historia, valores y misión.</p>
            </div>

            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4 group hover:border-zinc-700 transition-colors">
                <div className="relative flex items-center justify-center">
                    <div className="w-40 h-32 bg-black rounded-lg shadow-xl flex items-center justify-center border border-zinc-800">
                        <span className="font-bold text-white text-xl">BRAND</span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Users size={20} className="text-black" />
                    </div>
                </div>
                <h4 className="text-white font-medium">Merch Pack</h4>
                <p className="text-xs text-zinc-500 text-center">Hoodie, termo, libreta y stickers.</p>
            </div>

            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4 group hover:border-zinc-700 transition-colors">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-zinc-800 flex items-center justify-center">
                    <GraduationCap size={40} className="text-zinc-600" />
                </div>
                <h4 className="text-white font-medium">Acceso LMS</h4>
                <p className="text-xs text-zinc-500 text-center">Credenciales para plataforma de cursos.</p>
            </div>
        </div>
    </div>
);

const TrainingChecklist = () => (
    <div className="p-6 h-full flex flex-col gap-6 max-w-4xl">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <CheckSquare size={20} className="text-amber-500" />
            Checklist de Capacitación: Día 1 a 30
        </h3>

        <div className="space-y-6">
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Semana 1: Inmersión</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <div className="w-5 h-5 rounded border border-green-500 bg-green-500/20 flex items-center justify-center text-green-500"><CheckSq size={12} /></div>
                        <span className="text-white text-sm line-through text-zinc-500">Sesión de Bienvenida y Tour</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <div className="w-5 h-5 rounded border border-zinc-600 bg-transparent"></div>
                        <span className="text-white text-sm">Lectura del Brand Manual</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <div className="w-5 h-5 rounded border border-zinc-600 bg-transparent"></div>
                        <span className="text-white text-sm">Configuración de herramientas (Slack, Jira, etc.)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Semana 2: Rol y Funciones</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <div className="w-5 h-5 rounded border border-zinc-600 bg-transparent"></div>
                        <span className="text-white text-sm">Shadowing con compañero senior</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <div className="w-5 h-5 rounded border border-zinc-600 bg-transparent"></div>
                        <span className="text-white text-sm">Primera tarea supervisada</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Icon replacement mainly for check
const CheckSq = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)


export default function OnboardingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="employeeOnboarding"
            moduleName="Employee Onboarding"
            moduleSubtitle="Proceso de inducción y cultura"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {() => {
                return (
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="kit" className="h-full flex flex-col">
                            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="kit" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <Gift size={14} className="mr-2" /> Welcome Kit
                                    </TabsTrigger>
                                    <TabsTrigger value="checklist" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                        <CheckSquare size={14} className="mr-2" /> Training Checklist
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 bg-[#0A0A0A]">
                                    <ScrollArea className="h-full">
                                        <TabsContent value="kit" className="m-0 min-h-full">
                                            <WelcomeKit />
                                        </TabsContent>

                                        <TabsContent value="checklist" className="m-0 min-h-full">
                                            <TrainingChecklist />
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
