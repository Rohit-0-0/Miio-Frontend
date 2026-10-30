import React from 'react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface RichTextRendererProps {
  html: string;
  className?: string;
}

export function RichTextRenderer({ html, className = '' }: RichTextRendererProps) {
  if (!html) return null;

  const sanitizedHtml = sanitizeHtml(html);

  if (!sanitizedHtml) return null;

  return (
    <div
      className={`font-sans max-w-none font-light leading-relaxed text-[#5F4E44]
        [&_h1]:font-serif [&_h1]:text-[32px] md:[&_h1]:text-[38px] [&_h1]:font-normal [&_h1]:text-[#1B1A17] [&_h1]:leading-tight [&_h1]:mt-10 [&_h1]:mb-4 first:[&_h1]:mt-0
        [&_h2]:font-serif [&_h2]:text-[24px] md:[&_h2]:text-[28px] [&_h2]:font-normal [&_h2]:text-[#1B1A17] [&_h2]:leading-snug [&_h2]:mt-8 [&_h2]:mb-3 first:[&_h2]:mt-0
        [&_h3]:font-serif [&_h3]:text-[20px] md:[&_h3]:text-[22px] [&_h3]:font-normal [&_h3]:text-[#1B1A17] [&_h3]:leading-snug [&_h3]:mt-6 [&_h3]:mb-2 first:[&_h3]:mt-0
        [&_h4]:font-sans [&_h4]:text-[16px] md:[&_h4]:text-[17px] [&_h4]:font-medium [&_h4]:text-[#1B1A17] [&_h4]:leading-snug [&_h4]:mt-5 [&_h4]:mb-2 first:[&_h4]:mt-0
        [&_p]:font-sans [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:font-light [&_p]:text-[#5F4E44] [&_p]:leading-[1.75] [&_p]:mb-5 last:[&_p]:mb-0
        [&_strong]:font-medium [&_strong]:text-[#1B1A17] [&_b]:font-medium [&_b]:text-[#1B1A17]
        [&_em]:italic [&_i]:italic
        [&_ul]:font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-5 [&_ul]:text-[15px] md:[&_ul]:text-[16px] [&_ul]:text-[#5F4E44] [&_ul]:font-light
        [&_ol]:font-sans [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:mb-5 [&_ol]:text-[15px] md:[&_ol]:text-[16px] [&_ol]:text-[#5F4E44] [&_ol]:font-light
        [&_li]:leading-[1.7]
        [&_blockquote]:border-l-2 [&_blockquote]:border-[#1B1A17]/25 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-[#1B1A17]/80 [&_blockquote]:font-sans
        [&_a]:text-[#99583D] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#1B1A17] [&_a]:transition-colors
        [&_img]:w-full [&_img]:rounded-lg [&_img]:object-cover [&_img]:my-6
        [&_figure]:my-8
        [&_figcaption]:font-sans [&_figcaption]:text-[13px] [&_figcaption]:text-[#7D7975] [&_figcaption]:text-center [&_figcaption]:mt-2
        [&_hr]:border-[#1B1A17]/15 [&_hr]:my-8
        ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
