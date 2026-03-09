import { Suspense } from "react";
import OnboardingWorkspace from "@/components/workspace/base/OnboardingWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OnboardingPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <OnboardingWorkspace brandId={brandId} />
    </Suspense>
  );
}
