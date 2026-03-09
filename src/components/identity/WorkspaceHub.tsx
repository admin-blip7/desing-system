/**
 * Identity Workspace Hub
 * Manages workspace flows for completing missing identity components
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, ChevronRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useWorkspaceFlow,
    useGeneratedIdentity,
    useCanProceedToIntegrations,
} from "@/lib/stores/identityFlowStore";
import type { WorkspaceType, PreIdentityGeneration } from "@/types/identity";

interface WorkspaceCard {
    type: WorkspaceType;
    name: string;
    description: string;
    estimatedTime: string;
    icon: string;
    required: boolean;
    status: "completed" | "in-progress" | "pending";
}

export default function WorkspaceHub() {
    const router = useRouter();
    const generatedIdentity = useGeneratedIdentity();
    const workspaceFlow = useWorkspaceFlow();
    const canProceed = useCanProceedToIntegrations();

    const { completeStage, goToStage } = useIdentityFlowStore();

    const [isLoading, setIsLoading] = useState(true);

    // Calculate available workspaces from gap analysis
    const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);

    useEffect(() => {
        if (!generatedIdentity?.gap_analysis) {
            setIsLoading(false);
            return;
        }

        const { gap_analysis } = generatedIdentity;

        // Map gap analysis to workspaces
        const workspaceMap: Record<string, Omit<WorkspaceCard, "status">> = {
            "visual-identity": {
                type: "visual-identity",
                name: "Identidad Visual",
                description: "Refina colores, tipografía y logo",
                estimatedTime: "~10 min",
                icon: "🎨",
                required: true,
            },
            "brand-voice": {
                type: "brand-voice",
                name: "Voz de Marca",
                description: "Define tono y estilo de comunicación",
                estimatedTime: "~10 min",
                icon: "💬",
                required: true,
            },
            "experience-design": {
                type: "experience-design",
                name: "Experiencia de Marca",
                description: "Mapa de touchpoints y experiencia del cliente",
                estimatedTime: "~15 min",
                icon: "✨",
                required: gap_analysis.recommended_workspaces.includes("experience-design"),
            },
            "social-media-kit": {
                type: "social-media-kit",
                name: "Kit de Redes Sociales",
                description: "Plantillas para posts, historias y más",
                estimatedTime: "~10 min",
                icon: "📱",
                required: false,
            },
            "print-templates": {
                type: "print-templates",
                name: "Plantillas de Impresión",
                description: "Tarjetas, folletos y materiales impresos",
                estimatedTime: "~15 min",
                icon: "📄",
                required: false,
            },
            "digital-ui-kit": {
                type: "digital-ui-kit",
                name: "UI Kit Digital",
                description: "Componentes de interfaz para web/app",
                estimatedTime: "~20 min",
                icon: "💻",
                required: false,
            },
        };

        // Determine which workspaces to show
        const recommended = gap_analysis.recommended_workspaces || [];
        const availableWorkspaces: WorkspaceCard[] = [];

        // Always add required workspaces
        availableWorkspaces.push({
            ...workspaceMap["visual-identity"],
            status: getWorkspaceStatus("visual-identity"),
        });
        availableWorkspaces.push({
            ...workspaceMap["brand-voice"],
            status: getWorkspaceStatus("brand-voice"),
        });

        // Add recommended workspaces
        recommended.forEach((type) => {
            if (type !== "visual-identity" && type !== "brand-voice") {
                availableWorkspaces.push({
                    ...workspaceMap[type],
                    status: getWorkspaceStatus(type as WorkspaceType),
                });
            }
        });

        // Add optional workspaces
        availableWorkspaces.push({
            ...workspaceMap["social-media-kit"],
            status: getWorkspaceStatus("social-media-kit"),
        });
        availableWorkspaces.push({
            ...workspaceMap["print-templates"],
            status: getWorkspaceStatus("print-templates"),
        });
        availableWorkspaces.push({
            ...workspaceMap["digital-ui-kit"],
            status: getWorkspaceStatus("digital-ui-kit"),
        });

        setWorkspaces(availableWorkspaces);
        setIsLoading(false);
    }, [generatedIdentity, workspaceFlow]);

    const getWorkspaceStatus = (type: WorkspaceType): WorkspaceCard["status"] => {
        if (workspaceFlow.current_workspace === type) return "in-progress";
        if (workspaceFlow.completed_workspaces.includes(type)) return "completed";
        return "pending";
    };

    const requiredWorkspaces = workspaces.filter((w) => w.required);
    const optionalWorkspaces = workspaces.filter((w) => !w.required);
    const progressPercentage = workspaceFlow.progress_percentage;

    const handleWorkspaceClick = (type: WorkspaceType) => {
        router.push(`/identity/workspaces/${type}`);
    };

    const handleContinueToIntegrations = () => {
        completeStage(4);
        router.push("/identity/integrations");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--bm-color-accent)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
            {/* Header */}
            <div className="border-b border-[var(--bm-color-border)] bg-[color-mix(in_srgb,var(--bm-color-bg)_85%,transparent)] backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[9px] tracking-[0.3em] uppercase font-medium text-[var(--bm-color-text-secondary)]">
                                Flujo de Identidad
                            </div>
                            <h1 className="text-2xl font-light mt-1">Completa tu Identidad</h1>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-xs text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] transition-colors"
                        >
                            Guardar y salir
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Progress Overview */}
                <div className="mb-10 p-6 rounded-xl border bg-[var(--bm-color-surface-muted)]/20 border-[var(--bm-color-border)]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-medium">Progreso de Completación</h2>
                            <p className="text-sm text-[var(--bm-color-text-secondary)]">
                                Completa los workspaces requeridos para finalizar tu identidad
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-light text-[var(--bm-color-accent)]">
                                {progressPercentage}%
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 rounded-full overflow-hidden bg-[var(--bm-color-surface-muted)]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--bm-color-accent)] to-[var(--bm-color-accent-muted)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mt-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[var(--bm-color-text-secondary)]">
                                {workspaceFlow.completed_workspaces.length} completados
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--bm-color-accent)] animate-pulse" />
                            <span className="text-[var(--bm-color-text-secondary)]">
                                {requiredWorkspaces.length - workspaceFlow.completed_workspaces.filter(w =>
                                    requiredWorkspaces.map(rw => rw.type).includes(w)
                                ).length} pendientes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Required Workspaces */}
                <div className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
                        Workspaces Requeridos
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requiredWorkspaces.map((workspace) => (
                            <WorkspaceCardComponent
                                key={workspace.type}
                                workspace={workspace}
                                onClick={() => handleWorkspaceClick(workspace.type)}
                            />
                        ))}
                    </div>
                </div>

                {/* Optional Workspaces */}
                {optionalWorkspaces.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
                            Workspaces Opcionales
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {optionalWorkspaces.map((workspace) => (
                                <WorkspaceCardComponent
                                    key={workspace.type}
                                    workspace={workspace}
                                    onClick={() => handleWorkspaceClick(workspace.type)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleContinueToIntegrations}
                        disabled={!canProceed}
                        className={cn(
                            "px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            canProceed
                                ? "bg-[var(--bm-button-primary-bg)] text-[var(--bm-button-primary-text)] border border-[var(--bm-button-primary-border)] hover:opacity-90 shadow-lg"
                                : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] cursor-not-allowed opacity-60"
                        )}
                    >
                        {canProceed ? (
                            <>
                                Continuar a Integraciones
                                <ChevronRight size={16} />
                            </>
                        ) : (
                            "Completa los workspaces requeridos para continuar"
                        )}
                    </button>
                </div>

                {/* Warning if optional workspaces remaining */}
                {canProceed &&
                    optionalWorkspaces.some((w) => w.status !== "completed") && (
                        <p className="text-center text-xs text-[var(--bm-color-text-secondary)] mt-4">
                            Tienes workspaces opcionales pendientes. Puedes completarlos después
                            desde el dashboard.
                        </p>
                    )}
            </div>
        </div>
    );
}

interface WorkspaceCardProps {
    workspace: WorkspaceCard;
    onClick: () => void;
}

function WorkspaceCardComponent({ workspace, onClick }: WorkspaceCardProps) {
    const getStatusIcon = () => {
        switch (workspace.status) {
            case "completed":
                return <Check className="w-5 h-5 text-emerald-500" />;
            case "in-progress":
                return <Loader2 className="w-5 h-5 text-[var(--bm-color-accent)] animate-spin" />;
            default:
                return <Circle className="w-5 h-5 text-[var(--bm-color-text-secondary)]/30" />;
        }
    };

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ y: -2 }}
            className={cn(
                "p-5 rounded-xl border text-left transition-all w-full",
                workspace.status === "completed"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : workspace.status === "in-progress"
                    ? "bg-[var(--bm-color-accent)]/10 border-[var(--bm-color-accent)]/30"
                    : "bg-[var(--bm-color-surface-muted)]/20 border-[var(--bm-color-border)] hover:border-[var(--bm-color-border-strong)]"
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{workspace.icon}</span>
                {getStatusIcon()}
            </div>

            <h4 className="text-sm font-medium mb-1">{workspace.name}</h4>
            <p className="text-xs text-[var(--bm-color-text-secondary)] mb-3">
                {workspace.description}
            </p>

            <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--bm-color-text-secondary)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workspace.estimatedTime}
                </span>
                {workspace.required && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--bm-color-accent)]/10 text-[var(--bm-color-accent)]">
                        Requerido
                    </span>
                )}
            </div>
        </motion.button>
    );
}
