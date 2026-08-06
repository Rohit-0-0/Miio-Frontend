import { env } from '@/config/env';

export class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData?.data?.accessToken;
        
        if (newAccessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
          return newAccessToken;
        }
      }
    } catch {
      // Ignore refresh errors
    }

    // Refresh failed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return null;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Retrieve access token from localStorage (if running in browser)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent for refresh
      cache: 'no-store', // Disable aggressive Next.js caching to always fetch fresh data
    });

    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
      if (!this.refreshPromise) {
        this.refreshPromise = this.performRefresh().finally(() => {
          this.refreshPromise = null;
        });
      }

      const newAccessToken = await this.refreshPromise;

      if (newAccessToken) {
        // Retry original request
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
          cache: 'no-store', // Disable aggressive Next.js caching
        });
      } else {
        // Refresh failed, let it fall through and throw the 401
      }
    }

    if (!response.ok) {
      let errorData: Record<string, unknown> | null = null;
      try {
        errorData = await response.json();
      } catch {
        // Not a JSON response
      }
      const errorMessage = typeof errorData?.message === 'string' ? errorData.message : `API error: ${response.statusText}`;
      const apiError = new Error(errorMessage) as Error & { status?: number; details?: unknown; code?: unknown };
      apiError.status = response.status;
      apiError.details = errorData?.details;
      apiError.code = errorData?.code;
      throw apiError;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(env.NEXT_PUBLIC_API_URL);
