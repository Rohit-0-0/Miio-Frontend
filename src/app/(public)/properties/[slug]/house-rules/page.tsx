import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisibleProperty } from '@/lib/server/property';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { HouseRulesContent, groupHouseRules, houseRuleCategoryId } from '@/components/properties/HouseRulesContent';

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
    title: name ? `House Rules – ${name}` : 'House Rules',
    robots: { index: false },
  };
}

export default async function PropertyHouseRulesPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { id } = await searchParams;
  const property = await getVisibleProperty(slug, id);

  if (!property) {
    notFound();
  }

  const name = property.nickname || property.title;
  const rules = property.editorial?.houseRules || [];
  const toc = groupHouseRules(rules).map((group) => ({ id: houseRuleCategoryId(group.value), label: group.label }));

  return (
    <LegalPageLayout
      title="House Rules"
      eyebrow={name}
      toc={toc}
      backLink={{ href: `/properties/${property.slug || slug}`, label: `Back to ${name}` }}
    >
      {rules.length > 0 ? (
        <HouseRulesContent rules={rules} intro={property.editorial?.houseRulesIntro} />
      ) : (
        <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] font-light leading-[1.7]">
          House rules for this stay will be shared with you before check-in.
        </p>
      )}
    </LegalPageLayout>
  );
}
