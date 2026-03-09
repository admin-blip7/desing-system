import { Suspense } from "react";
import { redirect } from "next/navigation";
import CxSystemWorkspace from "@/components/workspace/base/CxSystemWorkspace";

export default function CxSystemPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CxSystemContent searchParams={searchParams} />
        </Suspense>
    );
}

async function CxSystemContent({
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
            <CxSystemWorkspace brandId={brandId} />
        </Suspense>
    );
}
