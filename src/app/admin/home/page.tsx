'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { HeroEditor } from '@/components/admin/home/HeroEditor';
import { FeaturedPropertiesEditor } from '@/components/admin/home/FeaturedPropertiesEditor';
import { EditorialStatementEditor } from '@/components/admin/home/EditorialStatementEditor';
import { LocationsEditor } from '@/components/admin/home/LocationsEditor';
import { TrustEditor } from '@/components/admin/home/TrustEditor';
import { JournalPreviewEditor } from '@/components/admin/home/JournalPreviewEditor';
import { FinalCtaEditor } from '@/components/admin/home/FinalCtaEditor';
import { SeoEditor } from '@/components/admin/home/SeoEditor';
import { homepageService } from '@/services/homepage.service';
import { HomepageDocument, HeroSection, FeaturedPropertiesSection, EditorialStatementSection, LocationsSection, TrustSection, JournalSection, FinalCtaSection, SeoSection } from '@/types/homepage';

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

  const handleDirtyChange = useCallback((section: string, isDirty: boolean) => {
    setDirtyStates(prev => {
      if (prev[section] === isDirty) return prev;
      return { ...prev, [section]: isDirty };
    });
  }, []);

  const dirtyHandlers = useMemo(() => ({
    hero: (isDirty: boolean) => handleDirtyChange('hero', isDirty),
    featuredProperties: (isDirty: boolean) => handleDirtyChange('featuredProperties', isDirty),
    editorialStatement: (isDirty: boolean) => handleDirtyChange('editorialStatement', isDirty),
    locations: (isDirty: boolean) => handleDirtyChange('locations', isDirty),
    trust: (isDirty: boolean) => handleDirtyChange('trust', isDirty),
    journal: (isDirty: boolean) => handleDirtyChange('journal', isDirty),
    finalCta: (isDirty: boolean) => handleDirtyChange('finalCta', isDirty),
    seo: (isDirty: boolean) => handleDirtyChange('seo', isDirty),
  }), [handleDirtyChange]);

  const handleSaveHero = async (heroData: Partial<HeroSection>) => {
    const res = await homepageService.updateHero(heroData);
    setData(res.data);
  };
  const handleSaveFeatured = async (featuredData: Partial<FeaturedPropertiesSection>) => {
    const res = await homepageService.updateFeaturedProperties(featuredData);
    setData(res.data);
  };
  const handleSaveEditorialStatement = async (edData: Partial<EditorialStatementSection>) => {
    const res = await homepageService.updateEditorialStatement(edData);
    setData(res.data);
  };
  const handleSaveLocations = async (locData: Partial<LocationsSection>) => {
    const res = await homepageService.updateLocations(locData);
    setData(res.data);
  };
  const handleSaveTrust = async (trustData: Partial<TrustSection>) => {
    const res = await homepageService.updateTrust(trustData);
    setData(res.data);
  };
  const handleSaveJournal = async (journalData: Partial<JournalSection>) => {
    const res = await homepageService.updateJournal(journalData);
    setData(res.data);
  };
  const handleSaveFinalCta = async (ctaData: Partial<FinalCtaSection>) => {
    const res = await homepageService.updateFinalCta(ctaData);
    setData(res.data);
  };
  const handleSaveSeo = async (seoData: Partial<SeoSection>) => {
    const res = await homepageService.updateSeo(seoData);
    setData(res.data);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded w-full"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer>
        <div className="text-red-600">Failed to load homepage data: {error}</div>
      </PageContainer>
    );
  }

  return (
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
            onDirtyChange={dirtyHandlers.hero}
          />
        </SectionCard>
        
        <SectionCard title="Featured Properties">
          <FeaturedPropertiesEditor
            initialData={data.featuredProperties as FeaturedPropertiesSection}
            onSave={handleSaveFeatured}
            onDirtyChange={dirtyHandlers.featuredProperties}
          />
        </SectionCard>
        
        <SectionCard title="Editorial Statement">
          <EditorialStatementEditor
            initialData={data.editorialStatement as EditorialStatementSection}
            onSave={handleSaveEditorialStatement}
            onDirtyChange={dirtyHandlers.editorialStatement}
          />
        </SectionCard>
        
        <SectionCard title="Locations">
          <LocationsEditor
            initialData={data.locations as LocationsSection}
            onSave={handleSaveLocations}
            onDirtyChange={dirtyHandlers.locations}
          />
        </SectionCard>
        
        <SectionCard title="Trust / Miio Standard">
          <TrustEditor
            initialData={data.trust as TrustSection}
            onSave={handleSaveTrust}
            onDirtyChange={dirtyHandlers.trust}
          />
        </SectionCard>
        
        <SectionCard title="Journal Preview">
          <JournalPreviewEditor
            initialData={data.journal as JournalSection}
            onSave={handleSaveJournal}
            onDirtyChange={dirtyHandlers.journal}
          />
        </SectionCard>
        
        <SectionCard title="Final CTA">
          <FinalCtaEditor
            initialData={data.finalCta as FinalCtaSection}
            onSave={handleSaveFinalCta}
            onDirtyChange={dirtyHandlers.finalCta}
          />
        </SectionCard>
        
        <SectionCard title="SEO">
          <SeoEditor
            initialData={data.seo as SeoSection}
            onSave={handleSaveSeo}
            onDirtyChange={dirtyHandlers.seo}
          />
        </SectionCard>
      </div>
      </PageContainer>
  );
}
