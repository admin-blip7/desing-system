import { Suspense } from "react";
import AssetLibraryWorkspace from "@/components/workspace/base/AssetLibraryWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AssetLibraryPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <AssetLibraryWorkspace brandId={brandId} />
    </Suspense>
  );
}
