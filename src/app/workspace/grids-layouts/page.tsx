import { Suspense } from "react";
import { redirect } from "next/navigation";
import GridsLayoutsWorkspace from "@/components/workspace/base/GridsLayoutsWorkspace";

export default function GridsLayoutsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GridsLayoutsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function GridsLayoutsContent({
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
            <GridsLayoutsWorkspace brandId={brandId} />
        </Suspense>
    );
}
