import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingPagesWorkspace from "@/components/workspace/base/LandingPagesWorkspace";

interface Params {
    id: string;
}

export default async function LandingPagesPage({
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
            <LandingPagesContent brandId={brandId} />
        </Suspense>
    );
}

async function LandingPagesContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LandingPagesWorkspace brandId={brandId} />
        </Suspense>
    );
}