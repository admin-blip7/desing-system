import { Suspense } from "react";
import { redirect } from "next/navigation";
import CustomerPersonasWorkspace from "@/components/workspace/base/CustomerPersonasWorkspace";

export default function CustomerPersonasPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomerPersonasContent searchParams={searchParams} />
        </Suspense>
    );
}

async function CustomerPersonasContent({
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
            <CustomerPersonasWorkspace brandId={brandId} />
        </Suspense>
    );
}
