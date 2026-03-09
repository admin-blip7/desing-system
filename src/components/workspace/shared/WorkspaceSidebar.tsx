"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Palette,
    Type,
    Layout,
    Box,
    Image as ImageIcon,
    PenTool,
    Smile,
    Share2,
    ChevronRight,
    User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

const sections: SidebarSection[] = [
    {
        title: "Esenciales",
        items: [
            { title: "Design Tokens", href: "/workspace/design-tokens", icon: Palette },
            // { title: "Tokens de Marca", href: "/workspace/brand-tokens", icon: Palette }, // Redundant?
            { title: "Logotipo", href: "/workspace/logo", icon: Box },
            { title: "Color", href: "/workspace/color-palette", icon: Palette },
            { title: "Tipografía", href: "/workspace/typography", icon: Type },
            { title: "UI Kit", href: "/workspace/ui-kit", icon: Layout },
        ]
    },
    {
        title: "Identidad",
        items: [
            { title: "Historia", href: "/workspace/brand-story", icon: PenTool },
            { title: "Voz y Tono", href: "/workspace/voice-tone", icon: Smile },
            { title: "Personas", href: "/workspace/customer-personas", icon: UserIcon },
        ]
    },
    {
        title: "Visual",
        items: [
            { title: "Fotografía", href: "/workspace/photography", icon: ImageIcon },
            { title: "Ilustración", href: "/workspace/illustration", icon: PenTool },
            { title: "Iconografía", href: "/workspace/iconography", icon: Smile },
            { title: "Motion", href: "/workspace/motion", icon: Share2 },
        ]
    }
];

export function WorkspaceSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const brandId = searchParams.get("brandId");

    return (
        <aside className="w-64 border-r border-zinc-800 bg-[#050505] flex flex-col h-full shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                <Link
                    href={brandId ? `/dashboard/brands/${brandId}` : "/dashboard"}
                    className="flex items-center gap-2 font-medium text-zinc-200 hover:text-white transition-colors"
                >
                    <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-black text-xs font-bold">
                        BM
                    </div>
                    Brand Manual
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                            {section.title}
                        </h3>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                const Icon = item.icon;

                                // Construct href with brandId if present
                                const href = brandId
                                    ? `${item.href}?brandId=${brandId}`
                                    : item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group",
                                            isActive
                                                ? "bg-zinc-900 text-white font-medium"
                                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                                        )}
                                    >
                                        <Icon size={16} className={cn(
                                            "transition-colors",
                                            isActive ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400"
                                        )} />
                                        {item.title}
                                        {isActive && <ChevronRight size={14} className="ml-auto text-zinc-600" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
