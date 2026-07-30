'use client';

import React from 'react';
import { DashboardCharts as ChartsType } from '@/types/dashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const PIE_COLORS = ['#10B981', '#F59E0B', '#8B5CF6']; // Green for published, Yellow for draft, Purple for featured

export function DashboardCharts({ charts }: { charts: ChartsType }) {
  const pieData = [
    { name: 'Published', value: charts.propertyStatus.published },
    { name: 'Draft', value: charts.propertyStatus.draft },
    { name: 'Featured', value: charts.propertyStatus.featured },
  ].filter(d => d.value > 0);

  // Fallback if no properties exist
  if (pieData.length === 0) {
    pieData.push({ name: 'No Data', value: 1 });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Monthly Properties Bar Chart */}
      <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Properties Added Per Month</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.monthlyProperties}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Status Pie Chart */}
      <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Property Status</h3>
        <div className="h-72 w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'No Data' ? '#E5E7EB' : PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
