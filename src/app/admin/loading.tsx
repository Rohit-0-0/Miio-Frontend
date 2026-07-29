import React from 'react';
import { PageContainer } from '@/components/admin/shared/PageContainer';

export default function AdminLoading() {
  return (
    <PageContainer>
      <div className="flex flex-col space-y-8 animate-pulse pt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded-sm w-64"></div>
            <div className="h-4 bg-gray-100 rounded-sm w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-sm w-32"></div>
        </div>
        
        <div className="h-[400px] bg-gray-50 border border-gray-100 rounded-sm w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-500">Loading page...</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
