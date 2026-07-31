'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { FeaturedPropertiesSection, FeaturedPropertiesMode } from '@/types/homepage';

export interface FeaturedPropertiesEditorProps {
  initialData?: FeaturedPropertiesSection;
  onSave: (data: Partial<FeaturedPropertiesSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function FeaturedPropertiesEditor({ initialData, onSave, onDirtyChange }: FeaturedPropertiesEditorProps) {
  const defaultData: FeaturedPropertiesSection = {
    title: 'Featured Properties',
    displayMode: 'LATEST',
    maxProperties: 3,
    manualSelection: [],
  };

  const [data, setData] = useState<FeaturedPropertiesSection>(initialData || defaultData);
  const [prevInitialData, setPrevInitialData] = useState<FeaturedPropertiesSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<FeaturedPropertiesSection>) => {
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
      setSuccess('Featured Properties section saved successfully');
      setIsDirty(false);
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
          title="Featured Properties Settings"
          isDirty={isDirty}
          isSaving={saving}
          updatedAt={data.updatedAt}
          onSave={handleSave}
          error={error}
          success={success}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            required 
            value={data.title} 
            onChange={e => handleChange({ title: e.target.value })} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.subtitle || ''} 
            onChange={e => handleChange({ subtitle: e.target.value })} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.description || ''} 
            onChange={e => handleChange({ description: e.target.value })} 
            rows={3} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
              value={data.ctaLabel || ''} 
              onChange={e => handleChange({ ctaLabel: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
              value={data.ctaLink || ''} 
              onChange={e => handleChange({ ctaLink: e.target.value })} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Mode</label>
            <select 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white" 
              value={data.displayMode} 
              onChange={e => handleChange({ displayMode: e.target.value as FeaturedPropertiesMode })}
            >
              <option value="LATEST">Automatic (Latest)</option>
              <option value="FEATURED">Automatic (Featured flag)</option>
              <option value="MANUAL">Manual Selection</option>
              <option value="COLLECTION" disabled>Collection (Coming Soon)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Properties to Display</label>
            <input 
              type="number"
              min="1"
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
              value={data.maxProperties || 3} 
              onChange={e => handleChange({ maxProperties: Number(e.target.value) })} 
            />
          </div>
        </div>

        {data.displayMode === 'MANUAL' && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Manual Property Selection</h4>
            <p className="text-sm text-gray-500">Property search and drag-and-drop ordering will be fully implemented here. (Architecture prepared)</p>
            {/* The full manual search component would go here */}
          </div>
        )}
      </div>

      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Read-only Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-gray-50 p-8 text-center text-gray-500">
          <p className="font-serif text-2xl text-gray-900 mb-2">{data.title}</p>
          <p className="mb-6">{data.subtitle || data.description}</p>
          <div className="grid grid-cols-3 gap-4 opacity-50 grayscale">
            {[...Array(data.maxProperties || 3)].slice(0, 3).map((_, i) => (
              <div key={i} className="bg-gray-200 aspect-[4/3] rounded-sm"></div>
            ))}
          </div>
          {data.ctaLabel && (
            <button className="mt-8 px-6 py-2 border border-gray-900 text-gray-900 rounded-sm">
              {data.ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
