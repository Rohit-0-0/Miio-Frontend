'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { ImageAsset } from '@/types/common';
import { ImageUploader } from '@/components/media/ImageUploader';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

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

  // Debug transform values
  console.log("Sortable Transform:", image.assetId, transform);

  return (
    <div
      ref={setNodeRef}
      style={{
        // ONLY transition for now
        transition,
      }}
      className={`relative w-48 h-48 group rounded-sm overflow-hidden border-2 ${
        isCover ? "border-blue-500 shadow-md" : "border-gray-200"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <img
          src={buildImageUrl(image.assetId) ?? ""}
          alt={image.alt || ""}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-2 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          {isCover ? (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Cover
            </span>
          ) : (
            <button
              type="button"
              onClick={onSetCover}
              className="bg-white/90 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Set Cover
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export function GalleryEditor({
  images,
  coverImageId,
  onChange,
}: GalleryEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.assetId === active.id);
    const newIndex = images.findIndex((i) => i.assetId === over.id);

    onChange(arrayMove(images, oldIndex, newIndex), coverImageId);
  };

  const handleUpload = (image: ImageAsset | null) => {
    if (!image) return;

    if (images.some((i) => i.assetId === image.assetId)) return;

    const next = [...images, image];

    onChange(
      next,
      coverImageId ?? (next.length === 1 ? image.assetId : undefined)
    );
  };

  const handleRemove = (assetId: string) => {
    const next = images.filter((i) => i.assetId !== assetId);

    let nextCover = coverImageId;

    if (coverImageId === assetId) {
      nextCover = next[0]?.assetId;
    }

    onChange(next, nextCover);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto p-2 min-h-[14rem] border border-dashed border-gray-300 rounded-sm items-center">
        {images.length === 0 ? (
          <p className="text-gray-400 text-sm w-full text-center py-12">
            No images in gallery. Upload below.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.assetId)}
              strategy={horizontalListSortingStrategy}
            >
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
        <ImageUploader
          label="Add new image"
          value={null}
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}