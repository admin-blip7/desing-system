import { Suspense } from "react";
import { redirect } from "next/navigation";
import IllustrationWorkspace from "@/components/workspace/base/IllustrationWorkspace";

export default function IllustrationPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IllustrationContent searchParams={searchParams} />
        </Suspense>
    );
}

async function IllustrationContent({
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
            <IllustrationWorkspace brandId={brandId} />
        </Suspense>
    );
}
