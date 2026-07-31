'use client';

import React, { useState } from 'react';
import { PropertyData, PROPERTY_TYPES, LIFECYCLE_STATUS, PropertyType, LifecycleStatus } from '@/types/property';
import { GalleryEditor } from './GalleryEditor';
import { ArrayFieldEditor } from '../singleton/ArrayFieldEditor';
import { RichTextEditor } from '@/components/ui/editor';
import { LocationPicker, LocationData } from '@/components/ui/maps/LocationPicker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { propertyService } from '@/services/property.service';

interface PropertyFormProps {
  initialData?: PropertyData;
}

const emptyProperty: Partial<PropertyData> = {
  title: '',
  slug: '',
  propertyType: PROPERTY_TYPES.APARTMENT,
  lifecycleStatus: LIFECYCLE_STATUS.DRAFT,
  gallery: [],
  amenities: [],
  featured: false,
  active: false,
  visibleOnWebsite: false,
};

export function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<PropertyData>>(initialData || emptyProperty);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (initialData?.id) {
        await propertyService.update(initialData.id, formData);
        setSuccess('Property updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      } else {
        // Need to provide a random ID for new properties if not set by server
        const payload = {
          ...formData,
          id: formData.id || crypto.randomUUID(),
        };
        const response = await propertyService.create(payload);
        const newPropertyId = response.data?.id || payload.id;
        router.push(`/admin/properties/${newPropertyId}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = <K extends keyof PropertyData>(field: K, value: PropertyData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (location: LocationData) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const emptyAmenity = { id: crypto.randomUUID(), label: '', icon: '', category: '' };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-200">
          {success}
        </div>
      )}

      {/* General */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Slug (optional, auto-generated from title)</label>
            <input value={formData.slug || ''} onChange={e => handleChange('slug', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. villa-serena" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea value={formData.shortDescription || ''} onChange={e => handleChange('shortDescription', e.target.value)} rows={2} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
            <RichTextEditor 
              value={formData.longDescription || ''} 
              onChange={val => handleChange('longDescription', val)} 
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Location</h3>
        <LocationPicker
          value={formData.location as LocationData | undefined}
          onChange={handleLocationChange}
        />
        {(!formData.location?.latitude || !formData.location?.longitude) && (
          <p className="text-sm text-amber-600 mt-2">
            Warning: Property has no valid coordinates. Map display may be affected.
          </p>
        )}
      </section>

      {/* Media */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Gallery & Media</h3>
        <GalleryEditor 
          images={formData.gallery || []} 
          coverImageId={formData.coverImageId} 
          onChange={(imgs, coverId) => {
            handleChange('gallery', imgs);
            handleChange('coverImageId', coverId);
          }} 
        />
      </section>

      {/* Details */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Property Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select required value={formData.propertyType} onChange={e => handleChange('propertyType', e.target.value as PropertyType)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white">
              {Object.values(PROPERTY_TYPES).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input type="number" min="0" value={formData.bedrooms ?? ''} onChange={e => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input type="number" min="0" step="0.5" value={formData.bathrooms ?? ''} onChange={e => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Guests</label>
            <input type="number" min="1" value={formData.maxGuests ?? ''} onChange={e => handleChange('maxGuests', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Beds</label>
            <input type="number" min="0" value={formData.beds ?? ''} onChange={e => handleChange('beds', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Amenities</h3>
        <ArrayFieldEditor
          label="Property Amenities"
          initialItems={formData.amenities || []}
          emptyItem={emptyAmenity}
          onChange={(items) => handleChange('amenities', items)}
          renderItem={(item, index, updateItem) => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <input required value={item.label} onChange={e => updateItem({ ...item, label: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. WiFi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input value={item.category || ''} onChange={e => updateItem({ ...item, category: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. Basics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon ID</label>
                <input value={item.icon || ''} onChange={e => updateItem({ ...item, icon: e.target.value })} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. wifi" />
              </div>
            </div>
          )}
        />
      </section>

      {/* Booking Rules */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Availability & Booking Rules</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Stay (nights)</label>
            <input type="number" min="1" value={formData.minimumStay ?? ''} onChange={e => handleChange('minimumStay', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Stay (nights)</label>
            <input type="number" min="1" value={formData.maximumStay ?? ''} onChange={e => handleChange('maximumStay', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.petsAllowed || false} onChange={e => handleChange('petsAllowed', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Pets Allowed</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.smokingAllowed || false} onChange={e => handleChange('smokingAllowed', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Smoking Allowed</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.instantBook || false} onChange={e => handleChange('instantBook', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Instant Book Enabled</span>
          </label>
        </div>
      </section>

      {/* Visibility */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">Publishing & Visibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lifecycle Status</label>
            <select required value={formData.lifecycleStatus} onChange={e => handleChange('lifecycleStatus', e.target.value as LifecycleStatus)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white">
              {Object.values(LIFECYCLE_STATUS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <input type="number" value={formData.sortOrder ?? ''} onChange={e => handleChange('sortOrder', e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.visibleOnWebsite || false} onChange={e => handleChange('visibleOnWebsite', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Visible on Website</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.active || false} onChange={e => handleChange('active', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Active (Accepting Bookings)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={formData.featured || false} onChange={e => handleChange('featured', e.target.checked)} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
            <span className="text-sm font-medium text-gray-700">Featured Property</span>
          </label>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white p-6 rounded-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2 mb-4">SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Title</label>
            <input value={formData.seoTitle || ''} onChange={e => handleChange('seoTitle', e.target.value)} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SEO Description</label>
            <textarea value={formData.seoDescription || ''} onChange={e => handleChange('seoDescription', e.target.value)} rows={2} className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" />
          </div>
        </div>
      </section>

      <div className="flex justify-end space-x-4">
        <Link href="/admin/properties" className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
          {isSaving ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}
