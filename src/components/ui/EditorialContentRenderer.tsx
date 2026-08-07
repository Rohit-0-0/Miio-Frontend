import React from 'react';

export interface EditorialContentRendererProps {
  content: string;
  className?: string;
}

type BlockNode = 
  | { type: 'heading', text: string }
  | { type: 'paragraph', text: string }
  | { type: 'list', items: string[] };

const COMMON_HEADINGS = [
  'shopping',
  'location',
  'what guests love',
  'the apartment includes',
  'beaches',
  'restaurants & cafés',
  'restaurants & cafes',
  'nearby destination dining',
  'coastal walks',
  'getting around',
  'amenities',
  'features'
];

function parseEditorialContent(text: string): BlockNode[] {
  // Create a regex to detect inline headings (e.g. "Shopping: 1) Plumer Road...")
  const headingsPattern = COMMON_HEADINGS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const inlineHeadingRegex = new RegExp(`^(${headingsPattern})[\\s:\\-–]+(.+)`, 'i');

  const rawLines = text.split(/\r?\n/);
  const lines: string[] = [];

  // Pre-process lines to split inline headings
  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      lines.push('');
      continue;
    }

    const inlineMatch = trimmed.match(inlineHeadingRegex);
    if (inlineMatch && inlineMatch[2].length > 5) {
      // It matched an inline heading with substantial text following it
      lines.push(inlineMatch[1]); // The heading
      lines.push(inlineMatch[2]); // The content
    } else {
      lines.push(trimmed);
    }
  }

  const nodes: BlockNode[] = [];
  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const pText = currentParagraph.join(' ').trim();
      if (pText.length > 0) {
        const lowerText = pText.toLowerCase().replace(/[:\-–]$/, '').trim();
        const startsWithCommonHeading = COMMON_HEADINGS.some(h => lowerText.startsWith(h));
        
        let isHeading = false;
        if (startsWithCommonHeading && pText.length <= 60) {
           isHeading = true;
        } else if (currentParagraph.length === 1 && pText.length <= 70 && !/[.,!?]$/.test(pText) && pText.split(' ').length <= 10) {
           isHeading = true;
        } else if (currentParagraph.length === 1 && pText.endsWith(':') && pText.length <= 80) {
           isHeading = true;
        }

        // Clean up heading text (remove trailing colons or hyphens for cleaner presentation)
        if (isHeading) {
           const cleanHeading = pText.replace(/[:\-–]+$/, '').trim();
           nodes.push({ type: 'heading', text: cleanHeading });
        } else {
           nodes.push({ type: 'paragraph', text: pText });
        }
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      nodes.push({ type: 'list', items: [...currentList] });
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Detect bullet lists or numbered lists like "1)", "1.", etc.
    const listMatch = line.match(/^([•\-*]|\d+[\).])\s+(.+)/);
    if (listMatch) {
      flushParagraph();
      currentList.push(listMatch[2].trim());
    } else {
      flushList();
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushList();

  return nodes;
}

export function EditorialContentRenderer({ content, className = '' }: EditorialContentRendererProps) {
  if (!content) return null;

  const nodes = parseEditorialContent(content);

  return (
    <div className={`editorial-content ${className}`}>
      {nodes.map((node, index) => {
        if (node.type === 'heading') {
          return (
            <h3 
              key={index} 
              className={`font-serif text-2xl text-gray-900 ${index !== 0 ? 'mt-10' : ''} mb-4`}
            >
              {node.text}
            </h3>
          );
        }

        if (node.type === 'paragraph') {
          return (
            <p 
              key={index} 
              className="text-lg text-gray-600 leading-relaxed mb-6 font-light"
            >
              {node.text}
            </p>
          );
        }

        if (node.type === 'list') {
          return (
            <ul key={index} className="list-disc list-outside ml-5 mb-8 space-y-2 text-lg text-gray-600 font-light">
              {node.items.map((item, i) => (
                <li key={i} className="pl-2 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </div>
  );
}
