'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ImageUploader } from '@/components/media/ImageUploader';
import { homepageService } from '@/services/homepage.service';
import { HeroPreview } from '@/components/admin/home/HeroPreview';
import { ImageAsset } from '@/types/common';

export interface HeroForm {
  eyebrow?: string;
  title: string;
  subtitle: string;
  backgroundImage: ImageAsset | null;
  backgroundAlt?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlayOpacity?: number;
  textAlignment?: 'left' | 'center' | 'right';
  heroHeight?: string;
  showScrollIndicator?: boolean;
}

export function HeroEditor() {
  const [hero, setHero] = useState<HeroForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isDirty = useRef(false);

  // Load once
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await homepageService.get();
        const doc = res.data;
        if (doc && doc.hero) {
          setHero({
            eyebrow: doc.hero.eyebrow,
            title: doc.hero.title,
            subtitle: doc.hero.subtitle,
            backgroundImage: doc.hero.backgroundImage,
            backgroundAlt: doc.hero.backgroundAlt,
            primaryCta: doc.hero.primaryCta,
            secondaryCta: doc.hero.secondaryCta,
            overlayOpacity: doc.hero.overlayOpacity,
            textAlignment: doc.hero.textAlignment,
            heroHeight: doc.hero.heroHeight,
            showScrollIndicator: doc.hero.showScrollIndicator,
          });
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, []);

  // Detect dirty state
  const handleChange = (updates: Partial<HeroForm>) => {
    setHero(prev => (prev ? { ...prev, ...updates } : prev));
    isDirty.current = true;
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const dataToSave = {
        ...hero,
        backgroundImage: hero.backgroundImage || undefined
      };
      await homepageService.updateHero(dataToSave);
      setSuccess('Hero section saved successfully');
      isDirty.current = false;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Warn on navigation if dirty
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!hero) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm">{error}</div>}
        {success && <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-sm">{success}</div>}

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
          <ImageUploader
            value={hero.backgroundImage ?? null}
            onChange={img => handleChange({ backgroundImage: img })}
            label="Background Image"
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
            <select className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white" value={hero.textAlignment ?? ''} onChange={e => handleChange({ textAlignment: e.target.value as any })}>
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

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="button"
            disabled={saving || !isDirty.current}
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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
