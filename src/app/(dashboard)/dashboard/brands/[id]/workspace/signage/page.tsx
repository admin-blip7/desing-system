import { Suspense } from "react";
import SignageWorkspace from "@/components/workspace/base/SignageWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SignagePage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <SignageWorkspace brandId={brandId} />
    </Suspense>
  );
}
