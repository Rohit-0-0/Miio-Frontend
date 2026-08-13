import { Metadata } from 'next';
import Link from 'next/link';
import { getPartnerWithUsData } from '@/lib/server/partner-with-us';

export const metadata: Metadata = {
  title: 'Partner With Us | Miio',
  description: 'A more considered way to manage your property.',
};

export default async function PartnerWithUsPage() {
  const data = await getPartnerWithUsData({ cache: 'no-store' });

  if (!data) {
    return (
      <div className="py-24 text-center">Content unavailable.</div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#F6F4EE] flex flex-col items-center pt-32 pb-24 px-6 md:px-10 lg:px-16 text-[#38332A]">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Headline */}
        <section className="border-b border-[#38332A]/10 pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-3xl">
            {data.headline}
          </h1>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Problem */}
          <section className="flex flex-col gap-6">
            <h2 className="text-sm tracking-[0.2em] uppercase text-[#6B6350]">The Problem</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              {data.problem}
            </p>
          </section>

          {/* Solution */}
          <section className="flex flex-col gap-6">
            <h2 className="text-sm tracking-[0.2em] uppercase text-[#6B6350]">The Solution</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              {data.solution}
            </p>
          </section>
        </div>

        {/* Process & CTA */}
        <section className="pt-16 border-t border-[#38332A]/10 flex flex-col items-center text-center gap-8">
          <h2 className="text-2xl font-light">
            {data.processCtaText}
          </h2>
          {data.ctaButton && data.ctaButton.label && (
            <Link 
              href={data.ctaButton.link || '#'}
              className="px-8 py-4 bg-[#38332A] text-[#F6F4EE] rounded-full hover:bg-[#2A261E] transition-colors uppercase tracking-widest text-sm"
            >
              {data.ctaButton.label}
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}
