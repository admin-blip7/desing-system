import { Suspense } from "react";
import { redirect } from "next/navigation";
import AudioBrandingWorkspace from "@/components/workspace/base/AudioBrandingWorkspace";

export default function AudioBrandingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AudioBrandingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function AudioBrandingContent({
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
            <AudioBrandingWorkspace brandId={brandId} />
        </Suspense>
    );
}
