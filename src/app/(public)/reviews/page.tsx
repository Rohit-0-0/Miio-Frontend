import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { TestimonialCard } from '@/components/home/Testimonials';
import { FinalCTA } from '@/components/home/FinalCTA';
import { getReviewsPage } from '@/lib/server/reviewsPage';
import { env } from '@/config/env';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getReviewsPage();
  const title = data.seo?.title || `${data.title} | Stay with Miio`;
  const description =
    data.seo?.description ||
    data.subtitle ||
    'Read verified guest reviews and impressions from stays across Sydney with Stay with Miio.';

  return {
    title,
    description,
    alternates: {
      canonical: '/reviews',
    },
    openGraph: {
      title,
      description,
      url: '/reviews',
    },
  };
}

export default async function ReviewsPage() {
  const data = await getReviewsPage();
  const reviews = data.reviews || [];

  const reviewsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.title || 'Read all reviews',
    description: data.subtitle,
    url: `${env.NEXT_PUBLIC_APP_URL || 'https://www.staywithmiio.com'}/reviews`,
    numberOfItems: reviews.length,
    itemListElement: reviews.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating || 5,
          bestRating: 5,
        },
        author: {
          '@type': 'Person',
          name: r.author || 'Guest',
        },
        reviewBody: r.quote,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FEF6EE] font-[family-name:var(--font-instrument-sans)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />

      <main className="pt-10 md:pt-14 pb-20 md:pb-28">
        <Container>
          {/* Top navigation / Back link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#5F4E44] hover:text-[#1B1A17] transition-colors focus:outline-none"
            >
              <span aria-hidden="true">&larr;</span>
              <span>Back to home</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-flex items-center rounded-full bg-[#99583D] text-white text-[11px] font-medium px-3 py-1 uppercase tracking-wider">
                Verified Feedback
              </span>
              {reviews.length > 0 && (
                <span className="text-xs text-[#5F4E44] font-medium tracking-wide">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>

            <h1 className="font-serif text-[36px] md:text-[48px] text-[#1B1A17] tracking-tight leading-[1.15] mb-4">
              {data.title || 'Read all reviews'}
            </h1>

            <p className="font-sans text-[15px] md:text-[17px] text-[#5F4E44] font-light leading-[1.6]">
              {data.subtitle ||
                'Verified feedback and impressions from guests who have stayed across our properties.'}
            </p>
          </div>

          {/* Reviews Grid */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              {reviews.map((review, index) => (
                <TestimonialCard
                  key={review.id || `${review.author}-${index}`}
                  item={review}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <h3 className="font-serif text-2xl text-[#1B1A17] mb-3">No reviews found</h3>
              <p className="text-[#5F4E44] text-sm">
                Guest reviews are currently being updated in our system.
              </p>
            </div>
          )}
        </Container>
      </main>

      {/* Direct Booking CTA */}
      <FinalCTA
        defaults={{
          heading: 'A more direct way to stay',
          description:
            'Book directly for the best available rates, bespoke recommendations, and a more considered experience.',
          buttonText: 'Explore all stays',
          buttonLink: '/properties',
        }}
      />
    </div>
  );
}

