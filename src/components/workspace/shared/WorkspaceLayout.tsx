"use client";

import { BrandTokens } from "@/lib/design-tokens/types";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    brandTokens?: BrandTokens;
}

export function WorkspaceLayout({ children, brandTokens }: WorkspaceLayoutProps) {
    return (
        <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
            <WorkspaceSidebar />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                {children}
            </div>
        </div>
    );
}
