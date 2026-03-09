import { Suspense } from "react";
import { redirect } from "next/navigation";
import ExportMdLlmsWorkspace from "@/components/workspace/base/ExportMdLlmsWorkspace";

export default function ExportMdLlmsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExportMdLlmsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ExportMdLlmsContent({
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
            <ExportMdLlmsWorkspace brandId={brandId} />
        </Suspense>
    );
}
