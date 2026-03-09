import { Suspense } from "react";
import { redirect } from "next/navigation";
import MotionWorkspace from "@/components/workspace/base/MotionWorkspace";

export default function MotionPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MotionContent searchParams={searchParams} />
        </Suspense>
    );
}

async function MotionContent({
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
            <MotionWorkspace brandId={brandId} />
        </Suspense>
    );
}
