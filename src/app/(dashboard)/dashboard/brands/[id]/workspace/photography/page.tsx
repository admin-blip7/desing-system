import { Suspense } from "react";
import PhotographyWorkspace from "@/components/workspace/base/PhotographyWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotographyPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <PhotographyWorkspace brandId={brandId} />
    </Suspense>
  );
}
