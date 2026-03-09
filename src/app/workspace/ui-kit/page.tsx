import { Suspense } from "react";
import { redirect } from "next/navigation";
import UiKitWorkspace from "@/components/workspace/base/UiKitWorkspace";

export default function UiKitPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UiKitContent searchParams={searchParams} />
        </Suspense>
    );
}

async function UiKitContent({
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
            <UiKitWorkspace brandId={brandId} />
        </Suspense>
    );
}
