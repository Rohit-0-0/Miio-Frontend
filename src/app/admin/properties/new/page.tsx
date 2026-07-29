import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PageHeader } from '@/components/admin/PageHeader';
import { PropertyForm } from '@/components/admin/property/PropertyForm';

export default function NewPropertyPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader 
          title="Create Property" 
          description="Add a new property to the system."
        />
        <PropertyForm />
      </div>
    </PageContainer>
  );
}
