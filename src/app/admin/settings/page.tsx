import { PageContainer } from '@/components/admin/shared/PageContainer';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { EmptyState } from '@/components/shared/EmptyState';

export default function Page() {
  return (
    <PageContainer>
      <SectionCard>
        <EmptyState 
          title="Coming Soon" 
          description="This module is under construction." 
        />
      </SectionCard>
    </PageContainer>
  );
}
