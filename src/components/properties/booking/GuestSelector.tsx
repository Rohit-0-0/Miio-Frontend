import React from 'react';

export function GuestSelector() {
  return (
    <div className="border border-gray-300 border-t-0 rounded-b-md p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
      <div>
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Guests</div>
        <div className="text-sm text-gray-500 mt-0.5">1 guest</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
