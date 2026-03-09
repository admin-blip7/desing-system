import { Suspense } from "react";
import ColorPaletteWorkspace from "@/components/workspace/base/ColorPaletteWorkspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ColorPalettePage({ params }: PageProps) {
  const { id: brandId } = await params;

  return (
    <Suspense fallback={<div className="text-[var(--bm-color-text-secondary)]">Cargando...</div>}>
      <ColorPaletteWorkspace brandId={brandId} />
    </Suspense>
  );
}
