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
      className={`font-sans prose prose-gray max-w-none font-light leading-relaxed prose-headings:font-serif prose-p:font-sans prose-li:font-sans prose-a:text-blue-600 hover:prose-a:text-blue-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
