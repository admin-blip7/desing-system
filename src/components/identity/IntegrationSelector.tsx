/**
 * Integration Selector
 * Guide users to next actions after identity completion
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, ExternalLink, Share2, FolderOpen, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    useIdentityFlowStore,
    useSelectedIdentity,
    useQuestionnaireData,
} from "@/lib/stores/identityFlowStore";
import type { IntegrationSelection, IntegrationType } from "@/types/identity";

interface IntegrationOption {
    id: IntegrationType;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: "export" | "tools" | "create";
    comingSoon?: boolean;
}

const INTEGRATIONS: IntegrationOption[] = [
    // Export Options
    {
        id: "export-pdf",
        name: "Exportar PDF",
        description: "Genera un manual de marca completo en PDF",
        icon: <Download className="w-5 h-5" />,
        category: "export",
    },
    {
        id: "export-html",
        name: "Exportar HTML",
        description: "Manual interactivo para web",
        icon: <ExternalLink className="w-5 h-5" />,
        category: "export",
    },
    {
        id: "export-tokens",
        name: "Design Tokens",
        description: "Exporta tokens JSON, CSS, SCSS",
        icon: <FolderOpen className="w-5 h-5" />,
        category: "export",
    },
    // Tool Integrations
    {
        id: "figma",
        name: "Figma",
        description: "Sincroniza colores, tipografía y componentes",
        icon: "🎨",
        category: "tools",
        comingSoon: true,
    },
    {
        id: "notion",
        name: "Notion",
        description: "Crea documentación en tu workspace",
        icon: "📝",
        category: "tools",
        comingSoon: true,
    },
    {
        id: "adobe-cc",
        name: "Adobe CC",
        description: "Librerías de Creative Cloud",
        icon: "🎭",
        category: "tools",
        comingSoon: true,
    },
    // Creation Flows
    {
        id: "webflow",
        name: "Crear Landing Page",
        description: "Genera una página con tu identidad",
        icon: <Wand2 className="w-5 h-5" />,
        category: "create",
        comingSoon: true,
    },
];

export default function IntegrationSelector() {
    const router = useRouter();
    const selectedIdentity = useSelectedIdentity();
    const questionnaireData = useQuestionnaireData();

    const { setIntegrationSelection, completeStage, reset } = useIdentityFlowStore();

    const [selectedIntegrations, setSelectedIntegrations] = useState<IntegrationType[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const exportOptions = INTEGRATIONS.filter((i) => i.category === "export");
    const toolOptions = INTEGRATIONS.filter((i) => i.category === "tools");
    const createOptions = INTEGRATIONS.filter((i) => i.category === "create");

    const handleIntegrationToggle = (id: IntegrationType) => {
        setSelectedIntegrations((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setIsProcessing(true);

        const selection: IntegrationSelection = {
            selected_integrations: selectedIntegrations,
            export_preferences: {
                formats: selectedIntegrations
                    .filter((i) => i.startsWith("export-"))
                    .map((i) => i.replace("export-", "") as "pdf" | "html" | "json" | "css"),
                include_sections: ["all"],
            },
            tool_connections: [],
            next_actions: [],
            completion_timestamp: new Date().toISOString(),
        };

        setIntegrationSelection(selection);
        completeStage(5);

        // Show success message
        toast.success("¡Flujo de identidad completado!");

        // Reset flow for next identity (optional)
        // setTimeout(() => reset(), 2000);

        setIsProcessing(false);

        // Navigate to dashboard
        setTimeout(() => {
            router.push("/dashboard");
        }, 1000);
    };

    const handleExportDirect = async (type: "pdf" | "html" | "tokens") => {
        toast.info(`Generando exportación ${type.toUpperCase()}...`);
        // Would trigger actual export here
    };

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
            {/* Header */}
            <div className="border-b border-[var(--bm-color-border)] bg-gradient-to-b from-[var(--bm-color-accent)]/5 to-transparent">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-8 h-8 text-emerald-500" />
                        </div>

                        <h1 className="text-3xl font-light mb-3">
                            ¡Tu Identidad Está Lista!
                        </h1>

                        <p className="text-[var(--bm-color-text-secondary)] max-w-md mx-auto">
                            La identidad de{" "}
                            <span className="font-medium text-[var(--bm-color-text-primary)]">
                                {questionnaireData?.brand_name || "tu marca"}
                            </span>{" "}
                            ha sido generada con éxito basada en{" "}
                            <span className="font-medium text-[var(--bm-color-text-primary)]">
                                {selectedIdentity?.identity_name}
                            </span>
                            .
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Export Options */}
                <section className="mb-12">
                    <h2 className="text-lg font-medium mb-2">Exportar Identidad</h2>
                    <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                        Descarga tu identidad en diferentes formatos
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exportOptions.map((option) => (
                            <IntegrationCard
                                key={option.id}
                                option={option}
                                selected={selectedIntegrations.includes(option.id)}
                                onSelect={() => handleIntegrationToggle(option.id)}
                                onDirectAction={() => {
                                    if (option.id === "export-pdf") handleExportDirect("pdf");
                                    if (option.id === "export-html") handleExportDirect("html");
                                    if (option.id === "export-tokens") handleExportDirect("tokens");
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Tool Integrations */}
                <section className="mb-12">
                    <h2 className="text-lg font-medium mb-2">Conectar Herramientas</h2>
                    <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                        Sincroniza tu identidad con tus herramientas favoritas
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {toolOptions.map((option) => (
                            <IntegrationCard
                                key={option.id}
                                option={option}
                                selected={selectedIntegrations.includes(option.id)}
                                onSelect={() => {
                                    if (option.comingSoon) {
                                        toast.info("Próximamente disponible");
                                        return;
                                    }
                                    handleIntegrationToggle(option.id);
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Creation Flows */}
                <section className="mb-12">
                    <h2 className="text-lg font-medium mb-2">Crear con tu Identidad</h2>
                    <p className="text-sm text-[var(--bm-color-text-secondary)] mb-6">
                        Genera assets y materiales con tu nueva identidad
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {createOptions.map((option) => (
                            <IntegrationCard
                                key={option.id}
                                option={option}
                                selected={selectedIntegrations.includes(option.id)}
                                onSelect={() => {
                                    if (option.comingSoon) {
                                        toast.info("Próximamente disponible");
                                        return;
                                    }
                                    handleIntegrationToggle(option.id);
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Share Option */}
                <section className="mb-12">
                    <div className="p-6 rounded-xl border bg-[var(--bm-color-surface-muted)]/20 border-[var(--bm-color-border)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bm-color-accent)]/20 flex items-center justify-center">
                                    <Share2 className="w-5 h-5 text-[var(--bm-color-accent)]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Compartir Identidad</h3>
                                    <p className="text-xs text-[var(--bm-color-text-secondary)]">
                                        Genera un enlace para compartir con tu equipo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => toast.info("Link copiado al portapapeles")}
                                className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)]/50 transition-colors"
                            >
                                Copiar Link
                            </button>
                        </div>
                    </div>
                </section>

                {/* Complete Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleComplete}
                        disabled={isProcessing}
                        className={cn(
                            "px-8 py-3 rounded-lg text-sm font-bold transition-all",
                            isProcessing
                                ? "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] cursor-not-allowed"
                                : "bg-[var(--bm-button-primary-bg)] text-[var(--bm-button-primary-text)] hover:opacity-90 shadow-lg"
                        )}
                    >
                        {isProcessing ? "Completando..." : "Finalizar y al Dashboard"}
                    </button>
                </div>

                {/* Additional Actions */}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => router.push("/identity/workspaces")}
                        className="text-xs text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] transition-colors"
                    >
                        Volver a Workspaces
                    </button>
                    <span className="text-[var(--bm-color-text-secondary)]/30">•</span>
                    <button
                        onClick={() => {
                            reset();
                            router.push("/identity");
                        }}
                        className="text-xs text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)] transition-colors"
                    >
                        Crear Nueva Identidad
                    </button>
                </div>
            </div>
        </div>
    );
}

interface IntegrationCardProps {
    option: IntegrationOption;
    selected: boolean;
    onSelect: () => void;
    onDirectAction?: () => void;
}

function IntegrationCard({ option, selected, onSelect, onDirectAction }: IntegrationCardProps) {
    const isExport = option.category === "export";

    return (
        <motion.button
            onClick={isExport && onDirectAction ? onDirectAction : onSelect}
            whileHover={{ y: -2 }}
            disabled={option.comingSoon}
            className={cn(
                "p-5 rounded-xl border text-left transition-all relative",
                selected
                    ? "bg-[var(--bm-color-accent)]/10 border-[var(--bm-color-accent)]/50"
                    : "bg-[var(--bm-color-surface-muted)]/20 border-[var(--bm-color-border)] hover:border-[var(--bm-color-border-strong)]",
                option.comingSoon && "opacity-60"
            )}
        >
            {option.comingSoon && (
                <span className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]">
                    Próximamente
                </span>
            )}

            <div className="flex items-center gap-3 mb-3">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selected
                            ? "bg-[var(--bm-color-accent)]/20 text-[var(--bm-color-accent)]"
                            : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
                    )}
                >
                    {option.icon}
                </div>
                {selected && !isExport && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[var(--bm-color-accent)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            <h4 className="text-sm font-medium mb-1">{option.name}</h4>
            <p className="text-xs text-[var(--bm-color-text-secondary)]">
                {option.description}
            </p>
        </motion.button>
    );
}
