import { Suspense } from "react";
import DesignTokensWorkspace from "@/components/workspace/base/DesignTokensWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DesignTokensPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <DesignTokensWorkspace brandId={brandId} />
    </Suspense>
  );
}
