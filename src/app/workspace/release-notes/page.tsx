import { Suspense } from "react";
import { redirect } from "next/navigation";
import ReleaseNotesWorkspace from "@/components/workspace/base/ReleaseNotesWorkspace";

export default function ReleaseNotesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReleaseNotesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ReleaseNotesContent({
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
            <ReleaseNotesWorkspace brandId={brandId} />
        </Suspense>
    );
}
