import { Suspense } from "react";
import { redirect } from "next/navigation";
import ButtonsWorkspace from "@/components/workspace/base/ButtonsWorkspace";

export default function ButtonsPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ButtonsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ButtonsContent({
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
            <ButtonsWorkspace brandId={brandId} />
        </Suspense>
    );
}
