import { Suspense } from "react";
import IncidentWorkspace from "@/components/workspace/base/IncidentWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IncidentsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <IncidentWorkspace brandId={brandId} />
    </Suspense>
  );
}
