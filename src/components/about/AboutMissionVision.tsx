import React from 'react';
import { AboutData } from '@/types/about';

export function AboutMissionVision({ 
  mission, 
  vision 
}: { 
  mission: AboutData['mission'];
  vision: AboutData['vision'];
}) {
  if (!mission && !vision) return null;

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {mission && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Our Mission</h3>
              <h2 className="text-2xl md:text-4xl font-serif text-gray-900 leading-tight">
                {mission.title}
              </h2>
              <p className="text-lg font-light text-gray-600 leading-relaxed whitespace-pre-wrap">
                {mission.description}
              </p>
            </div>
          )}

          {vision && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Our Vision</h3>
              <h2 className="text-2xl md:text-4xl font-serif text-gray-900 leading-tight">
                {vision.title}
              </h2>
              <p className="text-lg font-light text-gray-600 leading-relaxed whitespace-pre-wrap">
                {vision.description}
              </p>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
