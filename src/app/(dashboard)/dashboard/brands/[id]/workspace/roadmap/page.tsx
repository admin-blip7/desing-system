import { Suspense } from "react";
import RoadmapWorkspace from "@/components/workspace/base/RoadmapWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoadmapPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <RoadmapWorkspace brandId={brandId} />
    </Suspense>
  );
}
