import React from 'react';

export function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 border border-gray-100 rounded-sm">
      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h4 className="text-sm font-medium text-gray-900 mb-1">Coming Soon</h4>
      <p className="text-sm text-gray-500">This section is currently under construction.</p>
    </div>
  );
}
