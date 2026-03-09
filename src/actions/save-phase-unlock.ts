"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { phases } from "@/lib/data/phases";
import { getMissingRequiredQuestions } from "@/lib/utils/question-validation";

export async function savePhaseUnlockAnswersAction(
  brandId: string,
  phaseId: number,
  answers: Record<string, string | string[]>,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const phase = phases.find((item) => item.id === phaseId);
  if (!phase) {
    return { success: false, error: "Fase no encontrada" };
  }

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id, onboarding_data")
    .eq("id", brandId)
    .eq("user_id", user.id)
    .single();

  if (brandError || !brand) {
    return { success: false, error: "Brand not found" };
  }

  const currentData = (brand.onboarding_data || {}) as Record<string, unknown>;
  const mergedData = {
    ...currentData,
    ...answers,
  };

  const missingRequired = getMissingRequiredQuestions(phase.unlockQuestions, mergedData, { requireAll: true });
  if (missingRequired.length > 0) {
    return {
      success: false,
      error: `Completa los campos obligatorios: ${missingRequired.map((question) => question.q).join(", ")}`,
    };
  }

  const { error: updateError } = await supabase
    .from("brands")
    .update({
      onboarding_data: mergedData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", brandId)
    .eq("user_id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/dashboard/brands/${brandId}`);
  revalidatePath(`/dashboard/brands/${brandId}/preview`);
  revalidatePath(`/dashboard/brands/${brandId}/modules`);

  return { success: true };
}
