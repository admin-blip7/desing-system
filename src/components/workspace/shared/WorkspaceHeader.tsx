"use client";

import Link from "next/link";
import { ArrowLeft, Save, Loader2, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
    title: string;
    subtitle?: string;
    status: string;
    onSave: () => void;
    isSaving: boolean;
    backLink?: string;
    backText?: string;
    actions?: React.ReactNode; // New: additional actions (like AI Generate button)
}

export function WorkspaceHeader({
    title,
    subtitle,
    status,
    onSave,
    isSaving,
    backLink,
    backText = "Volver",
    actions,
}: WorkspaceHeaderProps) {

    const getStatusInfo = (s: string) => {
        switch (s) {
            case "completed":
                return { label: "Completado", icon: Check, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
            case "in_progress":
                return { label: "En Progreso", icon: Clock, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
            case "pending":
            default:
                return { label: "Pendiente", icon: Clock, color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20" };
        }
    };

    const statusInfo = getStatusInfo(status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="h-16 px-6 border-b border-zinc-800 bg-[#050505] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                {backLink && (
                    <Link
                        href={backLink}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                )}

                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-medium text-white">{title}</h1>
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                            <StatusIcon size={12} />
                            {statusInfo.label}
                        </div>
                    </div>
                    {subtitle && (
                        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Additional actions (like AI Generate button) */}
                {actions}

                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    variant="outline"
                    size="sm"
                    className="h-9 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save size={14} className="mr-2" />
                            Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
