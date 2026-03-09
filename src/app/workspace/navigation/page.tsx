import { Suspense } from "react";
import { redirect } from "next/navigation";
import NavigationWorkspace from "@/components/workspace/base/NavigationWorkspace";

export default function NavigationPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NavigationContent searchParams={searchParams} />
        </Suspense>
    );
}

async function NavigationContent({
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
            <NavigationWorkspace brandId={brandId} />
        </Suspense>
    );
}
