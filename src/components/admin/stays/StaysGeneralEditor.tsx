import React, { useState, useEffect } from 'react';
import { GeneralSettings } from '@/types/stays-page';
import { SectionEditorHeader } from '../home/SectionEditorHeader';

interface StaysGeneralEditorProps {
  initialData: GeneralSettings;
  onSave: (data: GeneralSettings) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function StaysGeneralEditor({ initialData, onSave, onDirtyChange }: StaysGeneralEditorProps) {
  const [data, setData] = useState<GeneralSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleChange = (field: keyof GeneralSettings, value: string) => {
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

  const handleCancel = () => {
    setData(initialData);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <SectionEditorHeader
        title="General Settings"
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
              placeholder="e.g. All Stays"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intro Text
            </label>
            <textarea
              value={data.introText || ''}
              onChange={(e) => handleChange('introText', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g. Browse our carefully curated collection..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
