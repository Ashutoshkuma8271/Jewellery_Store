/**
 * Cloudinary & High-Performance Image Optimization Utilities
 * Automatically enhances URLs with auto-format (WebP/AVIF), auto-quality, and responsive sizing.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'limit';
}

/**
 * Returns an optimized image URL using Cloudinary or Unsplash CDN transformations.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
  }

  const { width = 800, quality = 'auto', format = 'auto', crop = 'fill' } = options;

  // Cloudinary URL transformation
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 8);
      const suffix = url.substring(uploadIndex + 8);
      const transforms = `f_${format},q_${quality},w_${width},c_${crop}`;
      return `${prefix}${transforms}/${suffix}`;
    }
    return url;
  }

  // Unsplash URL transformation
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', typeof quality === 'number' ? quality.toString() : '80');
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Helper to upload image to Cloudinary via backend API or directly
 */
export async function uploadImageToBackend(fileOrBase64: string | File): Promise<string> {
  let base64Data = '';
  if (typeof fileOrBase64 === 'string') {
    base64Data = fileOrBase64;
  } else {
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    });
  }

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('luxe_auth_token') : null;

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ image: base64Data })
  });

  const data = await res.json();
  if (res.ok && data.success && data.url) {
    return data.url;
  }

  // Return base64 as immediate fallback if server upload offline
  return base64Data;
}
