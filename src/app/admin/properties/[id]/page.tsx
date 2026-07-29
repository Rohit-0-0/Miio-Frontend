import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PageHeader } from '@/components/admin/PageHeader';
import { PropertyForm } from '@/components/admin/property/PropertyForm';
import { propertyService } from '@/services/property.service';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let property;
  try {
    const response = await propertyService.get(resolvedParams.id);
    property = response.data;
  } catch (error) {
    console.error('Failed to load property:', error);
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader 
          title="Edit Property" 
          description={`Update details for ${property.title}`}
        />
        <PropertyForm initialData={property} />
      </div>
    </PageContainer>
  );
}
