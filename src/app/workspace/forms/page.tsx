import { Suspense } from "react";
import { redirect } from "next/navigation";
import FormsWorkspace from "@/components/workspace/base/FormsWorkspace";

export default function FormsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FormsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function FormsContent({
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
            <FormsWorkspace brandId={brandId} />
        </Suspense>
    );
}
