import { Suspense } from "react";
import { redirect } from "next/navigation";
import VoiceToneWorkspace from "@/components/workspace/base/VoiceToneWorkspace";

export default function VoiceTonePage({
  searchParams,
}: {
  searchParams: Promise<{ brandId?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VoiceToneContent searchParams={searchParams} />
    </Suspense>
  );
}

async function VoiceToneContent({
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
      <VoiceToneWorkspace brandId={brandId} />
    </Suspense>
  );
}
