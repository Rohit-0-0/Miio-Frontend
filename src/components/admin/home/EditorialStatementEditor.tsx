'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from './SectionEditorHeader';
import { EditorialStatementSection } from '@/types/homepage';

export interface EditorialStatementEditorProps {
  initialData?: EditorialStatementSection;
  onSave: (data: Partial<EditorialStatementSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const DEFAULT_DATA: EditorialStatementSection = {
  heading: 'Spaces designed for slow mornings and quiet evenings.',
  description: 'Experience the perfect blend of luxury, comfort, and thoughtful design in every property.',
};

export function EditorialStatementEditor({ initialData, onSave, onDirtyChange }: EditorialStatementEditorProps) {
  const [data, setData] = useState<EditorialStatementSection>(initialData || DEFAULT_DATA);
  const [prevInitialData, setPrevInitialData] = useState<EditorialStatementSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<EditorialStatementSection>) => {
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
      setSuccess('Editorial statement saved successfully');
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
        title="Editorial Statement"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
          rows={4}
          value={data.description} 
          onChange={e => handleChange({ description: e.target.value })} 
        />
      </div>
    </div>
  );
}
