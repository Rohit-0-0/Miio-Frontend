'use client';

import React, { useState } from 'react';
import { AboutDocument, AboutData } from '@/types/about';
import { ArrayFieldEditor } from '../singleton/ArrayFieldEditor';
import Link from 'next/link';
import { ImageUploader } from '@/components/media/ImageUploader';
import { ImageAsset } from '@/lib/media/imageTypes';
import { RichTextEditor } from '@/components/ui/editor';

interface AboutFormProps {
  initialData: AboutDocument;
  isSaving: boolean;
  onSave: (data: AboutDocument) => Promise<void>;
}

export function AboutForm({ initialData, isSaving, onSave }: AboutFormProps) {
  const [formData, setFormData] = useState<AboutDocument>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-populate alt tags from corresponding titles if missing
    const submissionData = { ...formData };
    
    if (submissionData.story?.founderImage?.assetId && !submissionData.story.founderImage.alt) {
      submissionData.story.founderImage.alt = submissionData.story.heading;
    }
    
    onSave(submissionData);
  };

  const handleHeroChange = (field: keyof AboutData['hero'], value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleIntroChange = (field: keyof AboutData['intro'], value: string) => {
    setFormData(prev => ({
      ...prev,
      intro: { ...prev.intro, [field]: value }
    }));
  };

  const handleStoryChange = (field: keyof AboutData['story'], value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      story: { ...prev.story, [field]: value }
    }));
  };

  const handleStoryImageChange = (image: ImageAsset | null) => {
    setFormData(prev => ({
      ...prev,
      story: { ...prev.story, founderImage: image || { assetId: '', alt: '' } }
    }));
  };

  const handlePullQuoteChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      pullQuote: { ...prev.pullQuote, text: value }
    }));
  };

  const handlePhilosophyChange = (field: keyof AboutData['philosophy'], value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      philosophy: { ...prev.philosophy, [field]: value }
    }));
  };

  const handleClosingChange = (field: 'body', value: string) => {
    setFormData(prev => ({
      ...prev,
      closing: { ...prev.closing, [field]: value }
    }));
  };

  const handleClosingCtaChange = (field: keyof AboutData['closing']['cta'], value: string) => {
    setFormData(prev => ({
      ...prev,
      closing: { ...prev.closing, cta: { ...prev.closing?.cta, [field]: value } }
    }));
  };

  const handleSeoChangeStr = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const handleSeoKeywordsChange = (value: string[]) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.hero?.title || ''} onChange={e => handleHeroChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea required value={formData.hero?.subtitle || ''} onChange={e => handleHeroChange('subtitle', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={2} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Intro Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label (uppercase)</label>
            <input value={formData.intro?.label || ''} onChange={e => handleIntroChange('label', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <textarea required value={formData.intro?.body || ''} onChange={e => handleIntroChange('body', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={3} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Story Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input value={formData.story?.label || ''} onChange={e => handleStoryChange('label', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading</label>
            <input required value={formData.story?.heading || ''} onChange={e => handleStoryChange('heading', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paragraphs (one per line)</label>
            <textarea required value={(formData.story?.paragraphs || []).join('\n')} onChange={e => handleStoryChange('paragraphs', e.target.value.split('\n'))} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={5} />
          </div>
          <div className="mt-4">
            <ImageUploader 
              label="Founder Image"
              value={formData.story?.founderImage?.assetId ? formData.story.founderImage as ImageAsset : null}
              onChange={(img) => handleStoryImageChange(img)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Pull Quote</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quote Text</label>
            <textarea value={formData.pullQuote?.text || ''} onChange={e => handlePullQuoteChange(e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={3} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Philosophy</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input value={formData.philosophy?.label || ''} onChange={e => handlePhilosophyChange('label', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading</label>
            <input value={formData.philosophy?.heading || ''} onChange={e => handlePhilosophyChange('heading', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paragraphs (one per line)</label>
            <textarea required value={(formData.philosophy?.paragraphs || []).join('\n')} onChange={e => handlePhilosophyChange('paragraphs', e.target.value.split('\n'))} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={5} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Closing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Body Text</label>
            <textarea value={formData.closing?.body || ''} onChange={e => handleClosingChange('body', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Text</label>
            <input value={formData.closing?.cta?.text || ''} onChange={e => handleClosingCtaChange('text', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Href</label>
            <input value={formData.closing?.cta?.href || ''} onChange={e => handleClosingCtaChange('href', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">SEO Metadata</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.seo?.title || ''} onChange={e => handleSeoChangeStr('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required value={formData.seo?.description || ''} onChange={e => handleSeoChangeStr('description', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Keywords (comma separated)</label>
            <input required value={formData.seo?.keywords?.join(', ') || ''} onChange={e => handleSeoKeywordsChange(e.target.value.split(',').map((s: string) => s.trim()))} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
      </section>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <Link
          href="/admin"
          className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
