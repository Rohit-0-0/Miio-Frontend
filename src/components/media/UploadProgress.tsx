import React from 'react';

export function UploadProgress({ progress, message }: { progress?: number; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-6">
      <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin"></div>
      {message && <p className="text-sm font-medium text-gray-700">{message}</p>}
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-gray-900 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}
