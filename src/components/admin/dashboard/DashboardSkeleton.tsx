import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-sm border border-gray-200 h-80 flex flex-col">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex-1 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-gray-200 h-80 flex flex-col">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex-1 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="p-6">
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
