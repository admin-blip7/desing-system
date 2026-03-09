import { Suspense } from "react";
import { redirect } from "next/navigation";
import NotionConnectorWorkspace from "@/components/workspace/base/NotionConnectorWorkspace";

export default function NotionConnectorPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotionConnectorContent searchParams={searchParams} />
        </Suspense>
    );
}

async function NotionConnectorContent({
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
            <NotionConnectorWorkspace brandId={brandId} />
        </Suspense>
    );
}
