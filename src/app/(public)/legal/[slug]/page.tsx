import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLegalPage } from '@/lib/server/legal';
import { LegalPageLayout, formatLegalDate, slugifyHeading, type TocItem } from '@/components/legal/LegalPageLayout';
import { PortableTextBody } from '@/components/legal/PortableTextBody';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getLegalPage(slug);
    if (!page) return { title: 'Page Not Found' };
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.summary || undefined,
      keywords: page.seo?.keywords,
    };
  } catch {
    return { title: 'Page Not Found' };
  }
}

export default async function LegalPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) {
    notFound();
  }

  const usedIds = new Set<string>();
  const sections = (page.sections || [])
    .filter((section) => section?.heading)
    .map((section, index) => {
      let id = slugifyHeading(section.heading) || `section-${index + 1}`;
      if (usedIds.has(id)) id = `${id}-${index + 1}`;
      usedIds.add(id);
      return { ...section, id };
    });

  const toc: TocItem[] = sections.map((section) => ({ id: section.id, label: section.heading }));
  const lastUpdated = formatLegalDate(page.lastUpdated);

  return (
    <LegalPageLayout
      title={page.title}
      eyebrow={lastUpdated ? `Last updated ${lastUpdated}` : undefined}
      summary={page.summary}
      toc={toc}
    >
      <div className="flex flex-col gap-12">
        {sections.map((section, index) => (
          <section key={section._key || section.id} id={section.id} className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1B1A17] leading-tight tracking-tight mb-6">
              <span className="text-[#7D7975] mr-3">{index + 1}.</span>
              {section.heading}
            </h2>
            <PortableTextBody value={section.body} />
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
}
