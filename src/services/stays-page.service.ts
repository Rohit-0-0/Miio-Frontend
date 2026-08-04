import { apiClient } from '@/lib/api/client';
import type { 
  StaysPageData, 
  GeneralSettings, 
  FilterConfiguration, 
  EmptyStateSettings 
} from '@/types/stays-page';

export const staysPageService = {
  get: async (): Promise<StaysPageData> => {
    const response = await apiClient.get<{ success: boolean; data: StaysPageData }>('/stays-page');
    return response.data;
  },

  updateGeneral: async (data: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const response = await apiClient.patch<{ success: boolean; data: GeneralSettings }>('/stays-page/general', data);
    return response.data;
  },

  updateFilters: async (data: Partial<FilterConfiguration>): Promise<FilterConfiguration> => {
    const response = await apiClient.patch<{ success: boolean; data: FilterConfiguration }>('/stays-page/filters', data);
    return response.data;
  },

  updateEmptyState: async (data: Partial<EmptyStateSettings>): Promise<EmptyStateSettings> => {
    const response = await apiClient.patch<{ success: boolean; data: EmptyStateSettings }>('/stays-page/empty-state', data);
    return response.data;
  },

  updateSeo: async (data: any): Promise<any> => {
    const response = await apiClient.patch<{ success: boolean; data: any }>('/stays-page/seo', data);
    return response.data;
  },
};
