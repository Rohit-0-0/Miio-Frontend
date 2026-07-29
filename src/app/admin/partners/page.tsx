'use client';

import { SingletonEditor } from '@/components/admin/singleton/SingletonEditor';
import { PartnerForm } from '@/components/admin/partner/PartnerForm';
import { partnerService } from '@/services/partner.service';

export default function AdminPartnerPage() {
  return (
    <div className="py-8">
      <SingletonEditor
        title="Edit Partner Page"
        fetchData={() => partnerService.getPartner().then(res => res.data)}
        updateData={(data) => partnerService.updatePartner(data).then(res => res.data)}
      >
        {(data, isSaving, onSave) => (
          <PartnerForm initialData={data} isSaving={isSaving} onSave={onSave} />
        )}
      </SingletonEditor>
    </div>
  );
}
