import React from 'react';

interface BookingActionsProps {
  children: React.ReactNode;
}

export function BookingActions({ children }: BookingActionsProps) {
  return <div className="mt-4 text-center">{children}</div>;
}