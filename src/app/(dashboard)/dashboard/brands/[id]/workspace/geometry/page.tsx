import GeometryWorkspace from "@/components/workspace/base/GeometryWorkspace";

export default async function GeometryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GeometryWorkspace brandId={id} />;
}
