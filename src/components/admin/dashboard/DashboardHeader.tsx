import React from 'react';

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = 'Dashboard' }: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-1">Welcome back to your admin dashboard.</p>
    </div>
  );
}
