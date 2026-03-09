"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getModuleByKey } from "@/lib/data/modules-definition";

function withPreAnswersFallback(content: unknown, answers: Record<string, string | string[]>) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return { ...(content as Record<string, unknown>), __preAnswers: answers };
  }

  return { __preAnswers: answers, __rawContent: content ?? null };
}

export async function saveModuleAnswersAction(
  brandId: string,
  moduleKey: string,
  answers: Record<string, string | string[]>,
) {
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

  const moduleDefinition = getModuleByKey(moduleKey);
  if (!moduleDefinition) {
    return { success: false, error: "Module definition not found" };
  }

  const { data: existingRows } = await supabase
    .from("modules")
    .select("id, content")
    .eq("brand_id", brandId)
    .in("module_key", [moduleDefinition.key, moduleDefinition.name])
    .order("updated_at", { ascending: false });

  const existingRow = (existingRows || [])[0];

  if (existingRow?.id) {
    const { error: updateAnswersError } = await supabase
      .from("modules")
      .update({
        module_key: moduleDefinition.key,
        pre_answers: answers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRow.id);

    if (updateAnswersError) {
      const { error: fallbackError } = await supabase
        .from("modules")
        .update({
          content: withPreAnswersFallback(existingRow.content, answers),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRow.id);

      if (fallbackError) {
        return { success: false, error: fallbackError.message };
      }
    }
  } else {
    const { error: insertAnswersError } = await supabase.from("modules").insert({
      brand_id: brandId,
      module_key: moduleDefinition.key,
      name: moduleDefinition.name,
      phase: moduleDefinition.phaseId,
      status: "pending",
      content: {},
      pre_answers: answers,
    });

    if (insertAnswersError) {
      const { error: fallbackInsertError } = await supabase.from("modules").insert({
        brand_id: brandId,
        module_key: moduleDefinition.key,
        name: moduleDefinition.name,
        phase: moduleDefinition.phaseId,
        status: "pending",
        content: withPreAnswersFallback({}, answers),
      });

      if (fallbackInsertError) {
        return { success: false, error: fallbackInsertError.message };
      }
    }
  }

  revalidatePath(`/dashboard/brands/${brandId}`);
  revalidatePath(`/dashboard/brands/${brandId}/modules/${moduleKey}`);

  return { success: true };
}
