import { Suspense } from "react";
import { redirect } from "next/navigation";
import SocialProfilesWorkspace from "@/components/workspace/base/SocialProfilesWorkspace";

export default function SocialProfilesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SocialProfilesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function SocialProfilesContent({
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
            <SocialProfilesWorkspace brandId={brandId} />
        </Suspense>
    );
}
