'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from './SectionEditorHeader';
import { TrustSection, TrustItem } from '@/types/homepage';

export interface TrustEditorProps {
  initialData?: TrustSection;
  onSave: (data: Partial<TrustSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const DEFAULT_DATA: TrustSection = {
  heading: 'The Miio Standard',
  rating: '4.9',
  reviewCount: '150+',
  verifiedText: 'Verified Stays',
  items: [],
};

export function TrustEditor({ initialData, onSave, onDirtyChange }: TrustEditorProps) {
  const [data, setData] = useState<TrustSection>(initialData || DEFAULT_DATA);
  const [prevInitialData, setPrevInitialData] = useState<TrustSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<TrustSection>) => {
    setData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    onDirtyChange(true);
    setSuccess(null);
    setError(null);
  };

  const updateItem = (index: number, updates: Partial<TrustItem>) => {
    const newItems = [...(data.items || [])];
    newItems[index] = { ...newItems[index], ...updates };
    handleChange({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = [...(data.items || [])];
    newItems.splice(index, 1);
    handleChange({ items: newItems });
  };

  const addItem = () => {
    const newItems = [...(data.items || [])];
    newItems.push({
      id: Math.random().toString(36).substring(7),
      title: '',
    });
    handleChange({ items: newItems });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(data);
      setSuccess('Trust section saved successfully');
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
        title="Trust / Miio Standard"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.rating} 
            onChange={e => handleChange({ rating: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.reviewCount} 
            onChange={e => handleChange({ reviewCount: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Verified Text</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.verifiedText} 
            onChange={e => handleChange({ verifiedText: e.target.value })} 
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">Standard Items</h3>
          <button 
            type="button" 
            onClick={addItem}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            + Add Item
          </button>
        </div>

        {(data.items || []).map((item, index) => (
          <div key={item.id || index} className="p-4 border border-gray-200 rounded-sm relative">
            <button 
              type="button" 
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
                value={item.title} 
                onChange={e => updateItem(index, { title: e.target.value })} 
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (optional)</label>
              <input 
                className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
                value={item.icon || ''} 
                onChange={e => updateItem(index, { icon: e.target.value })} 
                placeholder="SVG markup or icon name"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
