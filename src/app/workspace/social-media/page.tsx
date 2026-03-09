import { Suspense } from "react";
import { redirect } from "next/navigation";
import SocialMediaWorkspace from "@/components/workspace/base/SocialMediaWorkspace";

export default function SocialMediaPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SocialMediaContent searchParams={searchParams} />
        </Suspense>
    );
}

async function SocialMediaContent({
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
            <SocialMediaWorkspace brandId={brandId} />
        </Suspense>
    );
}
