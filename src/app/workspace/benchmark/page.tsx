import { Suspense } from "react";
import { redirect } from "next/navigation";
import BenchmarkWorkspace from "@/components/workspace/base/BenchmarkWorkspace";

export default function BenchmarkPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BenchmarkContent searchParams={searchParams} />
        </Suspense>
    );
}

async function BenchmarkContent({
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
            <BenchmarkWorkspace brandId={brandId} />
        </Suspense>
    );
}
