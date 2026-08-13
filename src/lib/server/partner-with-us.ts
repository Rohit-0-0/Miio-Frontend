import { cache } from 'react';
import { env } from '@/config/env';
import { ApiResponse } from '@/types/api';

export interface PartnerWithUsData {
  headline: string;
  problem: string;
  solution: string;
  processCtaText?: string;
  ctaButton?: {
    label?: string;
    link?: string;
  };
}

export const getPartnerWithUsData = cache(async (options?: RequestInit): Promise<PartnerWithUsData | null> => {
  const url = `${env.NEXT_PUBLIC_API_URL}/partner-with-us`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers,
    ...options,
  };

  if (options?.next) {
    fetchOptions.next = options.next;
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.error(`Failed to fetch partner-with-us data: ${response.statusText}`);
      return null;
    }

    const data: ApiResponse<PartnerWithUsData> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching partner-with-us data:', error);
    return null;
  }
});
