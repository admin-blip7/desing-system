import { Suspense } from "react";
import { redirect } from "next/navigation";
import CartCheckoutWorkspace from "@/components/workspace/base/CartCheckoutWorkspace";

export default function CartCheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CartCheckoutContent searchParams={searchParams} />
        </Suspense>
    );
}

async function CartCheckoutContent({
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
            <CartCheckoutWorkspace brandId={brandId} />
        </Suspense>
    );
}
