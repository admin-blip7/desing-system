import { Suspense } from "react";
import EmptyErrorStatesWorkspace from "@/components/workspace/base/EmptyErrorStatesWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmptyErrorStatesPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <EmptyErrorStatesWorkspace brandId={brandId} />
    </Suspense>
  );
}
