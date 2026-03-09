import { Suspense } from "react";
import TagsStatusWorkspace from "@/components/workspace/base/TagsStatusWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TagsStatusPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <TagsStatusWorkspace brandId={brandId} />
    </Suspense>
  );
}
