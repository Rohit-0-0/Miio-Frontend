'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SingletonEditorProps<T> {
  title: string;
  fetchData: () => Promise<T>;
  updateData: (data: T) => Promise<T>;
  children: (data: T, isSaving: boolean, onSave: (data: T) => Promise<void>) => React.ReactNode;
}

export function SingletonEditor<T>({ title, fetchData, updateData, children }: SingletonEditorProps<T>) {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load content');
        } else {
          setError('Failed to load content');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (updatedData: T) => {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateData(updatedData);
      setData(result);
      setSuccess('Successfully saved!');
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save content');
      } else {
        setError('Failed to save content');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-gray-900">{title}</h1>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-50 rounded-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-green-800 bg-green-50 rounded-sm">
          {success}
        </div>
      )}

      {data && children(data, isSaving, handleSave)}
    </div>
  );
}
