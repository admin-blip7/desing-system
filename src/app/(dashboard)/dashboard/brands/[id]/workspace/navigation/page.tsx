import { Suspense } from "react";
import NavigationWorkspace from "@/components/workspace/base/NavigationWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NavigationPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <NavigationWorkspace brandId={brandId} />
    </Suspense>
  );
}
