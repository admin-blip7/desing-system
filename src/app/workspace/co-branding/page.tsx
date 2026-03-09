import { Suspense } from "react";
import { redirect } from "next/navigation";
import CoBrandingWorkspace from "@/components/workspace/base/CoBrandingWorkspace";

export default function CoBrandingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CoBrandingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function CoBrandingContent({
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
            <CoBrandingWorkspace brandId={brandId} />
        </Suspense>
    );
}
