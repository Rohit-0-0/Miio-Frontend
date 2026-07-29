import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { PropertyDocument } from '@/types/property';

export async function getPropertyListing(
  params: Record<string, string | string[] | undefined>
): Promise<PaginatedResponse<PropertyDocument>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/properties${queryString ? `?${queryString}` : ''}`;
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken.value}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
    cache: 'no-store', // Since we rely on authorization and real-time status
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  return response.json();
}
