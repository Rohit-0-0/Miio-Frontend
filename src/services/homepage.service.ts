import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { 
  HomepageDocument,
  HeroSection,
  FeaturedPropertiesSection,
  WhyMiioSection,
  ExperiencesSection,
  TestimonialsSection,
  FaqSection,
  NewsletterSection,
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

  async updateWhyMiio(data: Partial<WhyMiioSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/why-miio`, data);
  }

  async updateExperiences(data: Partial<ExperiencesSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/experiences`, data);
  }

  async updateTestimonials(data: Partial<TestimonialsSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/testimonials`, data);
  }

  async updateFaq(data: Partial<FaqSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/faq`, data);
  }

  async updateNewsletter(data: Partial<NewsletterSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/newsletter`, data);
  }

  async updateSeo(data: Partial<SeoSection>): Promise<ApiResponse<HomepageDocument>> {
    return apiClient.patch<ApiResponse<HomepageDocument>>(`${this.basePath}/seo`, data);
  }
}

export const homepageService = new HomepageService();
