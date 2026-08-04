'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { staysPageService } from '@/services/stays-page.service';
import { StaysPageData } from '@/types/stays-page';
import { StaysGeneralEditor } from '@/components/admin/stays/StaysGeneralEditor';
import { StaysFilterEditor } from '@/components/admin/stays/StaysFilterEditor';
import { StaysEmptyStateEditor } from '@/components/admin/stays/StaysEmptyStateEditor';
import { StaysSeoEditor } from '@/components/admin/stays/StaysSeoEditor';
import { PageHeader } from '@/components/admin/PageHeader';

export default function StaysAdminPage() {
  const [data, setData] = useState<StaysPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dirtyStates, setDirtyStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await staysPageService.get();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load Stays Page settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDirtyChange = useCallback((section: string, isDirty: boolean) => {
    setDirtyStates((prev) => {
      if (prev[section] === isDirty) return prev;
      return { ...prev, [section]: isDirty };
    });
  }, []);

  const handleGeneralDirty = useCallback((dirty: boolean) => handleDirtyChange('general', dirty), [handleDirtyChange]);
  const handleFiltersDirty = useCallback((dirty: boolean) => handleDirtyChange('filters', dirty), [handleDirtyChange]);
  const handleEmptyStateDirty = useCallback((dirty: boolean) => handleDirtyChange('emptyState', dirty), [handleDirtyChange]);
  const handleSeoDirty = useCallback((dirty: boolean) => handleDirtyChange('seo', dirty), [handleDirtyChange]);

  const hasUnsavedChanges = Object.values(dirtyStates).some(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const initialGeneral = data.general || { heading: '', introText: '' };
  const initialFilters = data.filters || {
    showLocationFilter: true,
    showGuestsFilter: true,
    showPriceFilter: true,
    enableMapButton: true,
    defaultSort: 'recommended',
  };
  const initialEmptyState = data.emptyState || {
    heading: '',
    description: '',
    ctaText: '',
    ctaLink: '',
  };
  const initialSeo = data.seo || {};

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <PageHeader 
        title="Stays Page Settings" 
        description="Manage the configuration, copy, and layout of the public all properties page."
      />
      
      {hasUnsavedChanges && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md flex items-center justify-between">
          <p className="text-sm font-medium">You have unsaved changes. Please save or cancel before leaving.</p>
        </div>
      )}

      <div className="space-y-8">
        <StaysGeneralEditor 
          initialData={initialGeneral}
          onSave={async (updates) => {
            const result = await staysPageService.updateGeneral(updates);
            setData((prev) => prev ? { ...prev, general: result } : null);
          }}
          onDirtyChange={handleGeneralDirty}
        />
        
        <StaysFilterEditor 
          initialData={initialFilters}
          onSave={async (updates) => {
            const result = await staysPageService.updateFilters(updates);
            setData((prev) => prev ? { ...prev, filters: result } : null);
          }}
          onDirtyChange={handleFiltersDirty}
        />
        
        <StaysEmptyStateEditor 
          initialData={initialEmptyState}
          onSave={async (updates) => {
            const result = await staysPageService.updateEmptyState(updates);
            setData((prev) => prev ? { ...prev, emptyState: result } : null);
          }}
          onDirtyChange={handleEmptyStateDirty}
        />

        <StaysSeoEditor 
          initialData={initialSeo}
          onSave={async (updates) => {
            const result = await staysPageService.updateSeo(updates);
            setData((prev) => prev ? { ...prev, seo: result } : null);
          }}
          onDirtyChange={handleSeoDirty}
        />
      </div>
    </div>
  );
}
