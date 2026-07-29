import { partnerService } from '@/services/partner.service';
import { ApiResponse } from '@/types/api';
import { PartnerDocument } from '@/types/partner';

export async function getPartnerData(): Promise<ApiResponse<PartnerDocument>> {
  // Can add caching/revalidation wrappers here if needed
  return partnerService.getPartner();
}
