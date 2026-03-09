import { Suspense } from "react";
import { redirect } from "next/navigation";
import SupportTicketsWorkspace from "@/components/workspace/base/SupportTicketsWorkspace";

export default function SupportTicketsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SupportTicketsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function SupportTicketsContent({
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
            <SupportTicketsWorkspace brandId={brandId} />
        </Suspense>
    );
}
