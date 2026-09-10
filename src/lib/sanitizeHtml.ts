/**
 * Lightweight HTML allowlist sanitizer for Node and the browser.
 * Avoids isomorphic-dompurify / jsdom, which crash Netlify serverless SSR.
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
  'a',
  'img',
  'span',
  'div',
]);

const GLOBAL_ATTRS = new Set(['class', 'title']);
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel', 'class', 'title']),
  img: new Set(['src', 'alt', 'title', 'class']),
};

const DANGEROUS_BLOCK =
  /<\s*(script|style|iframe|object|embed|link|meta|form|input|button|textarea|select)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const DANGEROUS_VOID =
  /<\s*(script|style|iframe|object|embed|link|meta|form|input|button|textarea|select)\b[^>]*\/?\s*>/gi;
const TAG_PATTERN = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
const ATTR_PATTERN = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/gi;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:')
  );
}

function sanitizeAttributes(tag: string, rawAttrs: string): string {
  const allowed = TAG_ATTRS[tag] || GLOBAL_ATTRS;
  const kept: string[] = [];
  ATTR_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ATTR_PATTERN.exec(rawAttrs)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';

    if (name.startsWith('on')) continue;
    if (!allowed.has(name) && !GLOBAL_ATTRS.has(name)) continue;
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue;
    if (name === 'target' && value !== '_blank' && value !== '_self') continue;

    const escaped = value.replace(/"/g, '&quot;');
    kept.push(`${name}="${escaped}"`);

    if (tag === 'a' && name === 'target' && value === '_blank') {
      kept.push('rel="noopener noreferrer"');
    }
  }

  return kept.length ? ` ${kept.join(' ')}` : '';
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let cleaned = html
    .replace(DANGEROUS_BLOCK, '')
    .replace(DANGEROUS_VOID, '')
    .replace(/javascript:/gi, '');

  cleaned = cleaned.replace(TAG_PATTERN, (full, tagName: string, attrs = '') => {
    const tag = tagName.toLowerCase();
    const isClosing = full.startsWith('</');

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    if (isClosing) {
      return `</${tag}>`;
    }

    if (tag === 'br' || tag === 'hr') {
      return `<${tag} />`;
    }

    return `<${tag}${sanitizeAttributes(tag, attrs || '')}>`;
  });

  return cleaned;
}