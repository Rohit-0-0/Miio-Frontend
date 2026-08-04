import React, { useState, useEffect } from 'react';
import { FilterConfiguration } from '@/types/stays-page';
import { SectionEditorHeader } from '../home/SectionEditorHeader';

interface StaysFilterEditorProps {
  initialData: FilterConfiguration;
  onSave: (data: FilterConfiguration) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function StaysFilterEditor({ initialData, onSave, onDirtyChange }: StaysFilterEditorProps) {
  const [data, setData] = useState<FilterConfiguration>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleToggle = (field: keyof Pick<FilterConfiguration, 'showLocationFilter' | 'showGuestsFilter' | 'showPriceFilter' | 'enableMapButton'>) => {
    setData((prev) => ({ ...prev, [field]: !prev[field] }));
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
        title="Filter Configuration"
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
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.showLocationFilter} 
              onChange={() => handleToggle('showLocationFilter')}
              className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900" 
            />
            <span className="text-sm font-medium text-gray-700">Show Location Filter</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.showGuestsFilter} 
              onChange={() => handleToggle('showGuestsFilter')}
              className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900" 
            />
            <span className="text-sm font-medium text-gray-700">Show Guests Filter</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.showPriceFilter} 
              onChange={() => handleToggle('showPriceFilter')}
              className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900" 
            />
            <span className="text-sm font-medium text-gray-700">Show Price Filter</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.enableMapButton} 
              onChange={() => handleToggle('enableMapButton')}
              className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-900" 
            />
            <span className="text-sm font-medium text-gray-700">Show Map Toggle (Currently Disabled visually)</span>
          </label>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Sort
            </label>
            <select
              value={data.defaultSort}
              onChange={(e) => setData(prev => ({ ...prev, defaultSort: e.target.value as any }))}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
