import { Suspense } from "react";
import { redirect } from "next/navigation";
import StationeryWorkspace from "@/components/workspace/base/StationeryWorkspace";

export default function StationeryPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StationeryContent searchParams={searchParams} />
        </Suspense>
    );
}

async function StationeryContent({
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
            <StationeryWorkspace brandId={brandId} />
        </Suspense>
    );
}
