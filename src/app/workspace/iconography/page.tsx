import { Suspense } from "react";
import { redirect } from "next/navigation";
import IconographyWorkspace from "@/components/workspace/base/IconographyWorkspace";

export default function IconographyPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IconographyContent searchParams={searchParams} />
        </Suspense>
    );
}

async function IconographyContent({
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
            <IconographyWorkspace brandId={brandId} />
        </Suspense>
    );
}
