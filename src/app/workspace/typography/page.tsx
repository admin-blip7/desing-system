import { Suspense } from "react";
import { redirect } from "next/navigation";
import TypographyWorkspace from "@/components/workspace/base/TypographyWorkspace";

export default function TypographyPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TypographyContent searchParams={searchParams} />
        </Suspense>
    );
}

async function TypographyContent({
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
            <TypographyWorkspace brandId={brandId} />
        </Suspense>
    );
}
