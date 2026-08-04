import React from 'react';

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  value?: string;
  isActive?: boolean;
}

export function FilterPill({ label, value, isActive, className = '', ...props }: FilterPillProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-between gap-3
        px-5 py-3 rounded-full text-sm font-medium
        transition-colors duration-200 ease-out border
        ${isActive 
          ? 'bg-gray-900 text-white border-gray-900' 
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
        }
        ${props.disabled ? 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:bg-white' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      <span>{label}</span>
      {value && (
        <span className={`font-normal ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
          {value}
        </span>
      )}
      <svg className="w-4 h-4 ml-1 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
