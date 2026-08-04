import React from 'react';

export function PriceSummary() {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <span className="text-2xl font-serif font-bold text-gray-900">POA</span>
        <span className="text-sm text-gray-500 ml-1">/ night</span>
      </div>
      <div className="text-sm text-gray-500 underline cursor-pointer">
        Price details
      </div>
    </div>
  );
}
