'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from './SectionEditorHeader';
import { JournalSection } from '@/types/homepage';

export interface JournalPreviewEditorProps {
  initialData?: JournalSection;
  onSave: (data: Partial<JournalSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const DEFAULT_DATA: JournalSection = {
  heading: 'The Journal',
  ctaText: 'Read the Journal',
  ctaLink: '/journal',
};

export function JournalPreviewEditor({ initialData, onSave, onDirtyChange }: JournalPreviewEditorProps) {
  const [data, setData] = useState<JournalSection>(initialData || DEFAULT_DATA);
  const [prevInitialData, setPrevInitialData] = useState<JournalSection | undefined>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    if (initialData) {
      setData(initialData);
      setIsDirty(false);
    }
  }

  useEffect(() => {
    if (initialData) {
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const handleChange = (updates: Partial<JournalSection>) => {
    setData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    onDirtyChange(true);
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(data);
      setSuccess('Journal preview saved successfully');
      setIsDirty(false);
      onDirtyChange(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
      <SectionEditorHeader
        title="Journal Preview"
        isDirty={isDirty}
        isSaving={saving}
        updatedAt={data.updatedAt}
        onSave={handleSave}
        error={error}
        success={success}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
        <input 
          className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
          value={data.heading} 
          onChange={e => handleChange({ heading: e.target.value })} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.ctaText} 
            onChange={e => handleChange({ ctaText: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.ctaLink} 
            onChange={e => handleChange({ ctaLink: e.target.value })} 
          />
        </div>
      </div>
    </div>
  );
}
