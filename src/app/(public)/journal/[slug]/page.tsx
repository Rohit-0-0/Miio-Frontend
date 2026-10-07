import { AppImage } from '@/components/media/AppImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journalService } from '@/services/journal.service';
import { propertyService } from '@/services/property.service';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';
import { RichTextRenderer } from '@/components/ui/editor/RichTextRenderer';
import { PropertyBrowseCard } from '@/components/properties/PropertyBrowseCard';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { data: article } = await journalService.getArticleBySlug(slug, { next: { revalidate: 300 } });
    return {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt || '',
    };
  } catch {
    return { title: 'Article Not Found' };
  }
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article;

  try {
    const response = await journalService.getArticleBySlug(slug);
    article = response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      if ((error as { response: { status?: number } }).response?.status === 404) {
        notFound();
      }
    }
    if (error && typeof error === 'object' && 'status' in error) {
      if ((error as { status?: number }).status === 404) {
        notFound();
      }
    }
    throw error;
  }

  if (!article) {
    notFound();
  }

  let propertiesData: any[] = [];
  const relatedProperties = article?.relatedProperties || (article?.relatedProperty ? [article.relatedProperty] : []);
  
  if (relatedProperties.length > 0) {
    try {
      const propertyPromises = relatedProperties
        .filter((rp: any) => rp && rp.guestyListingId)
        .map((rp: any) => propertyService.get(rp.guestyListingId));
        
      const results = await Promise.allSettled(propertyPromises);
      propertiesData = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && !!r.value?.data)
        .map((r) => r.value.data);
    } catch (e) {
      console.error('Failed to load related properties', e);
    }
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className="flex flex-col bg-[#FEF6EE] min-h-screen pb-24">
      {/* Cover Image Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-[#EAE8E1] mb-12 md:mb-20">
        <AppImage
          image={article.coverImage}
          alt={article.coverImage?.alt || article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href={ROUTES.JOURNAL}
            className="inline-flex items-center text-[13px] font-medium tracking-widest uppercase text-[#7D7975] hover:text-[#1B1A17] mb-8 transition-colors"
          >
            <span aria-hidden="true" className="mr-2">&larr;</span>
            Back to Journal
          </Link>

          {/* Header Metadata */}
          <div className="mb-12 border-b border-[#1B1A17]/10 pb-12">
            <div className="flex items-center space-x-2 text-[13px] font-medium uppercase tracking-widest text-[#7D7975] mb-4">
              <span>{publishedDate || 'Miio Journal'}</span>
            </div>

            <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {article.author && (
              <div className="text-[15px] text-[#5F4E44] font-medium">
                By {article.author}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#1B1A17] prose-headings:font-normal prose-p:font-sans prose-p:text-[#5F4E44] prose-p:leading-relaxed prose-p:font-light prose-a:text-[#99583D] hover:prose-a:text-[#1B1A17] prose-a:transition-colors prose-strong:text-[#1B1A17] prose-strong:font-medium">
            <RichTextRenderer html={article.content} />
          </div>

          {/* Related Properties CTA */}
          {propertiesData.length > 0 && (
            <div className="mt-24">
              <h3 className="text-2xl font-serif text-[#1B1A17] mb-8 tracking-tight text-center">
                {article.ctaTitle || 'Experience this destination'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {propertiesData.map((propertyData, index) => {
                  const rp = relatedProperties?.[index];
                  return (
                    <PropertyBrowseCard
                      key={propertyData.guestyId || propertyData.id || propertyData._id}
                      id={propertyData.guestyId || propertyData.id || propertyData._id}
                      slug={propertyData.slug || propertyData.guestyId || propertyData.id || propertyData._id}
                      name={propertyData.title || propertyData.nickname || 'View Property'}
                      nickname={propertyData.nickname || propertyData.title}
                      location={
                        [propertyData.location?.city, propertyData.location?.country].filter(Boolean).join(', ') ||
                        'Location available on request'
                      }
                      guests={propertyData.accommodates || propertyData.maxGuests || 2}
                      bedrooms={propertyData.bedrooms || 1}
                      price={
                        propertyData.prices?.basePrice
                          ? `$${propertyData.prices?.currency === 'USD' ? '' : (propertyData.prices?.currency || '')}${propertyData.prices?.basePrice}`
                          : 'Enquire'
                      }
                      priceLabel={propertyData.prices?.basePrice ? '/ night' : ''}
                      coverImage={
                        propertyData.coverImageId || 
                        propertyData.picture?.large || 
                        propertyData.picture?.regular || 
                        propertyData.pictures?.[0]?.original || 
                        rp?.galleryOverrides?.[0]?.asset?.url
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
