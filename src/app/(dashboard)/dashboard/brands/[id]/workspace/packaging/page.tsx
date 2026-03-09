import { Suspense } from "react";
import PackagingWorkspace from "@/components/workspace/base/PackagingWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PackagingPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <PackagingWorkspace brandId={brandId} />
    </Suspense>
  );
}
