'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { journalService } from '@/services/journal.service';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export function AdminJournalActions({ id }: { id: string }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await journalService.deleteArticle(id);
      setIsConfirmOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Link
          href={`/admin/journal/${id}/edit`}
          className="text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          Edit
        </Link>
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="text-sm font-medium text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isProcessing={isDeleting}
      />
    </>
  );
}
