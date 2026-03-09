import { Suspense } from "react";
import { redirect } from "next/navigation";
import AssetLibraryWorkspace from "@/components/workspace/base/AssetLibraryWorkspace";

export default function AssetLibraryPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AssetLibraryContent searchParams={searchParams} />
        </Suspense>
    );
}

async function AssetLibraryContent({
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
            <AssetLibraryWorkspace brandId={brandId} />
        </Suspense>
    );
}
