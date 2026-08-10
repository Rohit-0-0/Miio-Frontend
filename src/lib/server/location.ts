import { env } from '@/config/env';

export async function getLocationBySlug(slug: string, options?: RequestInit) {
  try {
    const fetchOptions: RequestInit = {
      ...options,
    };
    if (options?.next) {
      fetchOptions.next = options.next;
    } else if (options?.cache === undefined) {
      fetchOptions.next = { revalidate: 0 };
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/editorial/locations/${slug}`, fetchOptions);
    
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

export async function getLocations(options?: RequestInit) {
  try {
    const fetchOptions: RequestInit = {
      ...options,
    };
    if (options?.next) {
      fetchOptions.next = options.next;
    } else if (options?.cache === undefined) {
      fetchOptions.next = { revalidate: 0 };
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/editorial/locations`, fetchOptions);
    
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
