import { Suspense } from "react";
import UiKitWorkspace from "@/components/workspace/base/UiKitWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UiKitPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <UiKitWorkspace brandId={brandId} />
    </Suspense>
  );
}
