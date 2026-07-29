'use client';

import { useCallback } from 'react';
import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { PartnerForm } from '@/components/admin/partner/PartnerForm';
import { partnerService } from '@/services/partner.service';

export default function AdminPartnerPage() {
  const fetchData = useCallback(() => partnerService.getPartner().then(res => res.data), []);
  const updateData = useCallback((data: any) => partnerService.updatePartner(data).then(res => res.data), []);

  return (
    <div className="py-8">
      <SingletonEditor
        title="Edit Partner Page"
        fetchData={fetchData}
        updateData={updateData}
      >
        {(data, isSaving, onSave) => (
          <PartnerForm initialData={data} isSaving={isSaving} onSave={onSave} />
        )}
      </SingletonEditor>
    </div>
  );
}
