"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface CartStep {
    id: string;
    title: string;
    description: string;
}

interface CartData {
    cartButtonColor: string;
    checkoutSteps: CartStep[];
    paymentMethods: string[];
}

const defaultCartData: CartData = {
    cartButtonColor: "#3B82F6",
    checkoutSteps: [
        { id: "1", title: "Carrito", description: "Revisa tus productos" },
        { id: "2", title: "Envío", description: "Elige método de envío" },
        { id: "3", title: "Pago", description: "Completa el pago" },
        { id: "4", title: "Confirmación", description: "¡Pedido completado!" }
    ],
    paymentMethods: ["Tarjeta", "Efectivo", "Transferencia", "Mercado Pago"]
};

function CartCheckoutWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [cartData, setCartData] = useState<CartData>(data?.content?.cartData || defaultCartData);
    const [hasChanges, setHasChanges] = useState(false);

    const updateConfig = useCallback((field: keyof CartData, value: any) => {
        setCartData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, cartData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCartData(data?.content?.cartData || defaultCartData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><ShoppingCart size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Carrito & Checkout</h2>
                                    <p className="text-zinc-400">Flujo completo de compra, pago y confirmación.</p>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Pasos del Checkout</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {cartData.checkoutSteps.map((step, i) => (
                                            <div key={step.id} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: cartData.cartButtonColor, color: "#fff" }}>
                                                    {i + 1}
                                                </div>
                                                <div className="bg-zinc-950 px-3 py-2 rounded-lg">
                                                    <p className="text-white text-sm font-medium">{step.title}</p>
                                                    <p className="text-zinc-500 text-xs">{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold">Configurar Checkout</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Color de Botón CTA</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={cartData.cartButtonColor} onChange={e => updateConfig("cartButtonColor", e.target.value)} className="w-12 h-10" />
                                            <Input value={cartData.cartButtonColor} onChange={e => updateConfig("cartButtonColor", e.target.value)} className="flex-1 font-mono text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl p-8">
                                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">Tu Carrito</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(item => (
                                            <div key={item} className="flex items-center gap-4 p-4 bg-zinc-100 rounded-lg">
                                                <div className="w-16 h-16 bg-zinc-300 rounded"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-zinc-900">Producto {item}</p>
                                                    <p className="text-sm text-zinc-600">$99.00</p>
                                                </div>
                                                <button className="text-red-500 text-sm">Eliminar</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t flex justify-between items-center">
                                        <div className="text-xl font-bold">Total: $297.00</div>
                                        <button className="px-6 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: cartData.cartButtonColor }}>
                                            Proceder al Pago
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto">
                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(cartData, null, 2));
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

export default function CartCheckoutWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="cartCheckout"
            moduleName="Carrito & Checkout"
            moduleSubtitle="Flujo de compra, pago y confirmación"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <CartCheckoutWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
