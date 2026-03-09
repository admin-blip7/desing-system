import { Suspense } from "react";
import { redirect } from "next/navigation";
import EmailTemplatesWorkspace from "@/components/workspace/base/EmailTemplatesWorkspace";

export default function EmailTemplatesPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailTemplatesContent searchParams={searchParams} />
        </Suspense>
    );
}

async function EmailTemplatesContent({
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
            <EmailTemplatesWorkspace brandId={brandId} />
        </Suspense>
    );
}
