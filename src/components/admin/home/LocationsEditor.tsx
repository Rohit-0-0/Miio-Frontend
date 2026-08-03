'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from './SectionEditorHeader';
import { LocationsSection, LocationItem } from '@/types/homepage';
import { ImageUploader } from '@/components/media/ImageUploader';

export interface LocationsEditorProps {
  initialData?: LocationsSection;
  onSave: (data: Partial<LocationsSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const DEFAULT_DATA: LocationsSection = {
  heading: 'Explore our locations',
  items: [
    { id: '1', name: 'Bondi', description: 'Experience the iconic Bondi lifestyle with our premium coastal properties.', displayOrder: 1 },
    { id: '2', name: 'Vaucluse', description: 'Discover exclusive luxury estates in one of Sydney’s most prestigious suburbs.', displayOrder: 2 },
    { id: '3', name: 'Paddington', description: 'Immerse yourself in the charm of Paddington’s historic streets and vibrant culture.', displayOrder: 3 },
  ],
};

export function LocationsEditor({ initialData, onSave, onDirtyChange }: LocationsEditorProps) {
  const [data, setData] = useState<LocationsSection>(initialData || DEFAULT_DATA);
  const [prevInitialData, setPrevInitialData] = useState<LocationsSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<LocationsSection>) => {
    setData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    onDirtyChange(true);
    setSuccess(null);
    setError(null);
  };

  const updateItem = (index: number, updates: Partial<LocationItem>) => {
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
      name: '',
      description: '',
    });
    handleChange({ items: newItems });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(data);
      setSuccess('Locations saved successfully');
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
        title="Locations"
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

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">Location Items</h3>
          <button 
            type="button" 
            onClick={addItem}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            + Add Location
          </button>
        </div>

        {(data.items || []).map((item, index) => (
          <div key={item.id || index} className="p-4 border border-gray-200 rounded-sm space-y-4 relative">
            <button 
              type="button" 
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
                    value={item.name} 
                    onChange={e => updateItem(index, { name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
                    rows={3}
                    value={item.description} 
                    onChange={e => updateItem(index, { description: e.target.value })} 
                  />
                </div>
              </div>
              
              <div>
                <ImageUploader 
                  value={item.image || null}
                  onChange={img => updateItem(index, { image: img || undefined })}
                  label="Location Image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
