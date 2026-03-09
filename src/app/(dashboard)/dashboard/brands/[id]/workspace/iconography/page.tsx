import { Suspense } from "react";
import IconographyWorkspace from "@/components/workspace/base/IconographyWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IconographyPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <IconographyWorkspace brandId={brandId} />
    </Suspense>
  );
}
