import React, { useState, useEffect } from 'react';
import { SeoSettings } from '@/types/stays-page';
import { SectionEditorHeader } from '../home/SectionEditorHeader';
import { ImageUploader } from '../../media/ImageUploader';

interface StaysSeoEditorProps {
  initialData?: SeoSettings;
  onSave: (data: SeoSettings) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function StaysSeoEditor({ initialData = {}, onSave, onDirtyChange }: StaysSeoEditorProps) {
  const [data, setData] = useState<SeoSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleChange = (field: keyof SeoSettings, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <SectionEditorHeader
        title="SEO Settings"
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
              Meta Title
            </label>
            <input
              type="text"
              value={data.metaTitle || ''}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={data.metaDescription || ''}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              value={data.keywords?.join(', ') || ''}
              onChange={(e) => handleChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <ImageUploader
              value={data.ogImage}
              onChange={(img) => handleChange('ogImage', img)}
              label="OG Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
