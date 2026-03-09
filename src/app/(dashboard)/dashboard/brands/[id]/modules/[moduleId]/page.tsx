import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/data/modules-definition";
import { getModuleType } from "@/lib/data/module-types";

interface Params {
  id: string;
  moduleId: string;
}

export default async function ModuleDetailPage({ params }: { params: Promise<Params> }) {
  const { id: brandId, moduleId } = await params;
  const moduleDefinition = getModuleByKey(moduleId);

  if (!moduleDefinition) {
    return notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: brand } = await supabase
    .from("brands")
    .select("id,user_id")
    .eq("id", brandId)
    .eq("user_id", user.id)
    .single();

  if (!brand) {
    return notFound();
  }

  const moduleType = getModuleType(moduleDefinition.key);

  if (moduleType.workspacePath) {
    const workspaceSlug = moduleType.workspacePath.replace("/workspace/", "");
    redirect(`/dashboard/brands/${brandId}/workspace/${workspaceSlug}`);
  }

  redirect(`/dashboard/brands/${brandId}/workspace/brand-generation?moduleKey=${moduleDefinition.key}`);
}
