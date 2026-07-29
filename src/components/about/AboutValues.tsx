import React from 'react';
import { AboutData } from '@/types/about';

export function AboutValues({ values }: { values: AboutData['values'] }) {
  if (!values || values.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Core Values</h3>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900">What Drives Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {values.map((value, index) => (
            <div key={index} className="space-y-4">
              {value.icon && (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-xl">
                  {/* Depending on what value.icon contains, it could be an emoji, an SVG string, or an asset id. Render as text for now. */}
                  <span>{value.icon}</span>
                </div>
              )}
              <h4 className="text-xl font-serif font-bold text-gray-900">{value.title}</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
