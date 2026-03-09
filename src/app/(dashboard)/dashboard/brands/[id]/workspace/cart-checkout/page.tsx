import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CartCheckoutWorkspace from "@/components/workspace/base/CartCheckoutWorkspace";

interface Params {
    id: string;
}

export default async function CartCheckoutPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { id: brandId } = await params;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    const { data: brand } = await supabase
        .from("brands")
        .select("id,user_id")
        .eq("id", brandId)
        .eq("user_id", user.id)
        .single();

    if (!brand) {
        notFound();
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CartCheckoutContent brandId={brandId} />
        </Suspense>
    );
}

async function CartCheckoutContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CartCheckoutWorkspace brandId={brandId} />
        </Suspense>
    );
}