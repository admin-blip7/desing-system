import { Suspense } from "react";
import IllustrationWorkspace from "@/components/workspace/base/IllustrationWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IllustrationPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <IllustrationWorkspace brandId={brandId} />
    </Suspense>
  );
}
