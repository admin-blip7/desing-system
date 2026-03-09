import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { STORAGE_BUCKETS } from '@/lib/storage/config';

export function useLogoUpload(brandId: string) {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const uploadLogo = async (file: File, path: string) => {
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${path}/${Date.now()}.${fileExt}`;
            const filePath = `${brandId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKETS.BRAND_ASSETS)
                .upload(filePath, file);

            if (uploadError) {
                // Provide specific guidance for common errors
                if (uploadError.message?.includes('Bucket not found') || uploadError.name === 'StorageApiError') {
                    const bucketError = `Storage bucket "${STORAGE_BUCKETS.BRAND_ASSETS}" not found. Please create it in Supabase Dashboard:
1. Go to Storage in Supabase Dashboard
2. Create a new bucket named "${STORAGE_BUCKETS.BRAND_ASSETS}"
3. Enable public access if needed
4. Configure RLS policies as required`;
                    console.error(bucketError);
                    toast.error('Error de configuración: Bucket de almacenamiento no encontrado');
                    throw new Error(bucketError);
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.BRAND_ASSETS)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Error al subir la imagen');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadLogo,
        isUploading
    };
}
