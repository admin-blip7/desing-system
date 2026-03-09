import { Suspense } from "react";
import { redirect } from "next/navigation";
import PrintGuideWorkspace from "@/components/workspace/base/PrintGuideWorkspace";

export default function PrintGuidePage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrintGuideContent searchParams={searchParams} />
        </Suspense>
    );
}

async function PrintGuideContent({
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
            <PrintGuideWorkspace brandId={brandId} />
        </Suspense>
    );
}
