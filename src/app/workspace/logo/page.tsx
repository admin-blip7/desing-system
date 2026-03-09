import { Suspense } from "react";
import { redirect } from "next/navigation";
import BamlLogoWorkspace from "@/app/workspace/logo/BamlLogoWorkspace";
import { LogoBamlErrorBoundary } from "@/app/workspace/logo/LogoBamlErrorBoundary";

export default function LogoPage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LogoContent searchParams={searchParams} />
        </Suspense>
    );
}

async function LogoContent({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    const { brandId } = await searchParams;

    if (!brandId) {
        redirect("/dashboard");
    }

    return (
        <LogoBamlErrorBoundary>
            <BamlLogoWorkspace brandId={brandId} />
        </LogoBamlErrorBoundary>
    );
}
