import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SocialProfilesWorkspace from "@/components/workspace/base/SocialProfilesWorkspace";

interface Params {
    id: string;
}

export default async function SocialProfilesPage({
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
            <SocialProfilesContent brandId={brandId} />
        </Suspense>
    );
}

async function SocialProfilesContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SocialProfilesWorkspace brandId={brandId} />
        </Suspense>
    );
}