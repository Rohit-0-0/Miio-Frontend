import { env } from '@/config/env';

export interface ImageUrlOptions {
  width?: number;
  quality?: number;
}

export function buildImageUrl(
  assetId?: string | null,
  options?: ImageUrlOptions
): string | null {
  if (!assetId) return null;

  if (assetId.startsWith('http://') || assetId.startsWith('https://')) {
    return assetId;
  }

  if (!assetId.startsWith('image-')) {
    return null;
  }

  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  // Standard sanity URL builder translation.
  // Converts: image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg
  // To: Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg
  let filename = assetId.replace(/^image-/, '');
  const lastDashIndex = filename.lastIndexOf('-');
  if (lastDashIndex !== -1) {
    filename = filename.substring(0, lastDashIndex) + '.' + filename.substring(lastDashIndex + 1);
  }

  // Never apply raster resize/compression parameters to SVG images
  if (filename.toLowerCase().endsWith('.svg')) {
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`;
  }

  const width = options?.width ?? 2560;
  const quality = options?.quality ?? 100;

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}?auto=format&w=${width}&q=${quality}&fit=max`;
}
