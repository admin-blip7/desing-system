"use client";

import React from "react";
import { useModulePersistence } from "@/lib/hooks/useModulePersistence";
import { useBrandTokens } from "@/lib/hooks/useBrandTokens";
import { WorkspaceLayout } from "./WorkspaceLayout";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface BaseWorkspaceProps {
    brandId: string;
    moduleKey: string;
    moduleName: string;
    moduleSubtitle?: string;
    backLink?: string;
    customSave?: () => Promise<boolean>;  // Custom save handler for special workspaces
    headerActions?: React.ReactNode;  // Actions to show in header (like AI Generate button)
    children: (props: WorkspaceContentProps) => React.ReactNode;
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">Cargando workspace...</p>
            </div>
        </div>
    );
}

export function BaseWorkspace({
    brandId,
    moduleKey,
    moduleName,
    moduleSubtitle,
    backLink,
    customSave,
    headerActions,
    children
}: BaseWorkspaceProps) {
    const {
        data,
        status,
        isSaving,
        isLoading: isModuleLoading,
        saveModule,
        updateStatus
    } = useModulePersistence(brandId, moduleKey);

    const {
        brandTokens,
        isLoading: isTokensLoading
    } = useBrandTokens(brandId);

    const isLoading = isModuleLoading || isTokensLoading;

    const handleSave = async () => {
        if (customSave) {
            return await customSave();
        }
        return await saveModule(data);
    };

    // Render children with loading fallback to maintain consistent hook order
    const renderChildren = () => {
        if (isLoading && !data) {
            return <LoadingState />;
        }
        return children({
            data,
            status,
            saveModule,
            updateStatus,
            brandTokens,
        });
    };

    return (
        <WorkspaceLayout brandTokens={brandTokens}>
            <WorkspaceHeader
                title={moduleName}
                subtitle={moduleSubtitle}
                status={status}
                onSave={handleSave}
                isSaving={isSaving}
                backLink={backLink || `/dashboard/brands/${brandId}`}
                actions={headerActions}
            />

            <div className="flex-1 min-h-0 bg-[#0A0A0A]">
                {renderChildren()}
            </div>
        </WorkspaceLayout>
    );
}
