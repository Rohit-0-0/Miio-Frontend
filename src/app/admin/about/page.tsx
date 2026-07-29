'use client';

import { useCallback } from 'react';
import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { AboutForm } from '@/components/admin/about/AboutForm';
import { aboutService } from '@/services/about.service';
import { PageContainer } from '@/components/admin/shared/PageContainer';

export default function AdminAboutPage() {
  const fetchData = useCallback(() => aboutService.getAbout().then(res => res.data), []);
  const updateData = useCallback((data: any) => aboutService.updateAbout(data).then(res => res.data), []);

  return (
    <PageContainer>
      <SingletonEditor
        title="About CMS"
        fetchData={fetchData}
        updateData={updateData}
      >
        {(data, isSaving, onSave) => (
          <AboutForm
            initialData={data}
            isSaving={isSaving}
            onSave={onSave}
          />
        )}
      </SingletonEditor>
    </PageContainer>
  );
}
