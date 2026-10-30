import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

export interface TocItem {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  eyebrow?: string;
  summary?: string;
  toc?: TocItem[];
  backLink?: { href: string; label: string };
  children: ReactNode;
}

export function LegalPageLayout({ title, eyebrow, summary, toc = [], backLink, children }: LegalPageLayoutProps) {
  const hasToc = toc.length > 1;

  return (
    <main className="flex flex-col bg-[#FEF6EE] min-h-screen font-sans pt-12 md:pt-16 pb-24">
      <Container>
        <div className="max-w-6xl mx-auto">
          {backLink && (
            <Link
              href={backLink.href}
              className="inline-flex items-center text-[13px] font-medium tracking-widest uppercase text-[#7D7975] hover:text-[#1B1A17] mb-8 transition-colors"
            >
              <span aria-hidden="true" className="mr-2">&larr;</span>
              {backLink.label}
            </Link>
          )}

          <header className="mb-12 border-b border-[#1B1A17]/10 pb-12 max-w-3xl">
            {eyebrow && (
              <div className="text-[13px] font-medium uppercase tracking-widest text-[#7D7975] mb-4">{eyebrow}</div>
            )}
            <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight">
              {title}
            </h1>
            {summary && (
              <p className="mt-6 font-sans text-[16px] md:text-[18px] text-[#5F4E44] font-light leading-[1.6]">{summary}</p>
            )}
          </header>

          <div className={hasToc ? 'lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16' : ''}>
            {hasToc && (
              <nav aria-label="Table of contents" className="mb-12 lg:mb-0">
                <div className="lg:sticky lg:top-32 border border-[#1B1A17]/10 lg:border-0 rounded-[4px] p-6 lg:p-0">
                  <div className="text-[13px] font-medium uppercase tracking-widest text-[#7D7975] mb-4">On this page</div>
                  <ol className="flex flex-col gap-3">
                    {toc.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="flex gap-2 font-sans text-[14px] leading-[20px] text-[#5F4E44] hover:text-[#1B1A17] transition-colors"
                        >
                          <span className="text-[#7D7975] tabular-nums">{index + 1}.</span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}

            <div className="max-w-3xl">{children}</div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatLegalDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
