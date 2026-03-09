import { Suspense } from "react";
import { redirect } from "next/navigation";
import SeoMetaWorkspace from "@/components/workspace/base/SeoMetaWorkspace";

export default function SeoMetaPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SeoMetaContent searchParams={searchParams} />
        </Suspense>
    );
}

async function SeoMetaContent({
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
            <SeoMetaWorkspace brandId={brandId} />
        </Suspense>
    );
}
