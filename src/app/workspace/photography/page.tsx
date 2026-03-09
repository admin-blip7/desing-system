import { Suspense } from "react";
import { redirect } from "next/navigation";
import PhotographyWorkspace from "@/components/workspace/base/PhotographyWorkspace";

export default function PhotographyPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PhotographyContent searchParams={searchParams} />
        </Suspense>
    );
}

async function PhotographyContent({
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
            <PhotographyWorkspace brandId={brandId} />
        </Suspense>
    );
}
