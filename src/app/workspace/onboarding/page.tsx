import { Suspense } from "react";
import { redirect } from "next/navigation";
import OnboardingWorkspace from "@/components/workspace/base/OnboardingWorkspace";

export default function OnboardingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function OnboardingContent({
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
            <OnboardingWorkspace brandId={brandId} />
        </Suspense>
    );
}
