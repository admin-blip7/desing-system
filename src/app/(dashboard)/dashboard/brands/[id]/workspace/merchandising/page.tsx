import { Suspense } from "react";
import MerchandisingWorkspace from "@/components/workspace/base/MerchandisingWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MerchandisingPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <MerchandisingWorkspace brandId={brandId} />
    </Suspense>
  );
}
