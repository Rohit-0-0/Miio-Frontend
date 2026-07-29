'use client';
import React, { useEffect, useState, useRef } from 'react';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { NewsletterSection } from '@/types/homepage';

export interface NewsletterEditorProps {
  initialData?: NewsletterSection;
  onSave: (data: Partial<NewsletterSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function NewsletterEditor({ initialData, onSave, onDirtyChange }: NewsletterEditorProps) {
  const defaultData: NewsletterSection = {
    heading: 'Subscribe to our Newsletter',
    description: 'Get the latest updates and offers directly in your inbox.',
    ctaText: 'Subscribe',
  };

  const [data, setData] = useState<NewsletterSection>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isDirty = useRef(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      isDirty.current = false;
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const handleChange = (updates: Partial<NewsletterSection>) => {
    setData(prev => ({ ...prev, ...updates }));
    isDirty.current = true;
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
      setSuccess('Newsletter section saved successfully');
      isDirty.current = false;
      onDirtyChange(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
        <SectionEditorHeader
          title="Newsletter Settings"
          isDirty={isDirty.current}
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
            required 
            value={data.heading} 
            onChange={e => handleChange({ heading: e.target.value })} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            required
            value={data.description} 
            onChange={e => handleChange({ description: e.target.value })} 
            rows={3} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            required 
            value={data.ctaText} 
            onChange={e => handleChange({ ctaText: e.target.value })} 
          />
        </div>
      </div>

      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Read-only Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-gray-50 p-12 text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl text-gray-900 mb-4">{data.heading}</h2>
          <p className="text-gray-500 mb-8 max-w-md">{data.description}</p>
          
          <div className="flex w-full max-w-md gap-2 opacity-70 grayscale">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 rounded-sm border-gray-300 px-4 py-3 border focus:outline-none"
              disabled
            />
            <button 
              type="button" 
              className="bg-gray-900 text-white px-6 py-3 rounded-sm whitespace-nowrap"
              disabled
            >
              {data.ctaText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
