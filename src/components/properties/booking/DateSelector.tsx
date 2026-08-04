import React from 'react';

export function DateSelector() {
  return (
    <div className="flex border border-gray-300 rounded-t-md overflow-hidden divide-x divide-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex-1 p-3">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-in</div>
        <div className="text-sm text-gray-500 mt-0.5">Add date</div>
      </div>
      <div className="flex-1 p-3">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-out</div>
        <div className="text-sm text-gray-500 mt-0.5">Add date</div>
      </div>
    </div>
  );
}
