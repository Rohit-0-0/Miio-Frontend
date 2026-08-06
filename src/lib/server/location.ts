import { env } from '@/config/env';

export async function getLocationBySlug(slug: string) {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/editorial/locations/${slug}`, {
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch location: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

export async function getLocations() {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/editorial/locations`, {
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch locations: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}
