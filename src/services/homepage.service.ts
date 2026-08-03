import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { 
  HomepageDocument,
  HeroSection,
  FeaturedPropertiesSection,
  EditorialStatementSection,
  LocationsSection,
  TrustSection,
  JournalSection,
  FinalCtaSection,
  SeoSection
} from '@/types/homepage';

class HomepageService {
  private readonly basePath = '/homepage';

  async get(): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.get<ApiResponse<HomepageDocument>>(this.basePath);
  }

  async updateHero(data: Partial<HeroSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/hero`, data);
  }

  async updateFeaturedProperties(data: Partial<FeaturedPropertiesSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/featured-properties`, data);
  }

  async updateEditorialStatement(data: Partial<EditorialStatementSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/editorial-statement`, data);
  }

  async updateLocations(data: Partial<LocationsSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/locations`, data);
  }

  async updateTrust(data: Partial<TrustSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/trust`, data);
  }

  async updateJournal(data: Partial<JournalSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/journal`, data);
  }

  async updateFinalCta(data: Partial<FinalCtaSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/final-cta`, data);
  }

  async updateSeo(data: Partial<SeoSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/seo`, data);
  }
}

export const homepageService = new HomepageService();
