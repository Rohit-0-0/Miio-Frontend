import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { AboutData, AboutDocument } from '@/types/about';

class AboutService {
  private readonly basePath = '/about';

  async getAbout(): Promise<ApiResponse<AboutDocument>> {
    return apiClient.get<ApiResponse<AboutDocument>>(this.basePath);
  }

  async updateAbout(data: Partial<AboutData>): Promise<ApiResponse<AboutDocument>> {
    return apiClient.put<ApiResponse<AboutDocument>>(this.basePath, data);
  }
}

export const aboutService = new AboutService();
