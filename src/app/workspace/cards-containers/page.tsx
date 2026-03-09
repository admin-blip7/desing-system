import { Suspense } from "react";
import { redirect } from "next/navigation";
import CardsContainersWorkspace from "@/components/workspace/base/CardsContainersWorkspace";

export default function CardsContainersPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CardsContainersContent searchParams={searchParams} />
        </Suspense>
    );
}

async function CardsContainersContent({
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
            <CardsContainersWorkspace brandId={brandId} />
        </Suspense>
    );
}
