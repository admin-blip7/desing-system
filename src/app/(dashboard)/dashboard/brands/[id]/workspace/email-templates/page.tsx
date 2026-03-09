import { Suspense } from "react";
import EmailTemplatesWorkspace from "@/components/workspace/base/EmailTemplatesWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmailTemplatesPage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <EmailTemplatesWorkspace brandId={brandId} />
    </Suspense>
  );
}
