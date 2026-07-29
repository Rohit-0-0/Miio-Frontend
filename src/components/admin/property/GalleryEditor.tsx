'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageAsset } from '@/types/common';
import { ImageUploader } from '@/components/media/ImageUploader';

interface GalleryEditorProps {
  images: ImageAsset[];
  coverImageId?: string;
  onChange: (images: ImageAsset[], coverImageId?: string) => void;
}

function SortableImage({
  image,
  isCover,
  onRemove,
  onSetCover,
}: {
  image: ImageAsset;
  isCover: boolean;
  onRemove: () => void;
  onSetCover: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.assetId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-48 h-48 group rounded-sm overflow-hidden border-2 ${
        isCover ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="w-full h-full bg-cover bg-center cursor-grab active:cursor-grabbing"
        style={{ backgroundImage: `url(${image.assetId})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex flex-col justify-between p-2 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          {isCover ? (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Cover</span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetCover();
              }}
              className="bg-white/90 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              Set Cover
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="bg-red-500/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export function GalleryEditor({ images, coverImageId, onChange }: GalleryEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.assetId === active.id);
      const newIndex = images.findIndex((img) => img.assetId === over.id);
      const newImages = arrayMove(images, oldIndex, newIndex);
      onChange(newImages, coverImageId);
    }
  };

  const handleUpload = (image: ImageAsset | null) => {
    if (image && !images.find((i) => i.assetId === image.assetId)) {
      const newImages = [...images, image];
      // Automatically set as cover if it's the first image
      const newCoverId = !coverImageId && newImages.length === 1 ? image.assetId : coverImageId;
      onChange(newImages, newCoverId);
    }
  };

  const handleRemove = (assetId: string) => {
    const newImages = images.filter((img) => img.assetId !== assetId);
    // If we removed the cover, set a new cover or clear it
    let newCoverId = coverImageId;
    if (coverImageId === assetId) {
      newCoverId = newImages.length > 0 ? newImages[0].assetId : undefined;
    }
    onChange(newImages, newCoverId);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto p-2 min-h-[14rem] border border-dashed border-gray-300 rounded-sm items-center">
        {images.length === 0 ? (
          <p className="text-gray-400 text-sm w-full text-center py-12">No images in gallery. Upload below.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images.map((img) => img.assetId)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-4">
                {images.map((img) => (
                  <SortableImage
                    key={img.assetId}
                    image={img}
                    isCover={img.assetId === coverImageId}
                    onRemove={() => handleRemove(img.assetId)}
                    onSetCover={() => onChange(images, img.assetId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="w-full max-w-sm">
        <ImageUploader label="Add new image" value={null} onChange={handleUpload} />
      </div>
    </div>
  );
}
