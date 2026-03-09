import { Suspense } from "react";
import SupportTicketsWorkspace from "@/components/workspace/base/SupportTicketsWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupportTicketsPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <SupportTicketsWorkspace brandId={brandId} />
    </Suspense>
  );
}
