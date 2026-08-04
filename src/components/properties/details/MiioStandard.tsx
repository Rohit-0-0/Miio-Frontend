import React from 'react';

interface MiioStandardItem {
  icon: string;
  title: string;
  description: string;
}

interface MiioStandardProps {
  standards?: MiioStandardItem[];
}

export function MiioStandard({ standards }: MiioStandardProps) {
  if (!standards || standards.length === 0) return null;

  return (
    <section className="mb-12 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
        The Miio Standard
      </h2>
      <p className="text-gray-500 mb-8">Every stay includes our signature hospitality</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {standards.map((standard, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            {/* The icon would be resolved by a utility map based on standard.icon string */}
            <div className="w-10 h-10 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-xs text-gray-500">
              {standard.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{standard.title}</h3>
            <p className="text-sm text-gray-600">{standard.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
