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

export async function getPropertiesByIds(ids: string[]): Promise<ApiResponse<PropertyDocument[]>> {
  if (!ids || ids.length === 0) {
    return { success: true, message: 'No IDs provided', data: [] };
  }

  const queryString = `ids=${ids.join(',')}`;
  const url = `${env.NEXT_PUBLIC_API_URL}/properties/by-ids?${queryString}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties by ids: ${response.statusText}`);
  }

  return response.json();
}

export async function getPropertyBySlug(slug: string): Promise<ApiResponse<PropertyDocument>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/properties/slug/${slug}`;
  
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
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { success: false, message: 'Not found', data: null as unknown as PropertyDocument };
    }
    throw new Error(`Failed to fetch property by slug: ${response.statusText}`);
  }

  return response.json();
}
