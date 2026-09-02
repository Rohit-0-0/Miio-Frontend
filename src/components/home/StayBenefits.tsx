import React from 'react';
import { StayBenefitsSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';

export function StayBenefits({ benefits }: { benefits: StayBenefitsSection }) {
  if (!benefits || !benefits.items || benefits.items.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-24 md:py-32 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image */}
      {benefits.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <AppImage 
            image={benefits.backgroundImage as any} 
            alt="Benefits Background" 
            className="object-cover"
            fill
          />
          {/* Overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Cards Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#F8F5EF] p-8 md:p-10 rounded-sm shadow-lg flex flex-col items-start space-y-6"
            >
              {item.icon && (
                <div 
                  className="w-8 h-8 text-[#C27E6A] flex-shrink-0"
                  dangerouslySetInnerHTML={{ __html: item.icon }} 
                />
              )}
              
              <div className="flex flex-col space-y-3">
                <h3 className="text-xl md:text-2xl font-serif text-[#1B1A17] leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm font-light text-[#1B1A17]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
