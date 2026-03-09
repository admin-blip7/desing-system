import { Suspense } from "react";
import { redirect } from "next/navigation";
import TablesListsWorkspace from "@/components/workspace/base/TablesListsWorkspace";

export default function TablesListsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TablesListsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function TablesListsContent({
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
            <TablesListsWorkspace brandId={brandId} />
        </Suspense>
    );
}
