import { Suspense } from "react";
import { redirect } from "next/navigation";
import PresentationsWorkspace from "@/components/workspace/base/PresentationsWorkspace";

export default function PresentationsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PresentationsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function PresentationsContent({
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
            <PresentationsWorkspace brandId={brandId} />
        </Suspense>
    );
}
