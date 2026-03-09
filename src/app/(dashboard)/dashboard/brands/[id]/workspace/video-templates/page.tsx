import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VideoTemplatesWorkspace from "@/components/workspace/base/VideoTemplatesWorkspace";

interface Params {
    id: string;
}

export default async function VideoTemplates({params}: {
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
            <VideoTemplatesContent brandId={brandId} />
        </Suspense>
    );
}

async function VideoTemplatesContent({
    brandId,
}: {
    brandId: string;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VideoTemplatesWorkspace brandId={brandId} />
        </Suspense>
    );
}