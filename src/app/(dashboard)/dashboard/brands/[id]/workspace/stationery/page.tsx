import { Suspense } from "react";
import StationeryWorkspace from "@/components/workspace/base/StationeryWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StationeryPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <StationeryWorkspace brandId={brandId} />
    </Suspense>
  );
}
