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
    
    if (submissionData.hero?.backgroundImage?.assetId && !submissionData.hero.backgroundImage.alt) {
      submissionData.hero.backgroundImage.alt = submissionData.hero.title;
    }
    
    if (submissionData.story?.image?.assetId && !submissionData.story.image.alt) {
      submissionData.story.image.alt = submissionData.story.title;
    }
    
    onSave(submissionData);
  };

  const handleHeroChange = (field: keyof AboutData['hero'], value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleHeroCtaChange = (field: keyof AboutData['hero']['cta'], value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, cta: { ...prev.hero.cta, [field]: value } }
    }));
  };

  const handleHeroImageChange = (image: ImageAsset | null) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, backgroundImage: image || { assetId: '', alt: '' } }
    }));
  };

  const handleStoryChange = (field: keyof AboutData['story'], value: string) => {
    setFormData(prev => ({
      ...prev,
      story: { ...prev.story, [field]: value }
    }));
  };

  const handleStoryImageChange = (image: ImageAsset | null) => {
    setFormData(prev => ({
      ...prev,
      story: { ...prev.story, image: image || { assetId: '', alt: '' } }
    }));
  };

  const handleMissionChange = (field: keyof AboutData['mission'], value: string) => {
    setFormData(prev => ({
      ...prev,
      mission: { ...prev.mission, [field]: value }
    }));
  };

  const handleVisionChange = (field: keyof AboutData['vision'], value: string) => {
    setFormData(prev => ({
      ...prev,
      vision: { ...prev.vision, [field]: value }
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

  const emptyValue = { title: '', description: '', icon: '' };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.hero?.title || ''} onChange={e => handleHeroChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea required value={formData.hero?.subtitle || ''} onChange={e => handleHeroChange('subtitle', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={2} />
          </div>
          <div className="md:col-span-2">
            <ImageUploader 
              label="Background Image"
              value={formData.hero?.backgroundImage?.assetId ? formData.hero.backgroundImage as ImageAsset : null}
              onChange={(img) => handleHeroImageChange(img)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Label</label>
            <input value={formData.hero?.cta?.label || ''} onChange={e => handleHeroCtaChange('label', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTA Href</label>
            <input value={formData.hero?.cta?.href || ''} onChange={e => handleHeroCtaChange('href', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Story Section</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.story?.title || ''} onChange={e => handleStoryChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <RichTextEditor 
              value={formData.story?.content || ''} 
              onChange={val => handleStoryChange('content', val)} 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <ImageUploader 
                label="Story Image"
                value={formData.story?.image?.assetId ? formData.story.image as ImageAsset : null}
                onChange={(img) => handleStoryImageChange(img)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Mission & Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Mission</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input required value={formData.mission?.title || ''} onChange={e => handleMissionChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required value={formData.mission?.description || ''} onChange={e => handleMissionChange('description', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={4} />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Vision</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input required value={formData.vision?.title || ''} onChange={e => handleVisionChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required value={formData.vision?.description || ''} onChange={e => handleVisionChange('description', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={4} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Values</h3>
        <ArrayFieldEditor
          label="Company Values"
          initialItems={formData.values || []}
          emptyItem={emptyValue}
          onChange={(items) => setFormData(prev => ({ ...prev, values: items }))}
          renderItem={(item, index, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required value={item.title} onChange={e => updateItem({ ...item, title: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required value={item.description} onChange={e => updateItem({ ...item, description: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={2} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Icon (optional)</label>
                <input value={item.icon || ''} onChange={e => updateItem({ ...item, icon: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
              </div>
            </div>
          )}
        />
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
