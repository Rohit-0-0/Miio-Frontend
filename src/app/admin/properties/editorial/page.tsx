'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { PropertyEditorialData, DEFAULT_PROPERTY_EDITORIAL } from '@/types/property';

export default function AdminPropertyEditorialPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [editorialData, setEditorialData] = useState<PropertyEditorialData>(DEFAULT_PROPERTY_EDITORIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch properties for selector
  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await apiClient.get<{ data: any[] }>('/properties?limit=100');
        setProperties(res.data || []);
      } catch (err) {
        console.error('Failed to load properties', err);
      }
    }
    loadProperties();
  }, []);

  // Fetch editorial data when a property is selected
  useEffect(() => {
    if (!selectedPropertyId) return;

    async function loadEditorial() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<{ data: PropertyEditorialData }>(`/properties/editorial/${selectedPropertyId}`);
        setEditorialData(res.data || {
          ...DEFAULT_PROPERTY_EDITORIAL,
          guestyListingId: selectedPropertyId
        });
      } catch (err) {
        setError('Failed to load editorial content');
      } finally {
        setIsLoading(false);
      }
    }
    loadEditorial();
  }, [selectedPropertyId]);

  const handleSave = async () => {
    if (!selectedPropertyId) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.patch(`/properties/editorial/${selectedPropertyId}`, editorialData);
      alert('Saved successfully!');
    } catch (err) {
      setError('Failed to save editorial content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof PropertyEditorialData, value: any) => {
    setEditorialData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Property Editorial</h1>
        <button 
          onClick={handleSave} 
          disabled={!selectedPropertyId || isSaving}
          className="bg-black text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      {/* Property Selector */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Select Property</h2>
        <select 
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-black outline-none"
        >
          <option value="">-- Choose a Property --</option>
          {properties.map(p => (
            <option key={p.id} value={p.guestyId || p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Select a property to edit its editorial content. The content maps securely to the underlying operational ID.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : selectedPropertyId ? (
        <div className="space-y-8">
          {/* General Description */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <textarea 
              value={editorialData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-md p-2"
              placeholder="HTML or Rich Text for the main property description..."
            />
          </div>

          {/* Experience */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">The Experience</h2>
            <textarea 
              value={editorialData.experience || ''}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-md p-2"
              placeholder="HTML or Rich Text for the experience section..."
            />
          </div>

          {/* Related Properties */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Related Properties Mode</h2>
            <select
              value={editorialData.relatedProperties?.displayMode || 'OFF'}
              onChange={(e) => handleChange('relatedProperties', { ...editorialData.relatedProperties, displayMode: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="AUTO">AUTO (Recommendations)</option>
              <option value="MANUAL">MANUAL (Admin Selected)</option>
              <option value="OFF">OFF (Hidden)</option>
            </select>
          </div>
          
          {/* Further editors for FAQ, Amenities, SEO... would go here */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-500 text-sm">
            (Further editor panels for FAQ, Miio Standard, Amenities, and SEO to be implemented according to schema...)
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          Select a property above to begin editing.
        </div>
      )}
    </div>
  );
}
