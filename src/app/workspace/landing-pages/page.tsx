import { Suspense } from "react";
import { redirect } from "next/navigation";
import LandingPagesWorkspace from "@/components/workspace/base/LandingPagesWorkspace";

export default function LandingPagesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LandingPagesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function LandingPagesContent({
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
            <LandingPagesWorkspace brandId={brandId} />
        </Suspense>
    );
}
