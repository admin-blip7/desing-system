import { createClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/data/modules-definition";
import { getDependencyModulesForModule } from "@/lib/utils/module-dependencies";
import { personalities } from "@/lib/data/personalities";

interface BuildModuleContextResult {
  success: boolean;
  error?: string;
  data?: {
    brandId: string;
    moduleKey: string;
    moduleName: string;
    onboarding: Record<string, unknown>;
    dependencyOutputs: Record<string, unknown>;
    personalityId: string | null;
    personalityProfile: Record<string, unknown> | null;
    userAnswers?: Record<string, string | string[]>; // NUEVO: respuestas del formulario
  };
}

export async function buildModuleContext(
  brandId: string,
  moduleKey: string,
  userAnswers?: Record<string, string | string[]> // NUEVO: respuestas del formulario
): Promise<BuildModuleContextResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const moduleDefinition = getModuleByKey(moduleKey);
  if (!moduleDefinition) {
    return { success: false, error: "Module definition not found" };
  }

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id, onboarding_data, personality_id")
    .eq("id", brandId)
    .eq("user_id", user.id)
    .single();

  if (brandError || !brand) {
    return { success: false, error: "Brand not found" };
  }

  const dependencyModules = getDependencyModulesForModule(moduleDefinition.key);
  const dependencyIdentifiers = [...new Set(dependencyModules.flatMap((module) => [module.key, module.name]))];

  let dependencyOutputs: Record<string, unknown> = {};
  if (dependencyIdentifiers.length > 0) {
    const { data: dependencyRows, error: dependenciesError } = await supabase
      .from("modules")
      .select("module_key, content, status")
      .eq("brand_id", brandId)
      .in("module_key", dependencyIdentifiers)
      .eq("status", "completed");

    if (dependenciesError) {
      return { success: false, error: dependenciesError.message };
    }

    const rowMap = new Map((dependencyRows || []).map((row) => [row.module_key, row.content]));
    dependencyOutputs = dependencyModules.reduce<Record<string, unknown>>((acc, module) => {
      const content = rowMap.get(module.key) ?? rowMap.get(module.name);
      if (content !== undefined) {
        acc[module.key] = content;
      }
      return acc;
    }, {});
  }

  const selectedPersonality = personalities.find((item) => item.id === brand.personality_id) || null;
  const personalityProfile = selectedPersonality
    ? {
        id: selectedPersonality.id,
        name: selectedPersonality.name,
        archetype: selectedPersonality.archetype,
        tagline: selectedPersonality.tagline,
        philosophy: selectedPersonality.philosophy,
        keyPrinciples: selectedPersonality.keyPrinciples,
        dna: selectedPersonality.dna,
        ideal: selectedPersonality.ideal,
      }
    : null;

  return {
    success: true,
    data: {
      brandId,
      moduleKey,
      moduleName: moduleDefinition.name,
      onboarding: (brand.onboarding_data || {}) as Record<string, unknown>,
      dependencyOutputs,
      personalityId: brand.personality_id,
      personalityProfile,
      userAnswers, // NUEVO: incluir respuestas del formulario
    },
  };
}
