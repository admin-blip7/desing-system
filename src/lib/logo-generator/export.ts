/**
 * Export utilities for Logo Generator
 * Handles PNG and SVG export from SVG elements
 */

/**
 * Convert SVG element to PNG data URL
 * @param svgElement - The SVG DOM element
 * @param scale - Export scale (default: 2 for retina)
 * @returns Promise resolving to PNG data URL
 */
export async function exportToPNG(
  svgElement: SVGElement,
  scale: number = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Get SVG dimensions
      const bbox = svgElement.getBoundingClientRect();
      const width = bbox.width || 500;
      const height = bbox.height || 300;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size with scale for high quality
      canvas.width = width * scale;
      canvas.height = height * scale;

      // Serialize SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);

      // Create data URL
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Load image and draw to canvas
      const img = new Image();

      img.onload = () => {
        // Fill with white background for PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Clean up
        URL.revokeObjectURL(url);

        // Export to PNG
        const pngUrl = canvas.toDataURL('image/png');
        resolve(pngUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Convert SVG element to SVG string
 * @param svgElement - The SVG DOM element
 * @returns SVG string
 */
export function exportToSVG(svgElement: SVGElement): string {
  return new XMLSerializer().serializeToString(svgElement);
}

/**
 * Download a file from a data URL
 * @param dataUrl - The data URL to download
 * @param filename - The filename for the download
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload PNG data URL to Supabase storage
 * @param dataUrl - The PNG data URL
 * @param brandId - The brand ID for storage path
 * @param path - Additional path segment
 * @returns Promise resolving to public URL or null
 */
export async function uploadPNGToStorage(
  dataUrl: string,
  brandId: string,
  path: string = 'generated'
): Promise<string | null> {
  try {
    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create File object
    const file = new File([blob], 'logo.png', { type: 'image/png' });

    // Upload using the existing useLogoUpload pattern
    // This is done client-side, so we need to use the client
    const { createClient } = await import('@/lib/supabase/client');
    const { STORAGE_BUCKETS } = await import('@/lib/storage/config');
    const supabase = createClient();

    const fileName = `${path}/${Date.now()}.png`;
    const filePath = `${brandId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.BRAND_ASSETS)
      .upload(filePath, file);

    if (uploadError) {
      // Provide specific guidance for bucket not found
      if (uploadError.message?.includes('Bucket not found') || uploadError.name === 'StorageApiError') {
        console.error(`Storage bucket "${STORAGE_BUCKETS.BRAND_ASSETS}" not found. Please create it in Supabase Dashboard:
1. Go to Storage in Supabase Dashboard
2. Create a new bucket named "${STORAGE_BUCKETS.BRAND_ASSETS}"
3. Enable public access if needed
4. Configure RLS policies as required`);
      }
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.BRAND_ASSETS)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PNG:', error);
    return null;
  }
}
