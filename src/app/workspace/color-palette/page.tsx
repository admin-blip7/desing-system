import { Suspense } from "react";
import { redirect } from "next/navigation";
import ColorPaletteWorkspace from "@/components/workspace/base/ColorPaletteWorkspace";

export default function ColorPalettePage({
    searchParams,
}: {
    searchParams: Promise<{ brandId?: string }>;
}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ColorPaletteContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ColorPaletteContent({
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
            <ColorPaletteWorkspace brandId={brandId} />
        </Suspense>
    );
}
