import { env } from '@/config/env';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { PropertyDocument } from '@/types/property';

function generateBaseSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

export async function getPropertyById<T = PropertyDocument>(
  id: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
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

/**
 * Resolve a property by human slug.
 * 1) /properties/slug/:slug
 * 2) If that 404s, find matching Guesty listing then load full details by id
 */
export async function getPropertyBySlug<T = PropertyDocument>(
  slug: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
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

  if (response.ok) {
    return response.json();
  }

  if (response.status !== 404) {
    throw new Error(`Failed to fetch property by slug: ${response.statusText}`);
  }

  // Fallback: current production backend only resolves Guesty by id, not by slug
  try {
    const listing = await getPropertyListing<{
      id?: string;
      _id?: string;
      slug?: string;
      title?: string;
      unitType?: string;
    }>({ limit: '100' }, options);

    const items = listing.data || [];
    const matches = items.filter((item) => {
      const itemSlug = item.slug || (item.title ? generateBaseSlug(item.title) : '');
      return itemSlug === slug;
    });

    if (matches.length === 0) {
      return { success: false, message: 'Not found', data: null as unknown as T };
    }

    const preferred =
      matches.find((item) => item.unitType && item.unitType !== 'MTL_CHILD') || matches[0];
    const id = preferred?.id || preferred?._id;

    if (!id) {
      return { success: false, message: 'Not found', data: null as unknown as T };
    }

    return getPropertyById<T>(id, options);
  } catch (error) {
    console.error('Slug fallback via property listing failed:', error);
    return { success: false, message: 'Not found', data: null as unknown as T };
  }
}
