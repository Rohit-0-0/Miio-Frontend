'use client';
import React, { useEffect, useState, useRef } from 'react';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { SeoSection } from '@/types/homepage';
import { ImageUploader } from '@/components/media/ImageUploader';

export interface SeoEditorProps {
  initialData?: SeoSection;
  onSave: (data: Partial<SeoSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function SeoEditor({ initialData, onSave, onDirtyChange }: SeoEditorProps) {
  const defaultData: SeoSection = {
    title: 'Miio - Find Your Perfect Stay',
    description: '',
    keywords: [],
  };

  const [data, setData] = useState<SeoSection>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  
  const isDirty = useRef(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      isDirty.current = false;
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const handleChange = (updates: Partial<SeoSection>) => {
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
      await onSave({
        ...data,
        ogImage: data.ogImage || undefined
      });
      setSuccess('SEO settings saved successfully');
      isDirty.current = false;
      onDirtyChange(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !(data.keywords || []).includes(keywordInput.trim())) {
      handleChange({ keywords: [...(data.keywords || []), keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    handleChange({ keywords: (data.keywords || []).filter(k => k !== kw) });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
        <SectionEditorHeader
          title="Homepage SEO Settings"
          isDirty={isDirty.current}
          isSaving={saving}
          updatedAt={data.updatedAt}
          onSave={handleSave}
          error={error}
          success={success}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.title || ''} 
            onChange={e => handleChange({ title: e.target.value })} 
            placeholder="e.g. Miio - Luxury Vacation Rentals"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.description || ''} 
            onChange={e => handleChange({ description: e.target.value })} 
            rows={3} 
          />
          <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <div className="flex gap-2 mb-2">
            <input 
              className="flex-1 rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm" 
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Add a keyword"
            />
            <button 
              type="button" 
              onClick={addKeyword}
              className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-sm text-sm font-medium hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.keywords || []).map((kw, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-sm text-sm border border-gray-200">
                {kw}
                <button 
                  type="button" 
                  onClick={() => removeKeyword(kw)}
                  className="text-gray-500 hover:text-red-600 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL (Optional)</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.canonicalUrl || ''} 
            onChange={e => handleChange({ canonicalUrl: e.target.value })} 
            placeholder="e.g. https://www.miio.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Robots (Optional)</label>
          <input 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
            value={data.metaRobots || ''} 
            onChange={e => handleChange({ metaRobots: e.target.value })} 
            placeholder="e.g. index, follow"
          />
        </div>

        <div>
          <ImageUploader
            value={data.ogImage ?? null}
            onChange={img => handleChange({ ogImage: img || undefined })}
            label="Open Graph Image (Social Share Image)"
          />
        </div>
      </div>

      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search Engine Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-white p-6 shadow-sm">
          <div className="text-[#1a0dab] text-xl font-medium truncate hover:underline cursor-pointer mb-1">
            {data.title || 'Miio - Title'}
          </div>
          <div className="text-[#006621] text-sm mb-1 truncate">
            {data.canonicalUrl || 'https://www.miio.com'}
          </div>
          <div className="text-[#545454] text-sm line-clamp-2">
            {data.description || 'Provide a meta description to see how your site will appear in search results. This text should accurately summarize your homepage.'}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-4 mt-8">Social Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm">
          <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
            {data.ogImage ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${data.ogImage.assetId})` }}
              />
            ) : (
              <span className="text-gray-400">Open Graph Image (1200x630)</span>
            )}
          </div>
          <div className="p-4 bg-gray-50">
            <div className="text-gray-500 text-xs uppercase mb-1">miio.com</div>
            <div className="font-bold text-gray-900 mb-1 truncate">{data.title || 'Miio - Title'}</div>
            <div className="text-sm text-gray-600 line-clamp-1">{data.description || 'Provide a meta description...'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
