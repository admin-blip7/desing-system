"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function toggleBrandSharing(brandId: string, isPublic: boolean) {
    const supabase = await createClient();

    try {
        // Check ownership
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data: brand } = await supabase
            .from("brands")
            .select("id, user_id, share_token")
            .eq("id", brandId)
            .single();

        if (!brand || brand.user_id !== user.id) {
            throw new Error("Brand not found or access denied");
        }

        let updateData: any = { is_public: isPublic };

        // Generate token if enabling and none exists
        if (isPublic && !brand.share_token) {
            updateData.share_token = uuidv4();
        }

        const { error } = await supabase
            .from("brands")
            .update(updateData)
            .eq("id", brandId);

        if (error) throw error;

        revalidatePath(`/dashboard/brands/${brandId}`);
        revalidatePath(`/dashboard/brands/${brandId}/preview`);

        return {
            success: true,
            isPublic,
            shareToken: updateData.share_token || brand.share_token
        };

    } catch (error: any) {
        console.error("Error toggling share:", error);
        return { success: false, error: error.message };
    }
}
