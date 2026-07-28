import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retryAction?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error loading this content. Please try again.',
  retryAction
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{message}</p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
