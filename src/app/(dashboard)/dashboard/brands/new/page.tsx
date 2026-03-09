import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { createClient } from "@/lib/supabase/server";

export default async function NewBrandPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialPersonalityId: string | null = null;
  let initialFormData: Record<string, unknown> | null = null;

  if (user) {
    const { data: latestBrand } = await supabase
      .from("brands")
      .select("personality_id, onboarding_data")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    initialPersonalityId = latestBrand?.personality_id || null;
    initialFormData = (latestBrand?.onboarding_data as Record<string, unknown>) || null;
  }

  return (
    <main>
      <OnboardingFlow initialPersonalityId={initialPersonalityId} initialFormData={initialFormData} />
    </main>
  );
}
