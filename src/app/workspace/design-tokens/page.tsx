import { Suspense } from "react";
import { redirect } from "next/navigation";
import DesignTokensWorkspace from "@/components/workspace/base/DesignTokensWorkspace";

export default function DesignTokensPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DesignTokensContent searchParams={searchParams} />
        </Suspense>
    );
}

async function DesignTokensContent({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    const { brandId } = await searchParams;

    if (!brandId) {
        redirect("/dashboard");
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DesignTokensWorkspace brandId={brandId} />
        </Suspense>
    );
}
