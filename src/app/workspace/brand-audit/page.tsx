import { Suspense } from "react";
import { redirect } from "next/navigation";
import BrandAuditWorkspace from "@/components/workspace/base/BrandAuditWorkspace";

export default function BrandAuditPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrandAuditContent searchParams={searchParams} />
        </Suspense>
    );
}

async function BrandAuditContent({
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
            <BrandAuditWorkspace brandId={brandId} />
        </Suspense>
    );
}
