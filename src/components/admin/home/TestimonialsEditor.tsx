'use client';
import React, { useEffect, useState, useRef } from 'react';
import { SectionEditorHeader } from '@/components/admin/home/SectionEditorHeader';
import { TestimonialsSection, TestimonialItem } from '@/types/homepage';
import { ImageUploader } from '@/components/media/ImageUploader';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateId } from '@/lib/utils';

export interface TestimonialsEditorProps {
  initialData?: TestimonialsSection;
  onSave: (data: Partial<TestimonialsSection>) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

function SortableTestimonialItem({
  item,
  onChange,
  onRemove,
}: {
  item: TestimonialItem;
  onChange: (id: string, updates: Partial<TestimonialItem>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 p-4 rounded-sm flex items-start gap-4 group">
      <div 
        ref={setActivatorNodeRef}
        {...attributes} 
        {...listeners} 
        className="mt-2 cursor-grab text-gray-400 hover:text-gray-600"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm" 
              value={item.customerName} 
              onChange={e => onChange(item.id, { customerName: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm" 
              value={item.location || ''} 
              onChange={e => onChange(item.id, { location: e.target.value })} 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Testimonial</label>
          <textarea 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm" 
            value={item.testimonial} 
            onChange={e => onChange(item.id, { testimonial: e.target.value })} 
            rows={3} 
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
          <select 
            className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 bg-white text-sm" 
            value={item.rating} 
            onChange={e => onChange(item.id, { rating: Number(e.target.value) as 1|2|3|4|5 })}
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
        </div>
      </div>
      
      <div className="w-32 flex flex-col gap-2">
        <label className="block text-xs font-medium text-gray-700">Avatar</label>
        <ImageUploader
          value={item.avatar ?? null}
          onChange={img => onChange(item.id, { avatar: img || undefined })}
          label="Upload"
        />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-xs text-red-600 hover:text-red-800 self-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function TestimonialsEditor({ initialData, onSave, onDirtyChange }: TestimonialsEditorProps) {
  const defaultData: TestimonialsSection = {
    title: 'Testimonials',
    items: [],
  };

  const [data, setData] = useState<TestimonialsSection>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isDirty = useRef(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      isDirty.current = false;
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const handleChange = (updates: Partial<TestimonialsSection>) => {
    setData(prev => ({ ...prev, ...updates }));
    isDirty.current = true;
    onDirtyChange(true);
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(data);
      setSuccess('Testimonials section saved successfully');
      isDirty.current = false;
      onDirtyChange(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    const newItem: TestimonialItem = {
      id: generateId(),
      customerName: 'New Customer',
      testimonial: '',
      rating: 5,
    };
    handleChange({ items: [...data.items, newItem] });
  };

  const handleItemChange = (id: string, updates: Partial<TestimonialItem>) => {
    const newItems = data.items.map(item => item.id === id ? { ...item, ...updates } : item);
    handleChange({ items: newItems });
  };

  const handleRemoveItem = (id: string) => {
    handleChange({ items: data.items.filter(item => item.id !== id) });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.items.findIndex(item => item.id === active.id);
      const newIndex = data.items.findIndex(item => item.id === over.id);
      handleChange({ items: arrayMove(data.items, oldIndex, newIndex) });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-sm">
        <SectionEditorHeader
          title="Testimonials Settings"
          isDirty={isDirty.current}
          isSaving={saving}
          updatedAt={data.updatedAt}
          onSave={handleSave}
          error={error}
          success={success}
        />

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
              required 
              value={data.title} 
              onChange={e => handleChange({ title: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input 
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900" 
              value={data.subtitle || ''} 
              onChange={e => handleChange({ subtitle: e.target.value })} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-900">Testimonial Items</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm text-gray-900 border border-gray-900 px-3 py-1 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Add Testimonial
            </button>
          </div>
          
          {data.items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-sm">
              No testimonials added yet.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={data.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {data.items.map(item => (
                    <SortableTestimonialItem
                      key={item.id}
                      item={item}
                      onChange={handleItemChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <div className="xl:sticky xl:top-6 self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Read-only Preview</h3>
        <div className="border border-gray-200 rounded-sm bg-gray-50 p-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-gray-900 mb-2">{data.title}</h2>
            {data.subtitle && <p className="text-gray-500">{data.subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data.items.slice(0, 2).map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-sm shadow-sm opacity-70 grayscale">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.customerName}</h4>
                    {item.location && <p className="text-xs text-gray-500">{item.location}</p>}
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(item.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">"{item.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
