/** Backend API base must include `/api/v1` (Node does not resolve bare origins). */
function normalizeApiUrl(raw: string | undefined): string {
  const fallback = 'http://localhost:8000/api/v1';
  if (!raw?.trim()) return fallback;
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api/v1')) return trimmed;
  return `${trimmed}/api/v1`;
}

export const env = {
  NEXT_PUBLIC_API_URL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
};
