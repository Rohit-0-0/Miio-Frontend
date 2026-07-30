import React from 'react';
import { PropertyDocument, LIFECYCLE_STATUS } from '@/types/property';
import { AppImage } from '@/components/media/AppImage';
import Link from 'next/link';

export function RecentProperties({ properties }: { properties: PropertyDocument[] }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Properties</h3>
        <Link href="/admin/properties" className="text-sm font-medium text-gray-900 hover:underline">
          View All
        </Link>
      </div>
      
      {properties.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No properties found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <th className="p-4 font-medium">Property</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Updated</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                        <AppImage 
                          image={{ assetId: property.coverImageId || property.gallery?.[0]?.assetId || '' }}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {property.title}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      property.lifecycleStatus === LIFECYCLE_STATUS.PUBLISHED ? 'bg-green-100 text-green-800' :
                      property.lifecycleStatus === LIFECYCLE_STATUS.DRAFT ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.lifecycleStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(property._updatedAt || property._createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/properties/${property.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
