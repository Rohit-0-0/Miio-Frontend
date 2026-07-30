import React from 'react';
import { DashboardStats as StatsType } from '@/types/dashboard';
import { Building, Globe, Edit3, Star } from 'lucide-react';

export function DashboardStats({ stats }: { stats: StatsType }) {
  const items = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building, color: 'bg-blue-100 text-blue-600' },
    { label: 'Published', value: stats.published, icon: Globe, color: 'bg-green-100 text-green-600' },
    { label: 'Drafts', value: stats.draft, icon: Edit3, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Featured', value: stats.featured, icon: Star, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${item.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
