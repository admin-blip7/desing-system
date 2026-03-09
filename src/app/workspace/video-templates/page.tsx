import { Suspense } from "react";
import { redirect } from "next/navigation";
import VideoTemplatesWorkspace from "@/components/workspace/base/VideoTemplatesWorkspace";

export default function VideoTemplatesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VideoTemplatesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function VideoTemplatesContent({
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
            <VideoTemplatesWorkspace brandId={brandId} />
        </Suspense>
    );
}
