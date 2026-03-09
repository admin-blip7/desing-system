import { Suspense } from "react";
import BrandGenerationWorkspace from "@/components/workspace/base/BrandGenerationWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moduleKey?: string; sessionId?: string }>;
};

export default async function BrandGenerationPage({ params, searchParams }: PageProps) {
  const { id: brandId } = await params;
  const { moduleKey, sessionId } = await searchParams;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <BrandGenerationWorkspace brandId={brandId} moduleKey={moduleKey} sessionId={sessionId} />
    </Suspense>
  );
}
