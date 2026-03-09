import { Suspense } from "react";
import GridsLayoutsWorkspace from "@/components/workspace/base/GridsLayoutsWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GridsLayoutsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <GridsLayoutsWorkspace brandId={brandId} />
    </Suspense>
  );
}
