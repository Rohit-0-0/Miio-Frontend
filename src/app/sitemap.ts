import { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { getPropertyListing } from '@/lib/server/property';
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
  ];

  try {
    const propertiesRes = await getPropertyListing<PropertyDocument>({ limit: '1000' }, { next: { revalidate: 3600 } });
    if (propertiesRes?.data) {
      const propertyPages: MetadataRoute.Sitemap = propertiesRes.data.map((property) => ({
        url: `${baseUrl}/properties/${property.slug || property.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));
      return [...staticPages, ...propertyPages];
    }
  } catch (error) {
    console.error('Failed to generate sitemap for properties:', error);
  }

  return staticPages;
}
