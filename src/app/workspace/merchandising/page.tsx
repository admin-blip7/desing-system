import { Suspense } from "react";
import { redirect } from "next/navigation";
import MerchandisingWorkspace from "@/components/workspace/base/MerchandisingWorkspace";

export default function MerchandisingPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MerchandisingContent searchParams={searchParams} />
        </Suspense>
    );
}

async function MerchandisingContent({
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
            <MerchandisingWorkspace brandId={brandId} />
        </Suspense>
    );
}
