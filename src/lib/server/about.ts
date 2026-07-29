import { aboutService } from '@/services/about.service';
import { ApiResponse } from '@/types/api';
import { AboutDocument } from '@/types/about';

export async function getAboutData(): Promise<ApiResponse<AboutDocument>> {
  // Add caching layer here when Next.js fetch config is updated if needed
  return aboutService.getAbout();
}
