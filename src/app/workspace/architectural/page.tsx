import { Suspense } from "react";
import { redirect } from "next/navigation";
import ArchitecturalWorkspace from "@/components/workspace/base/ArchitecturalWorkspace";

export default function ArchitecturalPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArchitecturalContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ArchitecturalContent({
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
            <ArchitecturalWorkspace brandId={brandId} />
        </Suspense>
    );
}
