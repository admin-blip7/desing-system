/**
 * HOC para agregar capacidad de generación IA a workspaces
 *
 * Este componente wrapper facilita la integración del WorkspaceAIGenerator
 * en cualquier workspace existente.
 */

"use client";

import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { WorkspaceAIGenerator } from "./WorkspaceAIGenerator";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface WithAIGenerationProps {
    brandId: string;
    moduleKey: string;
    children: ReactNode;
    onDataGenerated?: (data: unknown) => void;
}

function normalizeGeneratedContent(data: unknown): unknown {
    if (!data || typeof data !== "object") return data;
    const record = data as Record<string, unknown>;
    if ("content" in record && record.content !== undefined) {
        return record.content;
    }
    return data;
}

async function persistGeneratedModule(
    brandId: string,
    moduleKey: string,
    generatedData: unknown
): Promise<boolean> {
    try {
        const normalizedContent = normalizeGeneratedContent(generatedData);
        const response = await fetch("/api/modules/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                brandId,
                moduleKey,
                content: normalizedContent,
                status: "completed",
            }),
        });

        if (!response.ok) {
            const errorPayload = await response
                .json()
                .catch(() => ({ error: "No se pudo guardar el contenido generado" }));
            throw new Error(errorPayload.error || "No se pudo guardar el contenido generado");
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("module-updated", {
                    detail: { brandId, moduleKey },
                })
            );
        }

        return true;
    } catch (error) {
        console.error("Error persisting generated module:", error);
        return false;
    }
}

export function WithAIGeneration({
    brandId,
    moduleKey,
    children,
    onDataGenerated
}: WithAIGenerationProps) {
    const [showAIGenerator, setShowAIGenerator] = useState(false);

    return (
        <>
            {/* AI Generator Toggle Button in header */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className="h-9 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
                <Sparkles size={14} className="mr-2" />
                Generar con IA
            </Button>

            {/* AI Generator Panel (when expanded) */}
            {showAIGenerator && (
                <div className="border-b border-zinc-800 bg-[#050505] p-4">
                    <WorkspaceAIGenerator
                        moduleKey={moduleKey}
                        brandId={brandId}
                        externalExpanded={showAIGenerator}
                        onGenerated={async (data) => {
                            const saved = await persistGeneratedModule(brandId, moduleKey, data);
                            if (!saved) {
                                toast.error("Se generó el contenido, pero no se pudo aplicar automáticamente.");
                            }
                            onDataGenerated?.(data);
                            setShowAIGenerator(false);
                        }}
                    />
                </div>
            )}

            {/* Original workspace content */}
            {children}
        </>
    );
}

/**
 * Hook para usar con BaseWorkspace - retorna headerActions y contenido
 */
export function useAIGeneration(
    brandId: string,
    moduleKey: string,
    onDataGenerated?: (data: unknown) => void
) {
    const [showAIGenerator, setShowAIGenerator] = useState(false);

    const headerActions = (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            className="h-9 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
        >
            <Sparkles size={14} className="mr-2" />
            Generar con IA
        </Button>
    );

    const aiPanel = showAIGenerator ? (
        <div className="border-b border-zinc-800 bg-[#050505] p-4">
            <WorkspaceAIGenerator
                moduleKey={moduleKey}
                brandId={brandId}
                externalExpanded={showAIGenerator}
                onGenerated={async (data) => {
                    const saved = await persistGeneratedModule(brandId, moduleKey, data);
                    if (!saved) {
                        toast.error("Se generó el contenido, pero no se pudo aplicar automáticamente.");
                    }
                    onDataGenerated?.(data);
                    setShowAIGenerator(false);
                }}
            />
        </div>
    ) : null;

    return { headerActions, aiPanel, showAIGenerator, setShowAIGenerator };
}
