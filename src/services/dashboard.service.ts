import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { DashboardResponse } from '@/types/dashboard';

class DashboardService {
  private readonly basePath = '/dashboard';

  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await apiClient.get<ApiResponse<DashboardResponse>>(this.basePath);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
