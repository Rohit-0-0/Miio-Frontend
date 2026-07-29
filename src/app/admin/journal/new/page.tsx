import { PageHeader } from '@/components/admin/PageHeader';
import { JournalForm } from '@/components/admin/JournalForm';

export default function NewJournalPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create Article" 
        description="Draft a new journal article. It will not be visible on the public site until published."
      />
      <JournalForm />
    </div>
  );
}
