import React from 'react';
import Link from 'next/link';
import { Plus, List, Settings } from 'lucide-react';

export function DashboardQuickActions() {
  const actions = [
    { label: 'Add Property', icon: Plus, href: '/admin/properties/new', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { label: 'Manage Properties', icon: List, href: '/admin/properties', color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
    { label: 'Homepage CMS', icon: Settings, href: '/admin/home', color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
  ];

  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-6 grid grid-cols-1 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link 
              key={idx} 
              href={action.href}
              className={`flex items-center gap-3 p-4 rounded-sm transition-colors ${action.color}`}
            >
              <Icon size={20} />
              <span className="font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
