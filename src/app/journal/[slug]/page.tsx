import { AppImage } from '@/components/media/AppImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journalService } from '@/services/journal.service';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { data: article } = await journalService.getArticleBySlug(slug);
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

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className="flex flex-col bg-white flex-1 pb-24">
      {/* Cover Image Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-100 mb-12 md:mb-20">
        <AppImage
          image={article.coverImage}
          alt={article.coverImage?.alt || article.title}
          fill
          priority
        />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href={ROUTES.JOURNAL}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <span aria-hidden="true" className="mr-2">&larr;</span>
            Back to Journal
          </Link>

          {/* Header Metadata */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              {article.category && <span>{article.category}</span>}
              {article.category && (article.readingTime || publishedDate) && <span>&middot;</span>}
              {article.readingTime && <span>{article.readingTime} min read</span>}
              {article.readingTime && publishedDate && <span>&middot;</span>}
              {publishedDate && <span>{publishedDate}</span>}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {article.author && (
              <div className="text-lg text-gray-600 font-medium">
                By {article.author}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg md:prose-xl prose-gray max-w-none prose-headings:font-serif prose-p:leading-relaxed">
            {/* For now, just rendering plain text content as a paragraph, 
                ideally this would be processed markdown or portable text */}
            <p className="whitespace-pre-wrap">{article.content}</p>
          </div>
        </div>
      </Container>
    </article>
  );
}
