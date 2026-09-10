'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-2">
      <h2 className="font-serif text-[28px] md:text-[32px] text-[#1B1A17] mb-6">FAQ</h2>
      <div className="border-t border-[#1B1A17]/15">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-[#1B1A17]/15">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center gap-4 text-left py-5 focus:outline-none"
              >
                <span className="font-sans text-[15px] md:text-[16px] text-[#1B1A17]">{faq.question}</span>
                <span className="shrink-0 w-7 h-7 rounded-full border border-[#1B1A17]/20 flex items-center justify-center text-[#1B1A17]">
                  {isOpen ? <Minus className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </span>
              </button>
              {isOpen && (
                <div className="font-sans pb-5 pr-10 text-[15px] text-[#1B1A17]/70 leading-relaxed">
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
