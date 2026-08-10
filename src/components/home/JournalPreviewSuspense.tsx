import React from 'react';
import { getJournalListing } from '@/lib/server/journal';
import { JournalPreview } from '@/components/home/JournalPreview';

export async function JournalPreviewSuspense({ journal }: { journal: any }) {
  let articles: any[] = [];
  try {
    const featuredRes = await getJournalListing({ limit: '3', featured: 'true' });
    articles = featuredRes.data || [];
    
    if (articles.length === 0) {
      const fallbackRes = await getJournalListing({ limit: '3' });
      articles = fallbackRes.data || [];
    }
  } catch (err) {
    console.error('Failed to resolve journal articles:', err);
  }

  if (articles.length === 0) return null;

  return <JournalPreview journal={journal} articles={articles} />;
}
