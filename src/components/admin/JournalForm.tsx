'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JournalArticle, CreateJournalInput, UpdateJournalInput } from '@/types/journal';
import { journalService } from '@/services/journal.service';
import Link from 'next/link';

interface JournalFormProps {
  initialData?: JournalArticle;
  isEditMode?: boolean;
}

export function JournalForm({ initialData, isEditMode = false }: JournalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: CreateJournalInput = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string || undefined,
      content: formData.get('content') as string,
      author: formData.get('author') as string || undefined,
      category: formData.get('category') as string || undefined,
      status: formData.get('status') as 'draft' | 'published' | 'archived',
      featured: formData.get('featured') === 'on',
    };

    const assetId = formData.get('coverImageId') as string;
    const alt = formData.get('coverImageAlt') as string;
    if (assetId) {
      data.coverImage = { assetId, alt: alt || data.title };
    }

    try {
      if (isEditMode && initialData) {
        await journalService.updateArticle(initialData._id, data as UpdateJournalInput);
      } else {
        await journalService.createArticle(data);
      }
      router.push('/admin/journal');
      router.refresh(); // Refresh the list
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while saving.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-50 rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={initialData?.title}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={initialData?.excerpt}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={initialData?.category}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={initialData?.author}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status || 'draft'}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-1 flex items-center h-full pt-6">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            defaultChecked={initialData?.featured}
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
            Featured Article
          </label>
        </div>

        <div className="space-y-1 md:col-span-2 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Cover Image (Sanity Asset ID)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coverImageId" className="block text-xs font-medium text-gray-700 mb-1">Asset ID</label>
              <input
                type="text"
                id="coverImageId"
                name="coverImageId"
                placeholder="e.g. image-xxxx-1200x800-jpg"
                defaultValue={initialData?.coverImage?.assetId}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="coverImageAlt" className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                id="coverImageAlt"
                name="coverImageAlt"
                defaultValue={initialData?.coverImage?.alt}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2 border-t border-gray-100 pt-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content <span className="text-red-500">*</span></label>
          <textarea
            id="content"
            name="content"
            required
            rows={15}
            defaultValue={initialData?.content}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 font-mono text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Write your article content here..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <Link
          href="/admin/journal"
          className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Article')}
        </button>
      </div>
    </form>
  );
}
