/**
 * Integration Selection Page (Stage 5)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdentityFlowStore, useCanProceedToIntegrations } from "@/lib/stores/identityFlowStore";
import IntegrationSelector from "@/components/identity/IntegrationSelector";

export default function IntegrationsPage() {
    const router = useRouter();
    const canProceed = useCanProceedToIntegrations();

    // Redirect to workspaces if not ready
    useEffect(() => {
        if (!canProceed) {
            router.push("/identity/workspaces");
        }
    }, [canProceed, router]);

    return <IntegrationSelector />;
}
