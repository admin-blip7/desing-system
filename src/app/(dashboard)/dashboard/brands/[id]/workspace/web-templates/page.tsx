import { Suspense } from "react";
import WebTemplatesWorkspace from "@/components/workspace/base/WebTemplatesWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WebTemplatesPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <WebTemplatesWorkspace brandId={brandId} />
    </Suspense>
  );
}
