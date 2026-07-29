import { notFound } from 'next/navigation';
import { journalService } from '@/services/journal.service';
import { PageHeader } from '@/components/admin/PageHeader';
import { JournalForm } from '@/components/admin/JournalForm';
import { ErrorState } from '@/components/shared/ErrorState';

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let article;
  let hasError = false;

  try {
    const response = await journalService.getArticleById(id);
    article = response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      if ((error as { response: { status?: number } }).response?.status === 404) {
        notFound();
      }
    }
    if (error && typeof error === 'object' && 'status' in error) {
      if ((error as { status?: number }).status === 404) {
        notFound();
      }
    }
    console.error('Failed to load article for editing:', error);
    hasError = true;
  }

  if (hasError || !article) {
    return (
      <div className="bg-white p-8 border border-gray-200 rounded-sm">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Article" 
        description={`Editing "${article.title}"`}
      />
      <JournalForm initialData={article} isEditMode={true} />
    </div>
  );
}
