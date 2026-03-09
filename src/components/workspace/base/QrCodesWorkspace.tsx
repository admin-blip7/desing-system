"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QrCode, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface QrCodeConfig {
    size: number;
    errorCorrection: "L" | "M" | "Q" | "H";
    includeLogo: boolean;
    frameStyle: "none" | "simple" | "rounded" | "fancy";
    ctaText: string;
}

interface QrCodesData {
    primaryQr: QrCodeConfig;
    codes: Array<{ id: string; name: string; url: string; type: string }>;
}

const defaultQrCodesData: QrCodesData = {
    primaryQr: {
        size: 200,
        errorCorrection: "M",
        includeLogo: true,
        frameStyle: "rounded",
        ctaText: "Escanea"
    },
    codes: [
        { id: "1", name: "WhatsApp", url: "https://wa.me/XXXXXXXXXXX", type: "contact" },
        { id: "2", name: "Web", url: "https://tusitio.com", type: "link" }
    ]
};

function QrCodesWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [qrData, setQrData] = useState<QrCodesData>(data?.content?.qrData || defaultQrCodesData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateQr = useCallback((field: keyof QrCodeConfig, value: any) => {
        setQrData(prev => ({
            ...prev,
            primaryQr: { ...prev.primaryQr, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, qrData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setQrData(data?.content?.qrData || defaultQrCodesData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><QrCode size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="generator"><Edit size={14} className="mr-2" /> Generator</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">QR Codes</h2>
                                    <p className="text-zinc-400">Estrategia y diseño de códigos QR con identidad de marca.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { title: "Contacto", icon: "📱", desc: "WhatsApp, email directo" },
                                        { title: "Links", icon: "🔗", desc: "Enlaces a sitio web" },
                                        { title: "Wi-Fi", icon: "📶", desc: "Conexión en ubicación" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                                            <div className="text-3xl mb-3">{item.icon}</div>
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="generator" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Configurar QR Principal</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-sm text-zinc-400">Tamaño (px)</Label>
                                            <Input type="number" value={qrData.primaryQr.size} onChange={e => updateQr("size", parseInt(e.target.value))} className="bg-zinc-950" />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Corrección de Error</Label>
                                            <select value={qrData.primaryQr.errorCorrection} onChange={e => updateQr("errorCorrection", e.target.value)} className="w-full bg-zinc-950">
                                                <option value="L">Bajo (7%)</option>
                                                <option value="M">Medio (15%)</option>
                                                <option value="Q">Alto (25%)</option>
                                                <option value="H">Muy alto (30%)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-zinc-400">Estilo de Frame</Label>
                                            <select value={qrData.primaryQr.frameStyle} onChange={e => updateQr("frameStyle", e.target.value)} className="w-full bg-zinc-950">
                                                <option value="none">Sin frame</option>
                                                <option value="simple">Cuadrado simple</option>
                                                <option value="rounded">Redondeado</option>
                                                <option value="fancy">Decorativo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="logo" checked={qrData.primaryQr.includeLogo} onChange={e => updateQr("includeLogo", e.target.checked)} className="w-5 h-5" />
                                        <Label htmlFor="logo" className="text-sm text-zinc-400">Incluir logo</Label>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Texto del CTA</Label>
                                        <Input value={qrData.primaryQr.ctaText} onChange={e => updateQr("ctaText", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="bg-zinc-900 rounded-xl p-8">
                                    <h3 className="text-white font-semibold mb-4">QR de Ejemplo</h3>
                                    <div className="flex justify-center">
                                        <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                                            <div className="text-6xl">📱</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 rounded-xl p-8">
                                    <h3 className="text-white font-semibold mb-4">CTA "{qrData.primaryQr.ctaText}"</h3>
                                    <div className="bg-zinc-950 rounded-xl p-8">
                                        <p className="text-zinc-500 text-sm">Este QR Code lleva a:</p>
                                        <p className="text-zinc-400 font-mono text-xs break-all">{qrData.codes[0]?.url || "https://..."}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
                                    toast.success("JSON copiado");
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

export default function QrCodesWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="qrCodes"
            moduleName="QR Codes"
            moduleSubtitle="Códigos QR branded"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <QrCodesWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
