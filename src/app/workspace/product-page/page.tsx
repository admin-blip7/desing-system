import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProductPageWorkspace from "@/components/workspace/base/ProductPageWorkspace";

export default function ProductPagePage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductPageContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ProductPageContent({
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
            <ProductPageWorkspace brandId={brandId} />
        </Suspense>
    );
}
