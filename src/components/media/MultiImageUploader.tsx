'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ImageAsset } from '@/lib/media/imageTypes';
import { MEDIA_CONSTANTS } from '@/lib/media/constants';
import { ImagePreview } from './ImagePreview';
import { UploadProgress } from './UploadProgress';
import { env } from '@/config/env';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  image: ImageAsset;
  onRemove: () => void;
}

function SortableItem({ id, image, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-white border border-gray-200 rounded-sm mb-2">
      <div className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-900" {...attributes} {...listeners}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="8" y1="18" x2="16" y2="18"></line>
        </svg>
      </div>
      <div className="pl-10">
        <ImagePreview image={image} onRemove={onRemove} onReplace={() => {}} />
      </div>
    </div>
  );
}

interface MultiImageUploaderProps {
  values: ImageAsset[];
  onChange: (images: ImageAsset[]) => void;
  label?: string;
  required?: boolean;
}

export function MultiImageUploader({ values = [], onChange, label, required }: MultiImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uiIds = useRef(new WeakMap<ImageAsset, string>());

  const getUid = useCallback((v: ImageAsset) => {
    if (!uiIds.current.has(v)) {
      uiIds.current.set(v, Math.random().toString(36).substring(2, 15));
    }
    return uiIds.current.get(v)!;
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = values.findIndex(v => getUid(v) === active.id);
      const newIndex = values.findIndex(v => getUid(v) === over.id);
      onChange(arrayMove(values, oldIndex, newIndex));
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!MEDIA_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > MEDIA_CONSTANTS.MAX_FILE_SIZE_BYTES) {
        setError(`File size exceeds 10MB limit: ${file.name}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadingFiles(validFiles.length);
    const uploadedImages: ImageAsset[] = [];
    
    for (const file of validFiles) {
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
        uploadedImages.push(data.data as ImageAsset);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to upload one or more images');
      }
    }

    if (uploadedImages.length > 0) {
      onChange([...values, ...uploadedImages]);
    }
    setUploadingFiles(0);
  }, [onChange, values]);

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
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (uid: string) => {
    onChange(values.filter(v => getUid(v) !== uid));
  };

  return (
    <div className="space-y-4">
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={values.map(v => getUid(v))} strategy={verticalListSortingStrategy}>
          {values.map((img) => {
            const uid = getUid(img);
            return (
              <SortableItem 
                key={uid} 
                id={uid} 
                image={img} 
                onRemove={() => handleRemove(uid)} 
              />
            );
          })}
        </SortableContext>
      </DndContext>

      {uploadingFiles > 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 aspect-video flex items-center justify-center h-32">
          <UploadProgress message={`Uploading ${uploadingFiles} images...`} />
        </div>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerSelect}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-sm font-medium text-gray-700">
          Click to upload multiple images or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1 text-center">
          SVG, PNG, JPG or WEBP (max. 5MB)
          <br />
          Recommended: 1920 × 1080 | Minimum: 1600 × 900
        </p>
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept={MEDIA_CONSTANTS.ALLOWED_MIME_TYPES.join(',')}
      />
    </div>
  );
}
