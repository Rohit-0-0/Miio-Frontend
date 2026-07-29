'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ImageAsset } from '@/lib/media/imageTypes';
import { MEDIA_CONSTANTS } from '@/lib/media/constants';
import { ImagePreview } from './ImagePreview';
import { UploadProgress } from './UploadProgress';
import { env } from '@/config/env';

interface ImageUploaderProps {
  value?: ImageAsset | null;
  onChange: (image: ImageAsset | null) => void;
  label?: string;
  required?: boolean;
}

export function ImageUploader({ value, onChange, label, required }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    // Frontend validation
    if (!MEDIA_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Please use: ${MEDIA_CONSTANTS.ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      return;
    }

    if (file.size > MEDIA_CONSTANTS.MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds 10MB limit.`);
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Upload failed');
      }

      onChange(data.data as ImageAsset);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
          {error}
        </div>
      )}

      {isUploading ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 aspect-video flex items-center justify-center">
          <UploadProgress message="Uploading image..." />
        </div>
      ) : value?.assetId ? (
        <ImagePreview 
          image={value} 
          onRemove={() => onChange(null)}
          onReplace={triggerSelect}
        />
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerSelect}
          className={`border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            SVG, PNG, JPG or WEBP (max. 10MB)
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept={MEDIA_CONSTANTS.ALLOWED_MIME_TYPES.join(',')}
      />
    </div>
  );
}
