import { Suspense } from "react";
import { redirect } from "next/navigation";
import IncidentWorkspace from "@/components/workspace/base/IncidentWorkspace";

export default function IncidentPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IncidentContent searchParams={searchParams} />
        </Suspense>
    );
}

async function IncidentContent({
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
            <IncidentWorkspace brandId={brandId} />
        </Suspense>
    );
}
