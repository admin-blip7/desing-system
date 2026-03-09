import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CustomerPersonasWorkspace from "@/components/workspace/base/CustomerPersonasWorkspace";

interface Params {
    id: string;
}

export default async function CustomerPersonasPage({
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
            <CustomerPersonasContent brandId={brandId} />
        </Suspense>
    );
}

async function CustomerPersonasContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomerPersonasWorkspace brandId={brandId} />
        </Suspense>
    );
}