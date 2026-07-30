import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface RichTextRendererProps {
  html: string;
  className?: string;
}

export function RichTextRenderer({ html, className = '' }: RichTextRendererProps) {
  if (!html) return null;

  // Sanitize HTML output to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h2', 'h3', 
      'ul', 'ol', 'li', 'blockquote', 'hr', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'style'],
  });

  return (
    <div 
      className={`prose prose-gray max-w-none font-light leading-relaxed prose-headings:font-serif prose-a:text-blue-600 hover:prose-a:text-blue-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
}
