'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AdminGuard } from '@/components/admin/layout/AdminGuard';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { HeroEditor } from '@/components/admin/home/HeroEditor';
import { FeaturedPropertiesEditor } from '@/components/admin/home/FeaturedPropertiesEditor';
import { WhyMiioEditor } from '@/components/admin/home/WhyMiioEditor';
import { ExperiencesEditor } from '@/components/admin/home/ExperiencesEditor';
import { TestimonialsEditor } from '@/components/admin/home/TestimonialsEditor';
import { FaqEditor } from '@/components/admin/home/FaqEditor';
import { NewsletterEditor } from '@/components/admin/home/NewsletterEditor';
import { SeoEditor } from '@/components/admin/home/SeoEditor';
import { homepageService } from '@/services/homepage.service';
import { HomepageDocument, HomepageData, HeroSection, FeaturedPropertiesSection, WhyMiioSection, ExperiencesSection, TestimonialsSection, FaqSection, NewsletterSection, SeoSection } from '@/types/homepage';

export default function HomeAdminPage() {
  const [data, setData] = useState<HomepageDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track dirty state per section
  const [dirtyStates, setDirtyStates] = useState<Record<string, boolean>>({});
  
  const isAnyDirty = Object.values(dirtyStates).some(Boolean);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await homepageService.get();
        setData(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  // Prevent navigation if any section is dirty
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [isAnyDirty]);

  const handleDirtyChange = (section: string, isDirty: boolean) => {
    setDirtyStates(prev => ({ ...prev, [section]: isDirty }));
  };

  const handleSaveHero = async (heroData: Partial<HeroSection>) => {
    const res = await homepageService.updateHero(heroData);
    setData(res.data);
  };
  const handleSaveFeatured = async (featuredData: Partial<FeaturedPropertiesSection>) => {
    const res = await homepageService.updateFeaturedProperties(featuredData);
    setData(res.data);
  };
  const handleSaveWhyMiio = async (whyMiioData: Partial<WhyMiioSection>) => {
    const res = await homepageService.updateWhyMiio(whyMiioData);
    setData(res.data);
  };
  const handleSaveExperiences = async (expData: Partial<ExperiencesSection>) => {
    const res = await homepageService.updateExperiences(expData);
    setData(res.data);
  };
  const handleSaveTestimonials = async (testData: Partial<TestimonialsSection>) => {
    const res = await homepageService.updateTestimonials(testData);
    setData(res.data);
  };
  const handleSaveFaq = async (faqData: Partial<FaqSection>) => {
    const res = await homepageService.updateFaq(faqData);
    setData(res.data);
  };
  const handleSaveNewsletter = async (newsData: Partial<NewsletterSection>) => {
    const res = await homepageService.updateNewsletter(newsData);
    setData(res.data);
  };
  const handleSaveSeo = async (seoData: Partial<SeoSection>) => {
    const res = await homepageService.updateSeo(seoData);
    setData(res.data);
  };

  if (loading) {
    return (
      <AdminGuard>
        <PageContainer>
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </PageContainer>
      </AdminGuard>
    );
  }

  if (error || !data) {
    return (
      <AdminGuard>
        <PageContainer>
          <div className="text-red-600">Failed to load homepage data: {error}</div>
        </PageContainer>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <PageContainer>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage CMS</h1>
            <p className="text-gray-500 mt-1">Manage the content and sections of the public homepage.</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Version {data.version || 1}
          </div>
        </div>

        <div className="space-y-8">
          <SectionCard title="Homepage Hero">
            <HeroEditor
              initialData={data.hero}
              onSave={handleSaveHero}
              onDirtyChange={(isDirty) => handleDirtyChange('hero', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="Featured Properties">
            <FeaturedPropertiesEditor
              initialData={data.featuredProperties as FeaturedPropertiesSection}
              onSave={handleSaveFeatured}
              onDirtyChange={(isDirty) => handleDirtyChange('featuredProperties', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="Why Miio">
            <WhyMiioEditor
              initialData={data.whyMiio as WhyMiioSection}
              onSave={handleSaveWhyMiio}
              onDirtyChange={(isDirty) => handleDirtyChange('whyMiio', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="Experiences">
            <ExperiencesEditor
              initialData={data.experiences as ExperiencesSection}
              onSave={handleSaveExperiences}
              onDirtyChange={(isDirty) => handleDirtyChange('experiences', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="Testimonials">
            <TestimonialsEditor
              initialData={data.testimonials as TestimonialsSection}
              onSave={handleSaveTestimonials}
              onDirtyChange={(isDirty) => handleDirtyChange('testimonials', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="FAQ">
            <FaqEditor
              initialData={data.faq as FaqSection}
              onSave={handleSaveFaq}
              onDirtyChange={(isDirty) => handleDirtyChange('faq', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="Newsletter">
            <NewsletterEditor
              initialData={data.newsletter as NewsletterSection}
              onSave={handleSaveNewsletter}
              onDirtyChange={(isDirty) => handleDirtyChange('newsletter', isDirty)}
            />
          </SectionCard>
          
          <SectionCard title="SEO">
            <SeoEditor
              initialData={data.seo as SeoSection}
              onSave={handleSaveSeo}
              onDirtyChange={(isDirty) => handleDirtyChange('seo', isDirty)}
            />
          </SectionCard>
        </div>
      </PageContainer>
    </AdminGuard>
  );
}
