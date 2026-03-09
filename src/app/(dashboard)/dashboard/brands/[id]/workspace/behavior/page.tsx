import { Suspense } from "react";
import BehaviorWorkspace from "@/components/workspace/base/BehaviorWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BehaviorPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <BehaviorWorkspace brandId={brandId} />
    </Suspense>
  );
}
