import { Suspense } from "react";
import FormsWorkspace from "@/components/workspace/base/FormsWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FormsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <FormsWorkspace brandId={brandId} />
    </Suspense>
  );
}
