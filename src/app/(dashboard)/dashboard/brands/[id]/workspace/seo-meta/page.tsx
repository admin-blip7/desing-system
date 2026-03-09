import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SeoMetaWorkspace from "@/components/workspace/base/SeoMetaWorkspace";

interface Params {
    id: string;
}

export default async function SeoMetaPage({
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
            <SeoMetaContent brandId={brandId} />
        </Suspense>
    );
}

async function SeoMetaContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SeoMetaWorkspace brandId={brandId} />
        </Suspense>
    );
}