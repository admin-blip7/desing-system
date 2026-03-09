import { Suspense } from "react";
import LogoWorkspace from "@/components/workspace/base/LogoWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LogoPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <LogoWorkspace brandId={brandId} />
    </Suspense>
  );
}
