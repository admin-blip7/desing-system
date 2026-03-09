import BrandPhilosophyWorkspace from "@/components/workspace/base/BrandPhilosophyWorkspace";

export default async function BrandPhilosophyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrandPhilosophyWorkspace brandId={id} />;
}
