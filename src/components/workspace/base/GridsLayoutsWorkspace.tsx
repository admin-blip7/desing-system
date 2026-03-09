"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid3x3, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface GridSystem {
    columns: number;
    gutter: string;
    maxWidth: string;
    containerPadding: string;
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}

interface GridsLayoutsData {
    gridSystem: GridSystem;
    containerClass: string;
}

const defaultGridsLayoutsData: GridsLayoutsData = {
    gridSystem: {
        columns: 12,
        gutter: "16px",
        maxWidth: "1200px",
        containerPadding: "0 16px",
        breakpoints: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px"
        }
    },
    containerClass: "container"
};

function GridsLayoutsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [gridsData, setGridsData] = useState<GridsLayoutsData>(
        data?.content?.gridsData || defaultGridsLayoutsData
    );
    const [hasChanges, setHasChanges] = useState(false);

    const updateGridSystem = useCallback((key: keyof GridSystem, value: string | number) => {
        setGridsData(prev => ({
            ...prev,
            gridSystem: { ...prev.gridSystem, [key]: value }
        }));
        setHasChanges(true);
    }, []);

    const updateBreakpoint = useCallback((bp: keyof GridSystem["breakpoints"], value: string) => {
        setGridsData(prev => ({
            ...prev,
            gridSystem: {
                ...prev.gridSystem,
                breakpoints: { ...prev.gridSystem.breakpoints, [bp]: value }
            }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({
            ...data,
            content: { ...data?.content, gridsData }
        });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setGridsData(data?.content?.gridsData || defaultGridsLayoutsData);
        setHasChanges(false);
    };

    const renderGridPreview = () => {
        const { columns, gutter } = gridsData.gridSystem;
        const cells = [];
        for (let i = 0; i < columns; i++) {
            cells.push(
                <div
                    key={i}
                    className="bg-blue-500/30 border border-blue-500/50 rounded"
                    style={{
                        flex: `0 0 calc(${100 / columns}% - ${gutter})`,
                        marginLeft: i > 0 ? gutter : undefined,
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#3B82F6"
                    }}
                >
                    {i + 1}
                </div>
            );
        }
        return cells;
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Grid3x3 size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="editor"><Edit size={14} className="mr-2" /> Editor</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Grids & Layouts</h2>
                                    <p className="text-zinc-400">Define el sistema de grillas responsive para tu interfaz.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Configuración Actual</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-zinc-950 rounded-lg">
                                            <p className="text-zinc-500 text-xs uppercase">Columnas</p>
                                            <p className="text-white text-xl font-bold">{gridsData.gridSystem.columns}</p>
                                        </div>
                                        <div className="p-3 bg-zinc-950 rounded-lg">
                                            <p className="text-zinc-500 text-xs uppercase">Gutter</p>
                                            <p className="text-white text-xl font-bold">{gridsData.gridSystem.gutter}</p>
                                        </div>
                                        <div className="p-3 bg-zinc-950 rounded-lg">
                                            <p className="text-zinc-500 text-xs uppercase">Max Width</p>
                                            <p className="text-white text-xl font-bold">{gridsData.gridSystem.maxWidth}</p>
                                        </div>
                                        <div className="p-3 bg-zinc-950 rounded-lg">
                                            <p className="text-zinc-500 text-xs uppercase">Breakpoints</p>
                                            <p className="text-white text-xl font-bold">4</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Configurar Sistema de Grid</h3>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Columnas</Label>
                                            <Input
                                                type="number"
                                                value={gridsData.gridSystem.columns}
                                                onChange={e => updateGridSystem("columns", parseInt(e.target.value))}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Gutter</Label>
                                            <Input
                                                value={gridsData.gridSystem.gutter}
                                                onChange={e => updateGridSystem("gutter", e.target.value)}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Max Width</Label>
                                            <Input
                                                value={gridsData.gridSystem.maxWidth}
                                                onChange={e => updateGridSystem("maxWidth", e.target.value)}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Container Padding</Label>
                                            <Input
                                                value={gridsData.gridSystem.containerPadding}
                                                onChange={e => updateGridSystem("containerPadding", e.target.value)}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm text-zinc-400 mb-2 block">Breakpoints</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {(["sm", "md", "lg", "xl"] as const).map(bp => (
                                                <div key={bp}>
                                                    <Label className="text-xs text-zinc-500 uppercase">{bp}</Label>
                                                    <Input
                                                        value={gridsData.gridSystem.breakpoints[bp]}
                                                        onChange={e => updateBreakpoint(bp, e.target.value)}
                                                        className="font-mono text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="bg-white rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-zinc-900 mb-4">Preview del Grid</h3>
                                    <div
                                                                        className="flex flex-row"
                                                                        style={{ maxWidth: gridsData.gridSystem.maxWidth, margin: "0 auto" }}
                                                                    >
                                                                        {renderGridPreview()}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-zinc-900 rounded-xl p-6">
                                                                    <h3 className="text-lg font-semibold text-white mb-4">Layouts de Ejemplo</h3>
                                                                    <div className="space-y-4">
                                                                        <div className="bg-zinc-950 rounded-lg p-4">
                                                                            <p className="text-zinc-500 text-sm mb-2">12 columnas (span completo)</p>
                                                                            <div className="h-16 bg-blue-500/30 border border-blue-500/50 rounded flex items-center justify-center text-blue-500">
                                                                                12 columnas
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="bg-zinc-950 rounded-lg p-4">
                                                                                <p className="text-zinc-500 text-sm mb-2">6 columnas</p>
                                                                                <div className="h-16 bg-green-500/30 border border-green-500/50 rounded flex items-center justify-center text-green-500">
                                                                                    1/2
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-zinc-950 rounded-lg p-4">
                                                                                <p className="text-zinc-500 text-sm mb-2">4 columnas</p>
                                                                                <div className="h-16 bg-amber-500/30 border border-amber-500/50 rounded flex items-center justify-center text-amber-500">
                                                                                    1/3
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                            {["3 col", "4 col", "6 col"].map((label, i) => (
                                                                                <div key={label} className="bg-zinc-950 rounded-lg p-4">
                                                                                    <p className="text-zinc-500 text-sm mb-2">{label}</p>
                                                                                    <div className="h-16 bg-purple-500/30 border border-purple-500/50 rounded flex items-center justify-center text-purple-500 text-xs">
                                                                                        {12 / (i + 3)} cols
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white mb-2">Exportar Sistema de Grid</h3>
                                                                    <p className="text-sm text-zinc-400">Genera código CSS para tu grid system.</p>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const css = `.container {
  max-width: ${gridsData.gridSystem.maxWidth};
  margin: 0 auto;
  padding: ${gridsData.gridSystem.containerPadding};
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(${gridsData.gridSystem.gutter} / -2);
}

.col {
  flex: 0 0 calc(8.333% - ${gridsData.gridSystem.gutter});
  margin-left: ${gridsData.gridSystem.gutter};
}

/* Breakpoints */
@media (max-width: ${gridsData.gridSystem.breakpoints.xl}) {
  .container { padding: ${gridsData.gridSystem.containerPadding}; }
}

@media (max-width: ${gridsData.gridSystem.breakpoints.lg}) {
  .container { padding: ${gridsData.gridSystem.containerPadding}; }
}

@media (max-width: ${gridsData.gridSystem.breakpoints.md}) {
  .container { padding: ${gridsData.gridSystem.containerPadding}; }
}

@media (max-width: ${gridsData.gridSystem.breakpoints.sm}) {
  .container { padding: ${gridsData.gridSystem.containerPadding}; }
}`;
                                                                            navigator.clipboard.writeText(css);
                                                                            toast.success("CSS copiado");
                                                                        }}
                                                                    >
                                                                        <Download size={20} />
                                                                        <span className="font-medium">CSS Grid</span>
                                                                        <span className="text-xs text-zinc-500">Sistema completo</span>
                                                                    </Button>

                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const json = JSON.stringify(gridsData, null, 2);
                                                                            navigator.clipboard.writeText(json);
                                                                            toast.success("JSON copiado");
                                                                        }}
                                                                    >
                                                                        <Download size={20} />
                                                                        <span className="font-medium">JSON</span>
                                                                        <span className="text-xs text-zinc-500">Configuración</span>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </ScrollArea>
                                                </div>
                                            </Tabs>
                                        </div>
                                    );
}

export default function GridsLayoutsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="gridsLayouts"
            moduleName="Grids & Layouts"
            moduleSubtitle="Define el sistema de grillas responsive"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <GridsLayoutsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
