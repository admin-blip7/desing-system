import { Suspense } from "react";
import { redirect } from "next/navigation";
import BehaviorWorkspace from "@/components/workspace/base/BehaviorWorkspace";

export default function BehaviorPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BehaviorContent searchParams={searchParams} />
        </Suspense>
    );
}

async function BehaviorContent({
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
            <BehaviorWorkspace brandId={brandId} />
        </Suspense>
    );
}
