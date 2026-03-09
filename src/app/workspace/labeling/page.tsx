import { Suspense } from "react";
import { redirect } from "next/navigation";
import LabelingWorkspace from "@/components/workspace/base/LabelingWorkspace";

export default function LabelingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LabelingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function LabelingContent({
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
            <LabelingWorkspace brandId={brandId} />
        </Suspense>
    );
}
