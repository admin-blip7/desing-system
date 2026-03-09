import { Suspense } from "react";
import { redirect } from "next/navigation";
import UniformsWorkspace from "@/components/workspace/base/UniformsWorkspace";

export default function UniformsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UniformsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function UniformsContent({
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
            <UniformsWorkspace brandId={brandId} />
        </Suspense>
    );
}
