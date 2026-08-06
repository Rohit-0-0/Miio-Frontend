import { cache } from 'react';
import { env } from '@/config/env';
import { ApiResponse } from '@/types/api';
import { HomepageDocument } from '@/types/homepage';

export const getHomepage = cache(async (): Promise<HomepageDocument | null> => {
  const url = `${env.NEXT_PUBLIC_API_URL}/homepage`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      next: { revalidate: 0 } // Disable caching to see immediate Sanity Studio updates
    });

    if (!response.ok) {
      console.error(`Failed to fetch homepage: ${response.statusText}`);
      return null;
    }

    const data: ApiResponse<HomepageDocument> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null; // Graceful fallback
  }
});
