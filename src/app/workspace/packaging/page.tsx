import { Suspense } from "react";
import { redirect } from "next/navigation";
import PackagingWorkspace from "@/components/workspace/base/PackagingWorkspace";

export default function PackagingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PackagingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function PackagingContent({
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
            <PackagingWorkspace brandId={brandId} />
        </Suspense>
    );
}
