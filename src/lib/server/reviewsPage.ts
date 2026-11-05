import { sanityFetch } from './sanityFetch';
import { env } from '@/config/env';

export interface NormalizedReviewItem {
  id: string;
  quote: string;
  author: string;
  date?: string;
  location?: string;
  source?: string;
  rating?: number;
  sourceLogo?: any;
}

export interface ReviewsPageData {
  title: string;
  subtitle: string;
  reviews: NormalizedReviewItem[];
  seo?: any;
}

function resolveLocationName(subtitle?: string, listingId?: string): string {
  const text = (subtitle || '').toLowerCase();
  if (text.includes('bondi')) return 'Bondi';
  if (text.includes('paddington') || text.includes('heritage')) return 'Paddington';
  if (text.includes('vaucluse') || text.includes('pacific ocean') || text.includes('coast'))
    return 'Vaucluse';

  if (listingId === '69c32209712a2a0015a32a73' || listingId === '69d546d26109a000139a739a')
    return 'Bondi';
  if (listingId === '6942541e127a380014becbaf') return 'Paddington';
  if (listingId === '698e9c8616e3f700137aea19') return 'Vaucluse';

  return 'Sydney';
}

export async function getReviewsPage(): Promise<ReviewsPageData> {
  try {
    // 1. Fetch reviewsPage singleton and existing curated reviews across Sanity
    const [pageConfig, propertyEditorials] = await Promise.all([
      sanityFetch<any>({
        query: `*[_type == "reviewsPage"][0]{
          title,
          subtitle,
          featuredReviews,
          manualReviews[]->{
            _id,
            author,
            quote,
            date,
            location,
            source,
            rating,
            sourceLogo
          },
          seo
        }`,
      }),
      sanityFetch<any[]>({
        query: `*[_type == "propertyEditorial" && defined(reviews)]{
          "listingId": guestyListingId,
          subtitle,
          reviews
        }`,
      }),
    ]);

    // 2. Gather all curated reviews from property editorials
    const reviewPool = new Map<string, NormalizedReviewItem>();

    (propertyEditorials || []).forEach((pe: any) => {
      const loc = resolveLocationName(pe.subtitle, pe.listingId);
      (pe.reviews || []).forEach((r: any) => {
        if (!r?.quote) return;
        const key = r.reviewId || r._key || r.quote.slice(0, 30);
        reviewPool.set(key, {
          id: key,
          quote: r.quote,
          author: r.author || 'Guest',
          date: r.date || '',
          location: loc,
          source: r.source || 'Airbnb',
          rating: Number(r.rating) || 5,
        });
      });
    });

    // 3. Try to fetch additional Guesty reviews from backend if reachable
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/reviews?limit=100`, {
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const apiReviews = json.data || [];
        apiReviews.forEach((r: any) => {
          if (!r?.quote) return;
          const key = r.id || r.reviewId || r.quote.slice(0, 30);
          if (!reviewPool.has(key)) {
            reviewPool.set(key, {
              id: key,
              quote: r.quote,
              author: r.author || 'Guest',
              date: r.date || '',
              location: resolveLocationName('', r.listingId),
              source: r.source || 'Airbnb',
              rating: Number(r.rating) || 5,
            });
          }
        });
      }
    } catch {
      // Backend may be offline during static compilation or local dev
    }

    // 4. Also check manual reviews from Sanity
    const manualItems: NormalizedReviewItem[] = (pageConfig?.manualReviews || []).map((m: any) => ({
      id: m._id,
      quote: m.quote,
      author: m.author || 'Guest',
      date: m.date || '',
      location: m.location || 'Sydney',
      source: m.source || 'Verified stay',
      rating: Number(m.rating) || 5,
      sourceLogo: m.sourceLogo,
    }));

    // 5. If specific featuredReviews are selected in Sanity, prioritize them in order
    const selectedRefs: any[] = pageConfig?.featuredReviews || [];
    let finalReviews: NormalizedReviewItem[] = [];

    if (selectedRefs.length > 0) {
      selectedRefs.forEach((ref) => {
        const item = reviewPool.get(ref.reviewId);
        if (item) {
          finalReviews.push(item);
        }
      });
      // Append any manual reviews configured
      finalReviews.push(...manualItems);
    }

    // 6. If no specific reviews were selected yet, show all curated property reviews
    if (finalReviews.length === 0) {
      finalReviews = [...Array.from(reviewPool.values()), ...manualItems];
    }

    // Deduplicate by quote text
    const seenQuotes = new Set<string>();
    const deduplicatedReviews = finalReviews.filter((item) => {
      const normalizedQuote = item.quote.trim().toLowerCase();
      if (seenQuotes.has(normalizedQuote)) return false;
      seenQuotes.add(normalizedQuote);
      return true;
    });

    return {
      title: pageConfig?.title || 'Read all reviews',
      subtitle:
        pageConfig?.subtitle ||
        'Verified feedback and impressions from guests who have stayed across our properties.',
      reviews: deduplicatedReviews,
      seo: pageConfig?.seo,
    };
  } catch (err) {
    console.error('Error in getReviewsPage:', err);
    return {
      title: 'Read all reviews',
      subtitle:
        'Verified feedback and impressions from guests who have stayed across our properties.',
      reviews: [],
    };
  }
}
