import { Suspense } from "react";
import { redirect } from "next/navigation";
import TagsStatusWorkspace from "@/components/workspace/base/TagsStatusWorkspace";

export default function TagsStatusPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TagsStatusContent searchParams={searchParams} />
        </Suspense>
    );
}

async function TagsStatusContent({
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
            <TagsStatusWorkspace brandId={brandId} />
        </Suspense>
    );
}
