import { env } from '@/config/env';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { PropertyDocument } from '@/types/property';

export async function getPropertyListing<T = PropertyDocument>(
  params: Record<string, string | string[] | undefined>,
  options?: RequestInit
): Promise<PaginatedResponse<T>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/properties${queryString ? `?${queryString}` : ''}`;

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

  const response = await fetch(url, fetchOptions);

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
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties by ids: ${response.statusText}`);
  }

  return response.json();
}

export async function getPropertyById<T = PropertyDocument>(id: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/properties/${id}`;

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

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    if (response.status === 404) {
      return { success: false, message: 'Not found', data: null as unknown as T };
    }
    throw new Error(`Failed to fetch property by id: ${response.statusText}`);
  }

  return response.json();
}

export async function getPropertyBySlug<T = PropertyDocument>(slug: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${env.NEXT_PUBLIC_API_URL}/properties/slug/${slug}`;

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

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    if (response.status === 404) {
      return { success: false, message: 'Not found', data: null as unknown as T };
    }
    throw new Error(`Failed to fetch property by slug: ${response.statusText}`);
  }

  return response.json();
}
