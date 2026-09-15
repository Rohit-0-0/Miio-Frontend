import React from 'react';

interface ReserveButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  label?: string;
}

export function ReserveButton({
  disabled,
  isLoading,
  onClick,
  label = 'Book now',
}: ReserveButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full font-medium py-3.5 px-6 rounded-full transition-opacity flex justify-center items-center text-[15px] ${
        disabled
          ? 'bg-[#C3BA8D]/50 text-black/70 cursor-not-allowed'
          : 'bg-[#C3BA8D] text-black hover:opacity-90'
      }`}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
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
      )}
      {label}
    </button>
  );
}