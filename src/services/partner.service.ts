import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { PartnerData, PartnerDocument } from '@/types/partner';

class PartnerService {
  private readonly basePath = '/partner';

  async getPartner(): Promise<ApiResponse<PartnerDocument>> {
    return apiClient.get<ApiResponse<PartnerDocument>>(this.basePath);
  }

  async updatePartner(data: Partial<PartnerData>): Promise<ApiResponse<PartnerDocument>> {
    return apiClient.put<ApiResponse<PartnerDocument>>(this.basePath, data);
  }
}

export const partnerService = new PartnerService();
