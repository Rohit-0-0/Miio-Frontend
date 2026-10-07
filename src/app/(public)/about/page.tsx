import { Metadata } from 'next';
import Image from 'next/image';
import { editorialService } from '@/services/about.service';
import { notFound } from 'next/navigation';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import React from 'react';

// For metadata we might want to fetch dynamically, but for now we'll fetch inside generateMetadata or keep it static.
export const metadata: Metadata = {
  title: 'About | Miio',
  description: 'Learn about Miio.',
};

export default async function AboutPage() {
  let response;
  try {
    response = await editorialService.getAbout();
  } catch (error: any) {
    if (error?.status === 404) {
      notFound();
    }
    throw error; // Rethrow actual API errors
  }

  if (!response?.success || !response?.data) {
    notFound();
  }
  const about = response.data;
  
  // Resolve image URL
  const imageRef = about.story?.founderImage;
  const imageSrc = buildImageUrl(imageRef) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80';

  return (
    <main className="flex flex-col min-h-screen bg-[#FEF6EE] font-sans">
      {/* Hero */}
      <section className="pt-[48px] pb-16 md:pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col text-left mb-8 border-b border-[#1B1A17]/10 pb-12">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight mb-4">
            {(about.hero.title || '').replace(/\n|<br\s*\/?>/gi, ' ')}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] w-full font-light leading-[1.6]">
            {about.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-20 md:pb-32 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="order-2 md:order-1">
            {about.story.label && (
              <span className="text-[13px] tracking-widest text-[#7D7975] uppercase mb-8 block font-medium">
                {about.story.label}
              </span>
            )}
            {about.story.heading && (
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B1A17] mb-8 leading-tight">
                {about.story.heading}
              </h2>
            )}
            <div className="space-y-6 text-[#5F4E44] text-lg leading-relaxed">
              {(about.story.paragraphs || []).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-[#EAE8E1] w-full relative overflow-hidden rounded-sm">
               <Image
                 src={imageSrc}
                 alt={about.story.altText || "About Miio"}
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
