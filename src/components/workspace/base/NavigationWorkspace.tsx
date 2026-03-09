"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Edit, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface NavItem {
    label: string;
    href: string;
    active?: boolean;
}

interface NavigationData {
    header: {
        logo: string;
        links: NavItem[];
        cta?: { label: string; href: string };
    };
    footer: NavItem[];
    mobile: {
        menuButton: string;
        drawerLinks: NavItem[];
    };
}

const defaultNavigationData: NavigationData = {
    header: {
        logo: "Brand Logo",
        links: [
            { label: "Inicio", href: "/", active: true },
            { label: "Productos", href: "/productos" },
            { label: "Servicios", href: "/servicios" },
            { label: "Contacto", href: "/contacto" }
        ],
        cta: { label: "Empezar", href: "/empezar" }
    },
    footer: [
        { label: "Sobre Nosotros", href: "/sobre" },
        { label: "Privacy", href: "/privacy" },
        { label: "Términos", href: "/terminos" }
    ],
    mobile: {
        menuButton: "☰",
        drawerLinks: [
            { label: "Inicio", href: "/" },
            { label: "Productos", href: "/productos" },
            { label: "Servicios", href: "/servicios" },
            { label: "Contacto", href: "/contacto" }
        ]
    }
};

function NavigationWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [navData, setNavData] = useState<NavigationData>(
        data?.content?.navData || defaultNavigationData
    );
    const [hasChanges, setHasChanges] = useState(false);

    const updateHeader = useCallback((field: string, value: any) => {
        setNavData(prev => ({
            ...prev,
            header: { ...prev.header, [field]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({ ...data, content: { ...data?.content, navData } });
        if (success) setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setNavData(data?.content?.navData || defaultNavigationData)}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><Menu size={14} className="mr-2" /> Resumen</TabsTrigger>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">Sistema de Navegación</h2>
                                    <p className="text-zinc-400">Define header, footer y navegación móvil para tu sitio.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { title: "Header Principal", icon: "📍", desc: "Logo + links + CTA" },
                                        { title: "Navegación Móvil", icon: "📱", desc: "Menú drawer tipo hamburguesa" },
                                        { title: "Footer", icon: "🔗", desc: "Links secundarios y legal" }
                                    ].map(item => (
                                        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                            <div className="text-3xl mb-3">{item.icon}</div>
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
                                    <h3 className="text-white font-semibold">Header</h3>
                                    <div>
                                        <Label className="text-sm text-zinc-400">Logo Texto</Label>
                                        <Input value={navData.header.logo} onChange={e => updateHeader("logo", e.target.value)} className="bg-zinc-950" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400 mb-2">Links</Label>
                                        <div className="space-y-2">
                                            {navData.header.links.map((link, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Input value={link.label} onChange={e => {
                                                        const newLinks = [...navData.header.links];
                                                        newLinks[i].label = e.target.value;
                                                        updateHeader("links", newLinks);
                                                    }} placeholder="Label" className="bg-zinc-950" />
                                                    <Input value={link.href} onChange={e => {
                                                        const newLinks = [...navData.header.links];
                                                        newLinks[i].href = e.target.value;
                                                        updateHeader("links", newLinks);
                                                    }} placeholder="URL" className="bg-zinc-950" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-zinc-400">CTA Label</Label>
                                        <Input value={navData.header.cta?.label || ""} onChange={e => updateHeader("cta", { ...navData.header.cta, label: e.target.value })} className="bg-zinc-950" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-t-xl p-4 flex items-center justify-between shadow-lg">
                                    <span className="text-lg font-bold text-zinc-900">{navData.header.logo}</span>
                                    <nav className="hidden md:flex gap-6">
                                        {navData.header.links.map(link => (
                                            <a key={link.href} href={link.href} className={`text-sm ${link.active ? "text-blue-600 font-medium" : "text-zinc-600"}`}>
                                                {link.label}
                                            </a>
                                        ))}
                                    </nav>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                                                        {navData.header.cta?.label || "CTA"}
                                                                    </button>
                                                                </div>
                                                                <div className="bg-zinc-100 rounded-b-xl p-4">
                                                                    <div className="flex gap-6 text-sm text-zinc-600">
                                                                        {navData.footer.map(link => (
                                                                            <a key={link.href} href={link.href}>{link.label}</a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-4">
                                                                <Button variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => {
                                                                    navigator.clipboard.writeText(JSON.stringify(navData, null, 2));
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

export default function NavigationWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="navigation"
            moduleName="Navegación"
            moduleSubtitle="Header, footer y navegación móvil"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <NavigationWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
