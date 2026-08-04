import React, { useState, useEffect } from 'react';
import { EmptyStateSettings } from '@/types/stays-page';
import { SectionEditorHeader } from '../home/SectionEditorHeader';
import { ImageUploader } from '../../media/ImageUploader';
import { ImageAsset } from '@/types/common';

interface StaysEmptyStateEditorProps {
  initialData: EmptyStateSettings;
  onSave: (data: EmptyStateSettings) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function StaysEmptyStateEditor({ initialData, onSave, onDirtyChange }: StaysEmptyStateEditorProps) {
  const [data, setData] = useState<EmptyStateSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleChange = (field: keyof EmptyStateSettings, value: string | ImageAsset | undefined | null) => {
    setData((prev) => ({ ...prev, [field]: value || undefined }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setData(initialData);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <SectionEditorHeader
        title="Empty State Settings"
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={data.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g. No stays available"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g. We're currently updating our curated collection..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={data.ctaText || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g. Return Home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Link
              </label>
              <input
                type="text"
                value={data.ctaLink || ''}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g. /"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <ImageUploader
              value={data.image}
              onChange={(img) => handleChange('image', img)}
              label="Optional Illustration / Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
