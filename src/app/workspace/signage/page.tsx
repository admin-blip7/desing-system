import { Suspense } from "react";
import { redirect } from "next/navigation";
import SignageWorkspace from "@/components/workspace/base/SignageWorkspace";

export default function SignagePage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignageContent searchParams={searchParams} />
        </Suspense>
    );
}

async function SignageContent({
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
            <SignageWorkspace brandId={brandId} />
        </Suspense>
    );
}
