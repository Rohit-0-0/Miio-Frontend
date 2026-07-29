import { env } from '@/config/env';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
    });

    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
      try {
        // Attempt token refresh
        const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData?.data?.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', refreshData.data.accessToken);
            // Retry original request
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            response = await fetch(url, {
              ...options,
              headers,
              credentials: 'include',
            });
          }
        } else {
          // Refresh failed, clear token and maybe redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            // window.location.href = '/login'; // Optional: Redirect to login
          }
        }
      } catch (e) {
        // Ignore refresh errors, they will just throw the 401
      }
    }

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Not a JSON response
      }
      const errorMessage = errorData?.message || `API error: ${response.statusText}`;
      const apiError = new Error(errorMessage);
      (apiError as any).status = response.status;
      (apiError as any).details = errorData?.details;
      (apiError as any).code = errorData?.code;
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
