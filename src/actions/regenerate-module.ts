"use server";

import { createClient } from "@/lib/supabase/server";
import { generateModuleAction } from "@/actions/generate-module";
import { revalidatePath } from "next/cache";

export async function regenerateModuleAction(brandId: string, moduleKey: string) {
    // Reuse existing logic
    // We might want to clear the old module content first or just overwrite it? 
    // generateModuleAction does upsert, so it overwrites.

    // We typically want to check auth here again, although generateModuleAction does it too.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // Call the original generation action
    const result = await generateModuleAction(brandId, moduleKey);

    if (result.success) {
        revalidatePath(`/dashboard/brands/${brandId}`);
    }

    return result;
}
