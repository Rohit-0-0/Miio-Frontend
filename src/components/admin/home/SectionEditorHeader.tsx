import React from 'react';

interface SectionEditorHeaderProps {
  title: string;
  isDirty: boolean;
  isSaving: boolean;
  updatedAt?: string;
  onSave: () => void;
  error?: string | null;
  success?: string | null;
}

export function SectionEditorHeader({
  title,
  isDirty,
  isSaving,
  updatedAt,
  onSave,
  error,
  success
}: SectionEditorHeaderProps) {
  
  const timeAgo = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) return 'Just now';
    
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {updatedAt && (
          <p className="text-sm text-gray-500 mt-1">
            Last saved: {timeAgo(updatedAt)}
          </p>
        )}
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        {error && <span className="text-sm text-red-600">{error}</span>}
        {success && <span className="text-sm text-green-600">{success}</span>}
        
        <button
          type="button"
          disabled={isSaving || !isDirty}
          onClick={onSave}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSaving ? 'Saving...' : (isDirty ? 'Save Changes' : 'Saved')}
        </button>
      </div>
    </div>
  );
}
