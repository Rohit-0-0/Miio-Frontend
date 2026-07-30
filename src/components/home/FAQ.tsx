'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FaqSection } from '@/types/homepage';

export function FAQ({ faq }: { faq: FaqSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  if (!faq || !faq.items || faq.items.length === 0) return null;

  return (
    <Section className="bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {faq.title}
            </h2>
            {faq.subtitle && (
              <p className="text-lg text-gray-600">
                {faq.subtitle}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={item.id || index}
                  className="bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-gray-900 text-lg pr-8">{item.question}</span>
                    <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-5 text-gray-600 whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
