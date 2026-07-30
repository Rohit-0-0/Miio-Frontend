import React from 'react';
import { RecentActivityItem } from '@/types/dashboard';
import { Activity } from 'lucide-react';

export function RecentActivity({ activity }: { activity: RecentActivityItem[] }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        {activity.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
              <Activity size={24} />
            </div>
            <h4 className="text-gray-900 font-medium mb-1">No Recent Activity</h4>
            <p className="text-sm text-gray-500 max-w-xs">
              Activity logging is currently not fully implemented. Future updates will display your team's actions here.
            </p>
          </div>
        ) : (
          <div className="w-full text-left space-y-4">
            {activity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{item.user.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{item.user}</span>{' '}
                    {item.type === 'PROPERTY_UPDATED' ? 'updated property' : 'performed action'}{' '}
                    <span className="font-medium">{item.propertyName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
