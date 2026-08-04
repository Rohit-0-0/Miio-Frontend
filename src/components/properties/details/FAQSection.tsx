'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mb-12 pt-12 border-t border-gray-100">
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center text-left py-4 focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="text-gray-400 text-2xl leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="pb-4 text-gray-600 prose prose-lg">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
