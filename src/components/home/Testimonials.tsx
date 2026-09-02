import React from 'react';
import { TestimonialsSection } from '@/types/homepage';

export function Testimonials({ testimonials }: { testimonials: TestimonialsSection }) {
  if (!testimonials || !testimonials.items || testimonials.items.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#EAE8E1] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl">
          {testimonials.items.map((item, index) => (
            <div 
              key={index}
              className="bg-[#F8F5EF] p-8 md:p-12 rounded-2xl shadow-sm flex flex-col justify-between space-y-8 h-full"
            >
              <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-1 text-[#1B1A17]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="ml-3 text-[10px] font-bold tracking-widest uppercase text-white bg-[#8C6D5A] rounded-sm px-2 py-1 leading-none">
                    Verified Stay
                  </span>
                </div>
                
                <blockquote className="text-xl md:text-[22px] font-serif text-[#1B1A17] leading-relaxed">
                  "{item.quote}"
                </blockquote>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex flex-col text-xs font-medium text-gray-500 gap-0.5">
                  <span className="text-[#1B1A17] text-sm">
                    {item.author}{item.date ? `, ${item.date}` : ''}
                  </span>
                  {(item.source || item.location) && (
                    <span>{item.source || item.location}</span>
                  )}
                </div>
                
                {item.sourceLogo && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                    <img 
                      src={`/api/sanity/image?id=${(item.sourceLogo as any).asset?._ref || (item.sourceLogo as any).asset?._id || (item.sourceLogo as any).assetId}`} 
                      alt={item.source || "Source Logo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
