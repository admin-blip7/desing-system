import { Suspense } from "react";
import BrandAuditWorkspace from "@/components/workspace/base/BrandAuditWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BrandAuditPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <BrandAuditWorkspace brandId={brandId} />
    </Suspense>
  );
}
