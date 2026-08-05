import { Metadata } from 'next';
import Image from 'next/image';
import { ABOUT_CONTENT } from '@/content/about';
import React from 'react';

export const metadata: Metadata = {
  title: 'About | Miio',
  description: ABOUT_CONTENT.intro.body,
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white font-montserrat">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 leading-[1.1] max-w-4xl">
            {ABOUT_CONTENT.hero.titleLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < ABOUT_CONTENT.hero.titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="mt-12 text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
            {ABOUT_CONTENT.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-32 px-6 max-w-3xl mx-auto w-full text-center">
        <span className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-8 block">
          {ABOUT_CONTENT.intro.label}
        </span>
        <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 leading-snug">
          {ABOUT_CONTENT.intro.body}
        </p>
      </section>

      {/* Story */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto w-full border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-8 block">
              {ABOUT_CONTENT.story.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 leading-tight">
              {ABOUT_CONTENT.story.headingLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < ABOUT_CONTENT.story.headingLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <div className="space-y-6 text-gray-500 font-light text-lg leading-relaxed">
              {ABOUT_CONTENT.story.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="aspect-[4/5] bg-gray-100 w-full relative overflow-hidden">
               <Image
                 src={ABOUT_CONTENT.story.image}
                 alt={ABOUT_CONTENT.story.imageAlt}
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Pull Quote */}
      <section className="py-24 md:py-40 px-6 max-w-5xl mx-auto w-full text-center">
        <blockquote className="font-cormorant italic text-4xl md:text-6xl text-gray-900 leading-tight font-light">
          {ABOUT_CONTENT.pullQuote.text}
        </blockquote>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto w-full border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-8 block">
              {ABOUT_CONTENT.philosophy.label}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight pr-8">
              {ABOUT_CONTENT.philosophy.heading}
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <div className="space-y-6 text-gray-500 font-light text-lg leading-relaxed">
              {ABOUT_CONTENT.philosophy.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto w-full text-center border-t border-gray-100">
        <p className="text-2xl font-light text-gray-900 leading-relaxed mb-12">
          {ABOUT_CONTENT.closing.body}
        </p>
        <a href={ABOUT_CONTENT.closing.cta.href} className="inline-block border-b border-gray-900 pb-1 text-gray-900 hover:text-gray-500 hover:border-gray-500 transition-colors tracking-wide uppercase text-sm">
          {ABOUT_CONTENT.closing.cta.text}
        </a>
      </section>
    </main>
  );
}
