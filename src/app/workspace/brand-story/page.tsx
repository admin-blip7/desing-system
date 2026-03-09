import { Suspense } from "react";
import { redirect } from "next/navigation";
import BrandStoryWorkspace from "@/components/workspace/base/BrandStoryWorkspace";

export default function BrandStoryPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrandStoryContent searchParams={searchParams} />
        </Suspense>
    );
}

async function BrandStoryContent({
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
            <BrandStoryWorkspace brandId={brandId} />
        </Suspense>
    );
}
