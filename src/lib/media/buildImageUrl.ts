import { env } from '@/config/env';

export function buildImageUrl(assetId?: string | null): string | null {
  if (!assetId || !assetId.startsWith('image-')) {
    return null;
  }

  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;

  console.log('--- BUILD_IMAGE_URL TRACE ---');
  console.log('1. incoming assetId:', assetId);
  console.log('2. projectId:', projectId);
  console.log('3. dataset:', dataset);
  console.log('-----------------------------');

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

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`;
}
