import { Suspense } from "react";
import { redirect } from "next/navigation";
import EmptyErrorStatesWorkspace from "@/components/workspace/base/EmptyErrorStatesWorkspace";

export default function EmptyErrorStatesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmptyErrorStatesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function EmptyErrorStatesContent({
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
            <EmptyErrorStatesWorkspace brandId={brandId} />
        </Suspense>
    );
}
