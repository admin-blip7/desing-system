import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingFlow />
    </main>
  );
}
