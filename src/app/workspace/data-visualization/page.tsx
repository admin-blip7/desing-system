import { Suspense } from "react";
import { redirect } from "next/navigation";
import DataVisualizationWorkspace from "@/components/workspace/base/DataVisualizationWorkspace";

export default function DataVisualizationPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataVisualizationContent searchParams={searchParams} />
        </Suspense>
    );
}

async function DataVisualizationContent({
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
            <DataVisualizationWorkspace brandId={brandId} />
        </Suspense>
    );
}
