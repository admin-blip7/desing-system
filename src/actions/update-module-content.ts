"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getModuleByIdentifier } from "@/lib/data/modules-definition";

export async function updateModuleContentAction(brandId: string, moduleKey: string, content: unknown) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("id", brandId)
    .eq("user_id", user.id)
    .single();

  if (brandError || !brand) {
    return { success: false, error: "Brand not found" };
  }

  const moduleDefinition = getModuleByIdentifier(moduleKey);
  const acceptedKeys = moduleDefinition ? [moduleDefinition.key, moduleDefinition.name] : [moduleKey];

  const { error: updateError } = await supabase
    .from("modules")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("brand_id", brandId)
    .in("module_key", acceptedKeys);

  if (updateError) {
    // Fallback for schemas that include "version" or strict triggers.
    // We retry with minimal payload shape before failing.
    const { error: fallbackError } = await supabase
      .from("modules")
      .update({
        content,
      })
      .eq("brand_id", brandId)
      .in("module_key", acceptedKeys);

    if (fallbackError) {
      return { success: false, error: fallbackError.message };
    }
  }

  revalidatePath(`/dashboard/brands/${brandId}`);
  revalidatePath(`/dashboard/brands/${brandId}/preview`);
  revalidatePath(`/dashboard/brands/${brandId}/modules/${moduleDefinition?.key || moduleKey}`);

  return { success: true };
}
