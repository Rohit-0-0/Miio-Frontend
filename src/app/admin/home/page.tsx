'use client';

import React from 'react';
import { AdminGuard } from '@/components/admin/layout/AdminGuard';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { HeroEditor } from '@/components/admin/home/HeroEditor';
import { ComingSoon } from '@/components/admin/shared/ComingSoon';

export default function HomeAdminPage() {
  return (
    <AdminGuard>
      <PageContainer>
        {/* Hero – functional */}
        <SectionCard title="Homepage Hero">
          <HeroEditor />
        </SectionCard>
        
        {/* Placeholders for future sections */}
        <div className="mt-8 space-y-8 opacity-60 pointer-events-none grayscale">
          <SectionCard title="Featured Properties">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="Why Miio">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="Experiences">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="Testimonials">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="FAQ">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="Newsletter">
            <ComingSoon />
          </SectionCard>
          <SectionCard title="SEO">
            <ComingSoon />
          </SectionCard>
        </div>
      </PageContainer>
    </AdminGuard>
  );
}
