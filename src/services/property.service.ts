import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { PropertyData, PropertyDocument } from '@/types/property';

class PropertyService {
  private readonly basePath = '/properties';

  async list(params?: Record<string, string | number | boolean>): Promise<PaginatedResponse<PropertyDocument>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    return apiClient.get<PaginatedResponse<PropertyDocument>>(endpoint);
  }

  async get(id: string): Promise<ApiResponse<PropertyDocument>> {
    return apiClient.get<ApiResponse<PropertyDocument>>(`${this.basePath}/${id}`);
  }

  async create(data: Partial<PropertyData>): Promise<ApiResponse<PropertyDocument>> {
    return apiClient.post<ApiResponse<PropertyDocument>>(this.basePath, data);
  }

  async update(id: string, data: Partial<PropertyData>): Promise<ApiResponse<PropertyDocument>> {
    return apiClient.put<ApiResponse<PropertyDocument>>(`${this.basePath}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }
}

export const propertyService = new PropertyService();
