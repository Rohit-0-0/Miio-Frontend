'use client';

import { useCallback } from 'react';
import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { AboutForm } from '@/components/admin/about/AboutForm';
import { aboutService } from '@/services/about.service';

export default function AdminAboutPage() {
  const fetchData = useCallback(() => aboutService.getAbout().then(res => res.data), []);
  const updateData = useCallback((data: any) => aboutService.updateAbout(data).then(res => res.data), []);

  return (
    <div className="py-8">
      <SingletonEditor
        title="Edit About Page"
        fetchData={fetchData}
        updateData={updateData}
      >
        {(data, isSaving, onSave) => (
          <AboutForm initialData={data} isSaving={isSaving} onSave={onSave} />
        )}
      </SingletonEditor>
    </div>
  );
}
