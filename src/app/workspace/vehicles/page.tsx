import { Suspense } from "react";
import { redirect } from "next/navigation";
import VehiclesWorkspace from "@/components/workspace/base/VehiclesWorkspace";

export default function VehiclesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VehiclesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function VehiclesContent({
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
            <VehiclesWorkspace brandId={brandId} />
        </Suspense>
    );
}
