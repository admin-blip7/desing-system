/**
 * Identity Workspace Hub Page (Stage 4)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdentityFlowStore, useGenerationStatus, useGeneratedIdentity } from "@/lib/stores/identityFlowStore";
import WorkspaceHub from "@/components/identity/WorkspaceHub";

export default function WorkspacesPage() {
    const router = useRouter();
    const generationStatus = useGenerationStatus();
    const generatedIdentity = useGeneratedIdentity();

    // Redirect to generation if not complete
    useEffect(() => {
        if (generationStatus !== "complete" && !generatedIdentity) {
            router.push("/identity/generate");
        }
    }, [generationStatus, generatedIdentity, router]);

    return <WorkspaceHub />;
}
