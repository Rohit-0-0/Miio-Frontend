import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisibleProperty } from '@/lib/server/property';
import { LegalPageLayout, type TocItem } from '@/components/legal/LegalPageLayout';
import { CANCELLATION_SECTIONS, CancellationPolicyContent } from '@/components/properties/CancellationPolicyContent';
import type { CancellationPolicy } from '@/types/property';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;
  const property = await getVisibleProperty(slug, id);
  const name = property?.nickname || property?.title;

  return {
    title: name ? `Cancellation Policy – ${name}` : 'Cancellation Policy',
    robots: { index: false },
  };
}

export default async function PropertyCancellationPolicyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { id } = await searchParams;
  const property = await getVisibleProperty(slug, id);

  if (!property) {
    notFound();
  }

  const name = property.nickname || property.title;
  const policy: CancellationPolicy | null = property.editorial?.cancellationPolicy || null;

  const toc: TocItem[] = [
    ...(policy?.tiers?.length ? [{ id: CANCELLATION_SECTIONS.timeline, label: 'Refund timeline' }] : []),
    ...(policy?.details?.length ? [{ id: CANCELLATION_SECTIONS.details, label: 'Additional terms' }] : []),
  ];

  return (
    <LegalPageLayout
      title="Cancellation Policy"
      eyebrow={[name, policy?.title].filter(Boolean).join(' · ')}
      toc={toc}
      backLink={{ href: `/properties/${property.slug || slug}`, label: `Back to ${name}` }}
    >
      {policy ? (
        <CancellationPolicyContent policy={policy} />
      ) : (
        <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] font-light leading-[1.7]">
          The cancellation policy for this stay will be confirmed in your booking confirmation.
        </p>
      )}
    </LegalPageLayout>
  );
}
