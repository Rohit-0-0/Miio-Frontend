'use client';
import React, { useEffect, useState } from 'react';
import { MultiImageUploader } from '@/components/media/MultiImageUploader';
import { HeroPreview } from '@/components/admin/home/HeroPreview';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { HeroSection } from '@/types/homepage';

export interface HeroEditorProps {
  initialData: HeroSection;
  onSave: (data: Partial<HeroSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

export function HeroEditor({ initialData, onSave, onDirtyChange }: HeroEditorProps) {
  const [hero, setHero] = useState<HeroSection>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<HeroSection | undefined>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [isDirty, setIsDirty] = useState(false);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    if (initialData) {
      setHero(initialData);
      setIsDirty(false);
    }
  }

  useEffect(() => {
    if (initialData) {
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const handleChange = (updates: Partial<HeroSection>) => {
    setHero(prev => ({ ...prev, ...updates }));
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
      const dataToSave = { ...hero };
      await onSave(dataToSave);
      setSuccess('Hero section saved successfully');
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
      {/* Form */}
      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
        
        <SectionEditorHeader
          title="Hero Settings"
          isDirty={isDirty}
          isSaving={saving}
          updatedAt={hero.updatedAt}
          onSave={handleSave}
          error={error}
          success={success}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow / Tagline</label>
          <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.eyebrow ?? ''} onChange={e => handleChange({ eyebrow: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" required value={hero.title} onChange={e => handleChange({ title: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" required value={hero.subtitle} onChange={e => handleChange({ subtitle: e.target.value })} rows={3} />
        </div>

        <div>
          <MultiImageUploader
            values={hero.images || []}
            onChange={imgs => handleChange({ images: imgs })}
            label="Hero Carousel Images"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
          <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.backgroundAlt ?? ''} onChange={e => handleChange({ backgroundAlt: e.target.value })} />
        </div>

        {/* Primary CTA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Label</label>
            <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" required value={hero.primaryCta.label} onChange={e => handleChange({ primaryCta: { ...hero.primaryCta, label: e.target.value } })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Link</label>
            <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" required value={hero.primaryCta.href} onChange={e => handleChange({ primaryCta: { ...hero.primaryCta, href: e.target.value } })} />
          </div>
        </div>

        {/* Secondary CTA (optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Label</label>
            <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.secondaryCta?.label ?? ''} onChange={e => handleChange({ secondaryCta: { ...(hero.secondaryCta ?? { href: '' }), label: e.target.value } })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Link</label>
            <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.secondaryCta?.href ?? ''} onChange={e => handleChange({ secondaryCta: { ...(hero.secondaryCta ?? { label: '' }), href: e.target.value } })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity (0‑1)</label>
            <input type="number" step="0.1" min="0" max="1" className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.overlayOpacity ?? ''} onChange={e => handleChange({ overlayOpacity: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
            <select className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white" value={hero.textAlignment ?? ''} onChange={e => handleChange({ textAlignment: e.target.value as HeroSection['textAlignment'] })}>
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Height (e.g. 80vh)</label>
            <input className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" value={hero.heroHeight ?? ''} onChange={e => handleChange({ heroHeight: e.target.value })} />
          </div>
          <div className="pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" checked={hero.showScrollIndicator ?? false} onChange={e => handleChange({ showScrollIndicator: e.target.checked })} />
              <span className="text-sm font-medium text-gray-700">Show Scroll Indicator</span>
            </label>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm">
          <HeroPreview hero={hero} />
        </div>
      </div>
    </div>
  );
}
