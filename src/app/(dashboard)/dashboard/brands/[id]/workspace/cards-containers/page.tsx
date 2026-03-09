import { Suspense } from "react";
import CardsContainersWorkspace from "@/components/workspace/base/CardsContainersWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardsContainersPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <CardsContainersWorkspace brandId={brandId} />
    </Suspense>
  );
}
