import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { AboutData, AboutDocument } from '@/types/about';

export interface AboutDto {
  hero: { title: string; subtitle: string; };
  intro: { label: string; body: string; };
  story: { label: string; heading: string; paragraphs: string[]; founderImage?: string | null; altText?: string; };
  pullQuote: { text: string; };
  philosophy: { label: string; heading: string; paragraphs: string[]; };
  closing: { body: string; cta: { text: string; href: string; style: string; }; };
}

class EditorialService {
  async getAbout(): Promise<ApiResponse<AboutDto>> {
    return apiClient.get<ApiResponse<AboutDto>>('/editorial/about');
  }
}

export const editorialService = new EditorialService();

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
