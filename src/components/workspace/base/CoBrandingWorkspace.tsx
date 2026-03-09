"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Handshake, Edit, Eye, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface PartnerBrand {
    id: string;
    name: string;
    category: "strategic" | "sponsorship" | "supplier" | "distribution";
    logoUsage: string;
    restrictions: string[];
    guidelines: string;
}

interface CoBrandingData {
    partners: PartnerBrand[];
    principles: string[];
    doAndDont: {
        do: string[];
        dont: string[];
    };
    approvalProcess: string[];
}

const defaultCoBrandingData: CoBrandingData = {
    partners: [
        {
            id: "1",
            name: "Partner Estratégico A",
            category: "strategic",
            logoUsage: "Side-by-side con igualdad de tamaño",
            restrictions: ["No modificar colores", "Mantener espacio de seguridad"],
            guidelines: "Ambos logos con misma altura, separados por espacio mínimo igual al logo más grande"
        }
    ],
    principles: [
        "Mantener la integridad visual de ambas marcas",
        "Respetar las guías de identidad de cada partner",
        "Claridad en la comunicación conjunta"
    ],
    doAndDont: {
        do: [
            "Usar logos en versión oficial",
            "Mantener proporciones originales",
            "Incluir espacio de seguridad alrededor de los logos",
            "Colocar logos con igualdad jerárquica"
        ],
        dont: [
            "Estirar o comprimir logos",
            "Cambiar colores de los logos",
            "Aplicar efectos sobre los logos",
            "Superponer elementos sobre los logos"
        ]
    },
    approvalProcess: [
        "1. Diseñador prepara propuesta de co-branding",
        "2. Revisa cumplimiento de guías de ambas marcas",
        "3. Solicita aprobación a marketing de ambas partes",
        "4. Documenta versión aprobada y fechas de vigencia"
    ]
};

function CoBrandingWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [coBrandingData, setCoBrandingData] = useState<CoBrandingData>(data?.content?.coBrandingData || defaultCoBrandingData);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingPartner, setEditingPartner] = useState<string | null>(null);
    const [newPartner, setNewPartner] = useState<Partial<PartnerBrand>>({ restrictions: [] });

    const updateField = useCallback((field: keyof CoBrandingData, value: any) => {
        setCoBrandingData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const updatePartner = useCallback((id: string, field: keyof PartnerBrand, value: any) => {
        setCoBrandingData(prev => ({
            ...prev,
            partners: prev.partners.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
        setHasChanges(true);
    }, []);

    const addPartner = useCallback(() => {
        if (newPartner.name && newPartner.category) {
            const partner: PartnerBrand = {
                id: Date.now().toString(),
                name: newPartner.name,
                category: newPartner.category as any,
                logoUsage: newPartner.logoUsage || "",
                restrictions: newPartner.restrictions || [],
                guidelines: newPartner.guidelines || ""
            };
            setCoBrandingData(prev => ({ ...prev, partners: [...prev.partners, partner] }));
            setNewPartner({ restrictions: [] });
            setHasChanges(true);
        }
    }, [newPartner]);

    const deletePartner = useCallback((id: string) => {
        setCoBrandingData(prev => ({ ...prev, partners: prev.partners.filter(p => p.id !== id) }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, coBrandingData } });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setCoBrandingData(data?.content?.coBrandingData || defaultCoBrandingData);
        setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Handshake size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Co-Branding</h2>
                                    <p className="text-zinc-400">Guías para colaboraciones y alianzas de marca.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Socios", icon: "🤝", desc: "Partners y alianzas" },
                                        { title: "Lineamientos", icon: "📋", desc: "Uso de logos" },
                                        { title: "Aprobación", icon: "✅", desc: "Proceso de validación" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Principios</h3>
                                    <ul className="space-y-2">
                                        {coBrandingData.principles.map((principle, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className="text-green-500">✓</span>
                                                {principle}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Socios de Co-Branding</h3>
                                        <Button variant="outline" size="sm" onClick={() => setEditingPartner("new")} className="bg-zinc-800">
                                            <Plus size={14} className="mr-2" /> Agregar Partner
                                        </Button>
                                    </div>

                                    {editingPartner === "new" && (
                                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Nombre del Partner</Label>
                                                    <Input value={newPartner.name || ""} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} placeholder="Ej: Empresa X" className="bg-zinc-950" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Categoría</Label>
                                                    <select value={newPartner.category || "strategic"} onChange={e => setNewPartner({ ...newPartner, category: e.target.value as any })} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                                                        <option value="strategic">Estratégico</option>
                                                        <option value="sponsorship">Patrocinio</option>
                                                        <option value="supplier">Proveedor</option>
                                                        <option value="distribution">Distribución</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Uso del Logo</Label>
                                                <Textarea value={newPartner.logoUsage || ""} onChange={e => setNewPartner({ ...newPartner, logoUsage: e.target.value })} placeholder="Describe cómo se usan los logos juntos..." className="bg-zinc-950" rows={2} />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-zinc-500">Guías</Label>
                                                <Textarea value={newPartner.guidelines || ""} onChange={e => setNewPartner({ ...newPartner, guidelines: e.target.value })} placeholder="Lineamientos específicos..." className="bg-zinc-950" rows={2} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={addPartner} className="bg-amber-500 hover:bg-amber-600 text-white">Agregar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingPartner(null); setNewPartner({ restrictions: [] }); }}>Cancelar</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {coBrandingData.partners.map(partner => (
                                            <div key={partner.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="text-white font-medium">{partner.name}</h4>
                                                        <p className="text-sm text-zinc-500 capitalize">{partner.category}</p>
                                                    </div>
                                                    <button onClick={() => deletePartner(partner.id)} className="text-red-400 hover:text-red-300">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Uso del Logo</Label>
                                                        <Textarea value={partner.logoUsage} onChange={e => updatePartner(partner.id, "logoUsage", e.target.value)} className="bg-zinc-950" rows={2} />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Restricciones (separadas por coma)</Label>
                                                        <Input value={partner.restrictions.join(", ")} onChange={e => updatePartner(partner.id, "restrictions", e.target.value.split(", "))} className="bg-zinc-950" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Guías</Label>
                                                        <Textarea value={partner.guidelines} onChange={e => updatePartner(partner.id, "guidelines", e.target.value)} className="bg-zinc-950" rows={2} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Principios</h3>
                                    {coBrandingData.principles.map((principle, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={principle} onChange={e => {
                                                const updated = [...coBrandingData.principles];
                                                updated[i] = e.target.value;
                                                updateField("principles", updated);
                                            }} className="bg-zinc-950" />
                                            <Button variant="ghost" size="sm" onClick={() => updateField("principles", coBrandingData.principles.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("principles", [...coBrandingData.principles, ""])} className="bg-zinc-800">Agregar principio</Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-green-400 font-semibold">✓ DO</h3>
                                        {coBrandingData.doAndDont.do.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input value={item} onChange={e => {
                                                    const updated = [...coBrandingData.doAndDont.do];
                                                    updated[i] = e.target.value;
                                                    updateField("doAndDont", { ...coBrandingData.doAndDont, do: updated });
                                                }} className="bg-zinc-950" />
                                                <Button variant="ghost" size="sm" onClick={() => updateField("doAndDont", { ...coBrandingData.doAndDont, do: coBrandingData.doAndDont.do.filter((_, idx) => idx !== i) })} className="text-red-400">×</Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => updateField("doAndDont", { ...coBrandingData.doAndDont, do: [...coBrandingData.doAndDont.do, ""] })} className="bg-zinc-800">+</Button>
                                    </div>

                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                        <h3 className="text-red-400 font-semibold">✗ DON'T</h3>
                                        {coBrandingData.doAndDont.dont.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input value={item} onChange={e => {
                                                    const updated = [...coBrandingData.doAndDont.dont];
                                                    updated[i] = e.target.value;
                                                    updateField("doAndDont", { ...coBrandingData.doAndDont, dont: updated });
                                                }} className="bg-zinc-950" />
                                                <Button variant="ghost" size="sm" onClick={() => updateField("doAndDont", { ...coBrandingData.doAndDont, dont: coBrandingData.doAndDont.dont.filter((_, idx) => idx !== i) })} className="text-red-400">×</Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => updateField("doAndDont", { ...coBrandingData.doAndDont, dont: [...coBrandingData.doAndDont.dont, ""] })} className="bg-zinc-800">+</Button>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Proceso de Aprobación</h3>
                                    {coBrandingData.approvalProcess.map((step, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-zinc-500 w-6 text-center">{i + 1}.</span>
                                            <Input value={step} onChange={e => {
                                                const updated = [...coBrandingData.approvalProcess];
                                                updated[i] = e.target.value;
                                                updateField("approvalProcess", updated);
                                            }} className="bg-zinc-950 flex-1" />
                                            <Button variant="ghost" size="sm" onClick={() => updateField("approvalProcess", coBrandingData.approvalProcess.filter((_, idx) => idx !== i))} className="text-red-400">×</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => updateField("approvalProcess", [...coBrandingData.approvalProcess, ""])} className="bg-zinc-800">Agregar paso</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Partners Configurados</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {coBrandingData.partners.map(partner => (
                                            <div key={partner.id} className="bg-zinc-950 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                                        <Handshake className="text-zinc-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{partner.name}</h4>
                                                        <p className="text-xs text-zinc-500 capitalize">{partner.category}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-zinc-400">{partner.logoUsage}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 rounded-xl p-6">
                                        <h3 className="text-green-400 font-semibold mb-4">✓ DO</h3>
                                        <ul className="space-y-2">
                                            {coBrandingData.doAndDont.do.map((item, i) => (
                                                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                    <span className="text-green-500 mt-0.5">✓</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-zinc-900 rounded-xl p-6">
                                        <h3 className="text-red-400 font-semibold mb-4">✗ DON'T</h3>
                                        <ul className="space-y-2">
                                            {coBrandingData.doAndDont.dont.map((item, i) => (
                                                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                    <span className="text-red-500 mt-0.5">✗</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Proceso de Aprobación</h3>
                                    <ol className="space-y-3">
                                        {coBrandingData.approvalProcess.map((step, i) => (
                                            <li key={i} className="flex gap-3">
                                                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">{i + 1}</span>
                                                <p className="text-zinc-300 text-sm">{step}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(coBrandingData, null, 2));
                                    toast.success("JSON copiado al portapapeles");
                                }}>
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

export default function CoBrandingWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="coBranding"
            moduleName="Co-Branding"
            moduleSubtitle="Guías para colaboraciones de marca"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <CoBrandingWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
