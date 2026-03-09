import { Suspense } from "react";
import TablesListsWorkspace from "@/components/workspace/base/TablesListsWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TablesListsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <TablesListsWorkspace brandId={brandId} />
    </Suspense>
  );
}
