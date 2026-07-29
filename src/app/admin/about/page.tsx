'use client';

import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { AboutForm } from '@/components/admin/about/AboutForm';
import { aboutService } from '@/services/about.service';

export default function AdminAboutPage() {
  return (
    <div className="py-8">
      <SingletonEditor
        title="Edit About Page"
        fetchData={() => aboutService.getAbout().then(res => res.data)}
        updateData={(data) => aboutService.updateAbout(data).then(res => res.data)}
      >
        {(data, isSaving, onSave) => (
          <AboutForm initialData={data} isSaving={isSaving} onSave={onSave} />
        )}
      </SingletonEditor>
    </div>
  );
}
