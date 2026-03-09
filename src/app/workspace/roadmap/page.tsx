import { Suspense } from "react";
import { redirect } from "next/navigation";
import RoadmapWorkspace from "@/components/workspace/base/RoadmapWorkspace";

export default function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ brandId?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoadmapContent searchParams={searchParams} />
    </Suspense>
  );
}

async function RoadmapContent({
  searchParams,
}: {
  searchParams: Promise<{ brandId?: string }>;
}) {
  const { brandId } = await searchParams;

  if (!brandId) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoadmapWorkspace brandId={brandId} />
    </Suspense>
  );
}
