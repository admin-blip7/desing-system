/**
 * Supabase Storage Configuration
 * 
 * Required Setup in Supabase Dashboard:
 * 1. Go to Storage in Supabase Dashboard
 * 2. Create a new bucket named "brand-assets"
 * 3. Enable public access if public URLs are needed
 * 4. Configure RLS policies as required for your security model
 */

export const STORAGE_BUCKETS = {
  BRAND_ASSETS: 'brand-assets',
} as const;

export type StorageBucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];
