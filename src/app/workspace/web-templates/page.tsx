import { Suspense } from "react";
import { redirect } from "next/navigation";
import WebTemplatesWorkspace from "@/components/workspace/base/WebTemplatesWorkspace";

export default function WebTemplatesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WebTemplatesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function WebTemplatesContent({
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
            <WebTemplatesWorkspace brandId={brandId} />
        </Suspense>
    );
}
