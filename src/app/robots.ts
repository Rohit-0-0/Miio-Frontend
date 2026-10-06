import { MetadataRoute } from 'next';
import { env } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'https://www.miio.com.au';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/studio', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
