'use client';

import React, { useState } from 'react';
import { PartnerDocument } from '@/types/partner';
import { ArrayFieldEditor } from '../singleton/ArrayFieldEditor';
import Link from 'next/link';
import { ImageUploader } from '@/components/media/ImageUploader';
import { ImageAsset } from '@/lib/media/imageTypes';

interface PartnerFormProps {
  initialData: PartnerDocument;
  isSaving: boolean;
  onSave: (data: PartnerDocument) => Promise<void>;
}

export function PartnerForm({ initialData, isSaving, onSave }: PartnerFormProps) {
  const [formData, setFormData] = useState<PartnerDocument>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const emptyPartner = { name: '', logo: { assetId: '', alt: '' }, url: '' };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-8">
      
      {/* Hero Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.title || ''} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea required value={formData.subtitle || ''} onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" rows={2} />
          </div>
        </div>
      </section>

      {/* Partners Array */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Partners</h3>
        <ArrayFieldEditor
          label="Partner Logos"
          initialItems={formData.partners || []}
          emptyItem={emptyPartner}
          onChange={(items) => setFormData(prev => ({ ...prev, partners: items }))}
          renderItem={(item, index, updateItem) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input required value={item.name} onChange={e => updateItem({ ...item, name: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL (optional)</label>
                <input value={item.url || ''} onChange={e => updateItem({ ...item, url: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
              </div>
              <div className="md:col-span-2">
                <ImageUploader 
                  label="Logo"
                  value={item.logo?.assetId ? item.logo as ImageAsset : null}
                  onChange={(img) => updateItem({ ...item, logo: img || { assetId: '', alt: '' } })}
                />
              </div>
            </div>
          )}
        />
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
