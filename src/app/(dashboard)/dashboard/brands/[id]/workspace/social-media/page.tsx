import { Suspense } from "react";
import SocialMediaWorkspace from "@/components/workspace/base/SocialMediaWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SocialMediaPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <SocialMediaWorkspace brandId={brandId} />
    </Suspense>
  );
}
