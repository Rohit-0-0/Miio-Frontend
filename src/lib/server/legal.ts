import type { PortableTextBlock } from 'next-sanity';
import { sanityFetch } from './sanityFetch';

export interface LegalSection {
  _key: string;
  heading: string;
  body?: PortableTextBlock[];
}

export interface LegalPage {
  title: string;
  slug: string;
  lastUpdated?: string;
  summary?: string;
  sections?: LegalSection[];
  seo?: { title?: string; description?: string; keywords?: string[] };
}

export interface LegalLink {
  title: string;
  slug: string;
}

const DEFAULT_LEGAL_LINKS: LegalLink[] = [
  { title: 'Terms', slug: 'terms' },
  { title: 'Privacy', slug: 'privacy' },
];

const PUBLISHED_LEGAL_PAGES = `_type == "legalPage" && defined(slug.current) && !(_id in path("drafts.**"))`;

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const query = `*[${PUBLISHED_LEGAL_PAGES} && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    lastUpdated,
    summary,
    sections[]{ _key, heading, body },
    seo
  }`;

  return await sanityFetch<LegalPage | null>({
    query,
    params: { slug },
    tags: ['legalPage'],
  });
}

export async function getLegalPageSlugs(): Promise<{ slug: string; lastUpdated?: string }[]> {
  const query = `*[${PUBLISHED_LEGAL_PAGES}]{ "slug": slug.current, lastUpdated }`;

  return (await sanityFetch<{ slug: string; lastUpdated?: string }[]>({ query, tags: ['legalPage'] })) || [];
}

export async function getFooterLegalLinks(): Promise<LegalLink[]> {
  const query = `*[${PUBLISHED_LEGAL_PAGES} && showInFooter != false] | order(footerOrder asc, title asc){
    title,
    "slug": slug.current
  }`;

  try {
    const links = await sanityFetch<LegalLink[]>({ query, tags: ['legalPage'] });
    return links?.length ? links : DEFAULT_LEGAL_LINKS;
  } catch (error) {
    console.error('Failed to fetch legal links:', error);
    return DEFAULT_LEGAL_LINKS;
  }
}

export function legalPageHref(slug: string): string {
  return `/legal/${slug}`;
}
