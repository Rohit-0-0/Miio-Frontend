'use client';

import React, { useState } from 'react';

interface ArrayFieldEditorProps<T> {
  label: string;
  initialItems: T[];
  emptyItem: T;
  renderItem: (item: T, index: number, updateItem: (updated: T) => void) => React.ReactNode;
  onChange: (items: T[]) => void;
}

export function ArrayFieldEditor<T>({ label, initialItems, emptyItem, renderItem, onChange }: ArrayFieldEditorProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems || []);

  const handleUpdate = (index: number, updated: T) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
    onChange(newItems);
  };

  const handleAdd = () => {
    const newItems = [...items, emptyItem];
    setItems(newItems);
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs font-medium text-white bg-gray-900 px-3 py-1 rounded-sm hover:bg-gray-800 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 border border-dashed border-gray-300 rounded-sm text-center">
          No items added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="relative p-4 border border-gray-200 rounded-sm bg-gray-50">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors text-xl font-bold p-1 leading-none"
                aria-label="Remove item"
              >
                &times;
              </button>
              <div className="pr-6">
                {renderItem(item, index, (updated) => handleUpdate(index, updated))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
