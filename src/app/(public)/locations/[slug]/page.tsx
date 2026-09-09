import { notFound } from 'next/navigation';
import { getLocationBySlug } from '@/lib/server/location';
import { Metadata } from 'next';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { env } from '@/config/env';
import { Suspense } from 'react';
import Link from 'next/link';
import { LocationHero } from '@/components/locations/LocationHero';
import { LocationHighlights } from '@/components/locations/LocationHighlights';
import { LocationLocalGuide } from '@/components/locations/LocationLocalGuide';
import { LocationStayCard } from '@/components/locations/LocationStayCard';
import { FinalCTA } from '@/components/home/FinalCTA';

const LOCATION_FINAL_CTA_DEFAULTS = {
  heading: 'A more direct way to stay',
  description:
    'Book directly for the best available rates and a more seamless experience.',
  buttonText: 'Browse by location',
  buttonLink: '/locations',
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    return { title: 'Not Found | Miio' };
  }

  const location = await getLocationBySlug(slug, { cache: 'no-store' });

  if (!location) {
    return { title: 'Not Found | Miio' };
  }

  const seoTitle = location.seo?.title || `${location.title} | Miio`;
  const seoDesc =
    location.seo?.description ||
    location.description ||
    `Discover ${location.title} with Miio.`;

  const ogImage =
    location.heroImage?.asset?._ref ||
    location.heroImage?.asset?._id ||
    location.heroImage?.assetId;

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      images: ogImage ? [buildImageUrl(ogImage)!].filter(Boolean) : [],
    },
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const journalArticles = (location.nearbyJournals || []).filter(
    (j: { slug?: string; title?: string }) => j?.slug && j?.title
  );

  // Prefer Nearby Journals from CMS; fall back to Local Guide Cards if none linked
  const localGuideItems =
    journalArticles.length > 0
      ? journalArticles.map(
          (journal: {
            _id?: string;
            slug: string;
            title: string;
            excerpt?: string;
            author?: string;
            heroImage?: unknown;
          }) => ({
            _key: journal._id || journal.slug,
            title: journal.title,
            description:
              journal.excerpt ||
              (journal.author ? `By ${journal.author}` : undefined),
            image: journal.heroImage,
            href: `/journal/${journal.slug}`,
          })
        )
      : location.localGuideItems;

  return (
    <article className="min-h-screen bg-[#FEF6EE]">
      <LocationHero title={location.title} image={location.heroImage} />

      {/* Intro + highlights card (Figma: text left, white card right) */}
      <section className="bg-[#FEF6EE]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
            <p className="text-[15px] font-normal leading-[170%] text-[#5F4E44] max-w-[560px] flex-1 whitespace-pre-line">
              {location.description}
            </p>
            <div className="shrink-0 lg:pt-1">
              <LocationHighlights items={location.highlights} />
            </div>
          </div>
        </div>
      </section>

      {/* Stays in {location} */}
      {location.guestyCity && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-[188px] pb-16 md:pb-20">
          <Suspense
            fallback={
              <div className="h-64 bg-[rgba(225,219,195,0.2)] animate-pulse rounded-xl" />
            }
          >
            <LocationDynamicProperties
              guestyCity={location.guestyCity}
              locationTitle={location.guestyCity || location.title}
            />
          </Suspense>
        </section>
      )}

      {/* Local guide — powered by Nearby Journals */}
      <LocationLocalGuide
        heading={location.localGuideHeading || 'Local guide'}
        items={localGuideItems}
        relatedJournalsCta={location.relatedJournalsCta || 'Related journal articles ->'}
        journalHref="/journal"
        showRelatedLink={journalArticles.length > 0 || !!location.relatedJournalsCta}
      />

      <FinalCTA
        finalCta={location.finalCta}
        defaults={LOCATION_FINAL_CTA_DEFAULTS}
        className="bg-[#FEF6EE]"
      />

      <div className="py-8 flex justify-center md:hidden">
        <Link href="/locations" className="text-[14px] text-[#5F4E44]">
          Back to locations
        </Link>
      </div>
    </article>
  );
}

async function LocationDynamicProperties({
  guestyCity,
  locationTitle,
}: {
  guestyCity: string;
  locationTitle: string;
}) {
  let properties: any[] = [];
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('city', guestyCity);

    const propertiesRes = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/booking/search?${searchParams.toString()}`,
      { cache: 'no-store' }
    );

    if (propertiesRes.ok) {
      const data = await propertiesRes.json();
      properties = data.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch dynamic properties for location:', err);
  }

  if (properties.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-serif text-[28px] md:text-[32px] text-[#241D19]">
        Stays in {locationTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {properties.slice(0, 3).map((p: any) => {
          const id = p._id || p.id;
          const coverImage =
            p.picture?.large || p.picture?.regular || p.pictures?.[0]?.original || null;
          const currency = p.prices?.currency === 'AUD' ? '$' : p.prices?.currency || '';
          let price = '';
          let priceLabel = '/ night';
          if (p.prices?.basePrice) {
            price = `${currency}${p.prices.basePrice}`;
          } else if (p.prices?.totalPrice) {
            price = `${currency}${p.prices.totalPrice}`;
            priceLabel = 'total';
          }

          return (
            <LocationStayCard
              key={id}
              id={id}
              slug={id}
              name={p.nickname || p.title || 'Unknown Property'}
              location={
                [p.address?.city, p.address?.country].filter(Boolean).join(', ') ||
                locationTitle
              }
              guests={p.accommodates || 2}
              bedrooms={p.bedrooms || 1}
              price={price}
              priceLabel={priceLabel}
              coverImage={coverImage}
            />
          );
        })}
      </div>
    </div>
  );
}