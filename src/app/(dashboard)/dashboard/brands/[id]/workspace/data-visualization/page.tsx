import { Suspense } from "react";
import DataVisualizationWorkspace from "@/components/workspace/base/DataVisualizationWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DataVisualizationPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <DataVisualizationWorkspace brandId={brandId} />
    </Suspense>
  );
}
