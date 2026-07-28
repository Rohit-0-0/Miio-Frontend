import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { JournalCard } from './JournalCard';

// Realistic placeholder data
const ARTICLES = [
  {
    slug: 'art-of-slow-travel',
    category: 'Travel',
    title: 'The Art of Slow Travel',
    excerpt: 'In a world obsessed with speed, we explore the profound benefits of slowing down, savoring the moment, and fully immersing yourself in a single destination.',
  },
  {
    slug: 'sustainable-luxury',
    category: 'Design',
    title: 'Sustainable Luxury in Modern Architecture',
    excerpt: 'How leading architects are redefining premium spaces by integrating eco-friendly materials and energy-efficient systems without compromising on aesthetics.',
  },
  {
    slug: 'culinary-escapes',
    category: 'Culture',
    title: 'Culinary Escapes: A Taste of Tuscany',
    excerpt: 'Discover the hidden gems of Italian cuisine through the eyes of local chefs, focusing on farm-to-table practices and generations-old traditions.',
  },
];

export function JournalPreview() {
  return (
    <Section className="bg-gray-50 border-t border-gray-100">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              The Journal
            </h2>
            <p className="text-gray-600 text-lg">
              Insights, stories, and inspiration curated for the modern traveler.
            </p>
          </div>
          
          <Link
            href={ROUTES.JOURNAL}
            className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:underline rounded-sm whitespace-nowrap"
          >
            View All Articles
            <span className="ml-2" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {ARTICLES.map((article) => (
            <JournalCard
              key={article.slug}
              slug={article.slug}
              category={article.category}
              title={article.title}
              excerpt={article.excerpt}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
