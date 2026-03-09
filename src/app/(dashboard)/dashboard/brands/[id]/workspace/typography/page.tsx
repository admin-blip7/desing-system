import { Suspense } from "react";
import TypographyWorkspace from "@/components/workspace/base/TypographyWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TypographyPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <TypographyWorkspace brandId={brandId} />
    </Suspense>
  );
}
