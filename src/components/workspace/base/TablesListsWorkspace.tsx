"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface TableStyle {
    headerBgColor: string;
    headerTextColor: string;
    rowBgColor: string;
    rowAltColor: string;
    borderColor: string;
    hoverColor: string;
    borderRadius: string;
}

interface TablesData {
    table: TableStyle;
}

const defaultTablesData: TablesData = {
    table: {
        headerBgColor: "#27272a",
        headerTextColor: "#fafafa",
        rowBgColor: "#18181b",
        rowAltColor: "#27272a",
        borderColor: "#3f3f46",
        hoverColor: "#3f3f46",
        borderRadius: "8px"
    }
};

function TablesListsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [tablesData, setTablesData] = useState<TablesData>(data?.content?.tablesData || defaultTablesData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateTableStyle = useCallback((field: keyof TableStyle, value: string) => {
        setTablesData(prev => ({
            ...prev,
            table: { ...prev.table, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, tablesData } });
        if (success) setHasChanges(false);
    };

    const sampleData = [
        { name: "Producto A", category: "Electrónica", price: "$299.00", stock: 15 },
        { name: "Producto B", category: "Hogar", price: "$89.00", stock: 42 },
        { name: "Producto C", category: "Electrónica", price: "$599.00", stock: 8 },
        { name: "Producto D", category: "Deportes", price: "$45.00", stock: 0 },
        { name: "Producto E", category: "Hogar", price: "$120.00", stock: 23 }
    ];

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTablesData(data?.content?.tablesData || defaultTablesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Table size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Tablas & Listas</h2>
                                    <p className="text-zinc-400">Componentes para tablas de datos, listas y paginación.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: "📊", title: "Data Tables", desc: "Tablas con sort y filtros" },
                                        { icon: "📋", title: "Listas", desc: "Listas simples y agrupadas" },
                                        { icon: "🔍", title: "Filtros", desc: "Controles de búsqueda" },
                                        { icon: "📄", title: "Paginación", desc: "Navegación de páginas" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-4xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Estilos de Tabla</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Header BG</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.headerBgColor} onChange={e => updateTableStyle("headerBgColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.headerBgColor} onChange={e => updateTableStyle("headerBgColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Header Text</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.headerTextColor} onChange={e => updateTableStyle("headerTextColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.headerTextColor} onChange={e => updateTableStyle("headerTextColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Row BG</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.rowBgColor} onChange={e => updateTableStyle("rowBgColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.rowBgColor} onChange={e => updateTableStyle("rowBgColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Row Alt</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.rowAltColor} onChange={e => updateTableStyle("rowAltColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.rowAltColor} onChange={e => updateTableStyle("rowAltColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Border</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.borderColor} onChange={e => updateTableStyle("borderColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.borderColor} onChange={e => updateTableStyle("borderColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Hover</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={tablesData.table.hoverColor} onChange={e => updateTableStyle("hoverColor", e.target.value)} className="w-12 h-10 p-1" />
                                                <Input value={tablesData.table.hoverColor} onChange={e => updateTableStyle("hoverColor", e.target.value)} className="flex-1 font-mono text-sm bg-zinc-950" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-5xl mx-auto">
                                <div className="rounded-xl overflow-hidden border" style={{ borderColor: tablesData.table.borderColor, borderRadius: tablesData.table.borderRadius }}>
                                    <table className="w-full">
                                        <thead style={{ backgroundColor: tablesData.table.headerBgColor }}>
                                            <tr>
                                                {["Producto", "Categoría", "Precio", "Stock"].map(col => (
                                                    <th key={col} className="px-6 py-3 text-left text-sm font-semibold" style={{ color: tablesData.table.headerTextColor }}>
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sampleData.map((row, i) => (
                                                <tr key={i} style={{
                                                    backgroundColor: i % 2 === 0 ? tablesData.table.rowBgColor : tablesData.table.rowAltColor
                                                }}>
                                                    <td className="px-6 py-4 text-sm text-white border-t" style={{ borderColor: tablesData.table.borderColor }}>{row.name}</td>
                                                    <td className="px-6 py-4 text-sm text-zinc-400 border-t" style={{ borderColor: tablesData.table.borderColor }}>{row.category}</td>
                                                    <td className="px-6 py-4 text-sm text-white font-medium border-t" style={{ borderColor: tablesData.table.borderColor }}>{row.price}</td>
                                                    <td className="px-6 py-4 text-sm border-t" style={{ borderColor: tablesData.table.borderColor }}>
                                                        <span className={`px-2 py-1 rounded text-xs ${row.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                                            {row.stock > 0 ? `${row.stock} unidades` : "Agotado"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button
                                    variant="outline"
                                    className="w-full h-24 flex-col gap-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(tablesData, null, 2));
                                        toast.success("JSON copiado");
                                    }}
                                >
                                    <Download size={20} />
                                    <span>Exportar JSON</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
}

export default function TablesListsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="tablesLists"
            moduleName="Tablas & Listas"
            moduleSubtitle="Tablas de datos, listas y filtros"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <TablesListsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
