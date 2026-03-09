"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, BarChart, LineChart, Palette, AlertTriangle, CheckCircle, Info } from "lucide-react";

const ChartPreview = ({ type, colors }: { type: 'bar' | 'pie' | 'line', colors: string[] }) => {
    return (
        <div className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
            {type === 'bar' && (
                <div className="flex items-end gap-2 h-32 w-full justify-center">
                    {colors.map((color, i) => (
                        <div key={i} className="w-8 rounded-t" style={{ backgroundColor: color, height: `${30 + (i * 10) + (Math.random() * 40)}%` }} />
                    ))}
                </div>
            )}
            {type === 'pie' && (
                <div className="w-32 h-32 rounded-full relative" style={{
                    background: `conic-gradient(
                        ${colors[0]} 0% 25%, 
                        ${colors[1]} 25% 45%, 
                        ${colors[2]} 45% 70%, 
                        ${colors[3] || colors[0]} 70% 100%
                    )`
                }} />
            )}
            {type === 'line' && (
                <div className="w-full h-32 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                        <path
                            d="M0,80 C50,20 100,60 150,40 C200,20 250,80 300,50"
                            fill="none"
                            stroke={colors[0]}
                            strokeWidth="3"
                        />
                        <path
                            d="M0,90 C50,40 100,80 150,60 C200,40 250,90 300,70"
                            fill="none"
                            stroke={colors[1]}
                            strokeWidth="3"
                            strokeDasharray="4 4"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

const PaletteEditor = ({
    colors,
    onChange
}: {
    colors: string[],
    onChange: (c: string[]) => void
}) => {
    const updateColor = (index: number, val: string) => {
        const newColors = [...colors];
        newColors[index] = val;
        onChange(newColors);
    };

    return (
        <div className="p-6 space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Palette size={20} className="text-amber-500" />
                    Paleta de Categorías (Qualitative)
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colors.map((color, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-zinc-900 p-4 rounded border border-zinc-800">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => updateColor(idx, e.target.value)}
                            className="bg-transparent border-none w-10 h-10 cursor-pointer"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => updateColor(idx, e.target.value)}
                                className="w-full bg-transparent text-sm text-zinc-300 outline-none uppercase font-mono"
                            />
                            <p className="text-xs text-zinc-500">Categoría {idx + 1}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
                <h4 className="text-sm font-medium text-white">Previsualización</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ChartPreview type="bar" colors={colors} />
                    <ChartPreview type="pie" colors={colors} />
                    <ChartPreview type="line" colors={colors} />
                </div>
            </div>
        </div>
    );
};

const Guidelines = () => (
    <div className="p-6 max-w-4xl space-y-8">
        <h3 className="text-lg font-medium text-white">Buenas Prácticas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="text-green-500 flex items-center gap-2 text-sm font-medium"><CheckCircle size={16} /> Correcto</h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                    <li>Usar colores contrastantes para categorías adyacentes.</li>
                    <li>Incluir leyendas claras y directas.</li>
                    <li>Ordenar los datos de mayor a menor en gráficos de barras para facilitar la lectura.</li>
                </ul>
            </div>
            <div className="space-y-4">
                <h4 className="text-red-500 flex items-center gap-2 text-sm font-medium"><AlertTriangle size={16} /> Incorrecto</h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                    <li>No usar más de 5-7 colores categóricos en un solo gráfico.</li>
                    <li>Evitar gráficos 3D que distorsionen los datos.</li>
                    <li>No confiar solo en el color para diferenciar (usar tramas o etiquetas si es posible).</li>
                </ul>
            </div>
        </div>
    </div>
);

interface DataVisualizationContentProps {
    data: any;
    saveModule: (data: any) => void;
}

const DataVisualizationContent = ({ data, saveModule }: DataVisualizationContentProps) => {
    // Default palette
    const defaultPalette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
    const [colors, setColors] = useState<string[]>(data?.content?.colors || defaultPalette);

    const handleUpdateColors = (newColors: string[]) => {
        setColors(newColors);
        saveModule({ ...data, content: { ...data?.content, colors: newColors } });
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="palette" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="palette" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Palette size={14} className="mr-2" /> Paleta Cromática
                        </TabsTrigger>
                        <TabsTrigger value="guidelines" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Info size={14} className="mr-2" /> Guía de Uso
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="palette" className="m-0 min-h-full">
                                <PaletteEditor colors={colors} onChange={handleUpdateColors} />
                            </TabsContent>

                            <TabsContent value="guidelines" className="m-0">
                                <Guidelines />
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default function DataVisualizationWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="dataVisualization"
            moduleName="Visualización de Datos"
            moduleSubtitle="Estándares para gráficos y representación de información"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => (
                <DataVisualizationContent data={data} saveModule={saveModule} />
            )}
        </BaseWorkspace>
    );
}
