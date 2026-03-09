import { Suspense } from "react";
import VoiceToneWorkspace from "@/components/workspace/base/VoiceToneWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function VoiceTonePage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <VoiceToneWorkspace brandId={brandId} />
    </Suspense>
  );
}
