'use client';
import React, { useEffect, useState } from 'react';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { WhyMiioSection } from '@/types/homepage';
import { ImageUploader } from '@/components/media/ImageUploader';
import { AppImage } from '@/components/media/AppImage';

export interface WhyMiioEditorProps {
  initialData?: WhyMiioSection;
  onSave: (data: Partial<WhyMiioSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function WhyMiioEditor({ initialData, onSave, onDirtyChange }: WhyMiioEditorProps) {
  const defaultData: WhyMiioSection = {
    title: 'Why Miio',
    content: '',
  };

  const [data, setData] = useState<WhyMiioSection>(initialData || defaultData);
  const [prevInitialData, setPrevInitialData] = useState<WhyMiioSection | undefined>(initialData);
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

  const handleChange = (updates: Partial<WhyMiioSection>) => {
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
      await onSave({
        ...data,
        image: data.image || undefined
      });
      setSuccess('Why Miio section saved successfully');
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
          title="Why Miio Settings"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Rich Text Content</label>
          <p className="text-xs text-gray-500 mb-2">Use line breaks to separate paragraphs. Rich text capabilities will be added here in the future.</p>
          <textarea 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            required
            value={data.content || ''} 
            onChange={e => handleChange({ content: e.target.value })} 
            rows={8} 
          />
        </div>

        <div>
          <ImageUploader
            value={data.image ?? null}
            onChange={img => handleChange({ image: img || undefined })}
            label="Section Image"
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
      </div>

      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Read-only Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-gray-50 p-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-serif text-2xl text-gray-900 mb-2">{data.title}</p>
            {data.subtitle && <p className="text-gray-500 mb-4 text-sm">{data.subtitle}</p>}
            <div className="text-sm text-gray-600 space-y-2">
              {data.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {data.ctaLabel && (
              <button className="mt-8 px-6 py-2 border border-gray-900 text-gray-900 rounded-sm text-sm">
                {data.ctaLabel}
              </button>
            )}
          </div>
          <div className="bg-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
            {data.image ? (
              <div className="relative w-full h-full">
                <AppImage 
                  image={data.image}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="text-gray-400">Image</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
