import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { HomepageDocument } from '@/types/homepage';

class HomepageService {
  private readonly basePath = '/homepage';

  async get(): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.get<ApiResponse<HomepageDocument>>(this.basePath);
  }

  async updateHero(hero: Partial<HomepageDocument['hero']>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.put<ApiResponse<HomepageDocument>>(`${this.basePath}/hero`, hero);
  }
}

export const homepageService = new HomepageService();
