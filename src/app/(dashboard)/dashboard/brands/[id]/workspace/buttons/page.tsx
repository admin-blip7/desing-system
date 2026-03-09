import { Suspense } from "react";
import ButtonsWorkspace from "@/components/workspace/base/ButtonsWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ButtonsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <ButtonsWorkspace brandId={brandId} />
    </Suspense>
  );
}
