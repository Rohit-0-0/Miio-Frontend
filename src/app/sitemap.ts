import { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { getPropertyListing } from '@/lib/server/property';
import { getLocations } from '@/lib/server/location';
import { getJournalListing } from '@/lib/server/journal';
import { PropertyDocument } from '@/types/property';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'https://www.miio.com.au';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/partner-with-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/interior-design`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [propertiesRes, locationsRes, journalsRes] = await Promise.allSettled([
      getPropertyListing<PropertyDocument>({ limit: '100' }, { next: { revalidate: 3600 } }),
      getLocations({ next: { revalidate: 3600 } }),
      getJournalListing({ limit: '100' }, { next: { revalidate: 3600 } })
    ]);

    if (propertiesRes.status === 'fulfilled' && propertiesRes.value?.data) {
      const propertyPages: MetadataRoute.Sitemap = propertiesRes.value.data.map((property) => ({
        url: `${baseUrl}/properties/${property.slug || property.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));
      dynamicPages.push(...propertyPages);
    }

    if (locationsRes.status === 'fulfilled' && locationsRes.value) {
      const locationPages: MetadataRoute.Sitemap = locationsRes.value.map((loc: any) => ({
        url: `${baseUrl}/locations/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      dynamicPages.push(...locationPages);
    }

    if (journalsRes.status === 'fulfilled' && journalsRes.value?.data) {
      const journalPages: MetadataRoute.Sitemap = journalsRes.value.data.map((journal: any) => ({
        url: `${baseUrl}/journal/${journal.slug}`,
        lastModified: new Date(journal.publishedAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
      dynamicPages.push(...journalPages);
    }
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries:', error);
  }

  return [...staticPages, ...dynamicPages];
}
