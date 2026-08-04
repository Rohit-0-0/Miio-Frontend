import React from 'react';

interface BookingActionsProps {
  children: React.ReactNode;
}

export function BookingActions({ children }: BookingActionsProps) {
  return (
    <div className="mt-4 text-center">
      {children}
      <p className="text-sm text-gray-500 mt-4">You won't be charged yet</p>
    </div>
  );
}
