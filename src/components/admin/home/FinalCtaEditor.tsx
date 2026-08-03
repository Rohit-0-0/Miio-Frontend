'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from './SectionEditorHeader';
import { FinalCtaSection } from '@/types/homepage';

export interface FinalCtaEditorProps {
  initialData?: FinalCtaSection;
  onSave: (data: Partial<FinalCtaSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const DEFAULT_DATA: FinalCtaSection = {
  heading: 'Ready to stay with us?',
  description: 'Book your perfect getaway today.',
  buttonText: 'Book a Stay',
  buttonLink: '/properties',
};

export function FinalCtaEditor({ initialData, onSave, onDirtyChange }: FinalCtaEditorProps) {
  const [data, setData] = useState<FinalCtaSection>(initialData || DEFAULT_DATA);
  const [prevInitialData, setPrevInitialData] = useState<FinalCtaSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<FinalCtaSection>) => {
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
      setSuccess('Final CTA saved successfully');
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
        title="Final CTA"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea 
          className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
          rows={2}
          value={data.description || ''} 
          onChange={e => handleChange({ description: e.target.value })} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.buttonText} 
            onChange={e => handleChange({ buttonText: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.buttonLink} 
            onChange={e => handleChange({ buttonLink: e.target.value })} 
          />
        </div>
      </div>
    </div>
  );
}
