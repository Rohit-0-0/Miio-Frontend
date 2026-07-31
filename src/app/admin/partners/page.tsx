'use client';

import { useCallback } from 'react';
import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { PartnerForm } from '@/components/admin/partner/PartnerForm';
import { partnerService } from '@/services/partner.service';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PartnerData } from '@/types/partner';

export default function AdminPartnerPage() {
  const fetchData = useCallback(() => partnerService.getPartner().then(res => res.data), []);
  const updateData = useCallback((data: Partial<PartnerData>) => partnerService.updatePartner(data).then(res => res.data), []);

  return (
    <PageContainer>
      <SingletonEditor
        title="Partners CMS"
        fetchData={fetchData}
        updateData={updateData}
      >
        {(data, isSaving, onSave) => (
          <PartnerForm initialData={data} isSaving={isSaving} onSave={onSave} />
        )}
      </SingletonEditor>
    </PageContainer>
  );
}
