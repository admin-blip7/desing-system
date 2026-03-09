import { Suspense } from "react";
import MotionWorkspace from "@/components/workspace/base/MotionWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MotionPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <MotionWorkspace brandId={brandId} />
    </Suspense>
  );
}
