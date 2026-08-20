import React from 'react';
import { JournalCard } from '@/components/journal/JournalCard';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface RelatedJournalsProps {
  journals: any[];
}

export function RelatedJournals({ journals }: RelatedJournalsProps) {
  if (!journals || journals.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 md:mt-24 border-t border-gray-100 pt-16 md:pt-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 tracking-tight">
            Read the Journal
          </h2>
          <p className="text-gray-600 font-serif leading-relaxed text-lg">
            Discover more about this property and the surrounding area.
          </p>
        </div>
        <Link 
          href={ROUTES.JOURNAL}
          className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-base font-medium hover:border-gray-900 transition-colors shrink-0 group"
        >
          View all stories
          <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
        {journals.filter((journal, index, self) => 
          index === self.findIndex((j) => (j._id || j.id) === (journal._id || journal.id))
        ).map((journal) => (
          <JournalCard
            key={journal._id || journal.id}
            article={{
              _id: journal._id || journal.id,
              _createdAt: journal._createdAt || new Date().toISOString(),
              _updatedAt: journal._updatedAt || new Date().toISOString(),
              title: journal.title,
              slug: journal.slug?.current || journal.slug,
              excerpt: journal.excerpt,
              coverImage: journal.coverImage || journal.heroImage,
              author: journal.author,
              category: journal.category,
              readingTime: journal.readingTime,
              publishedAt: journal.publishDate || journal.publishedAt,
              featured: false,
              status: journal.status || 'published',
              content: journal.content || ''
            }}
          />
        ))}
      </div>
    </section>
  );
}
