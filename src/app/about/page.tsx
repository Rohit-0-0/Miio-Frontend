import { Metadata } from 'next';
import { getAboutData } from '@/lib/server/about';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutStory } from '@/components/about/AboutStory';
import { AboutMissionVision } from '@/components/about/AboutMissionVision';
import { AboutValues } from '@/components/about/AboutValues';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { AboutDocument } from '@/types/about';

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getAboutData();
    const data = response.data;
    if (data?.seo) {
      return {
        title: data.seo.title,
        description: data.seo.description,
        keywords: data.seo.keywords,
      };
    }
    return {
      title: data?.hero?.title || 'About Us - Miio',
      description: data?.mission?.description || 'Learn more about Miio.',
    };
  } catch (error) {
    return {
      title: 'About Us - Miio',
      description: 'Learn more about Miio.',
    };
  }
}

export default async function AboutPage() {
  let data: AboutDocument | undefined;
  let hasError = false;

  try {
    const response = await getAboutData();
    data = response.data;
  } catch (error) {
    console.error('Failed to load about page:', error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="pt-24 pb-12">
        <ErrorState
          title="Unable to load page"
          message="There was an error loading the about information. Please try again later."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Information Unavailable"
        description="We are currently updating our about page. Please check back later."
      />
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {data.hero && <AboutHero hero={data.hero} />}
      {data.story && <AboutStory story={data.story} />}
      {(data.mission || data.vision) && (
        <AboutMissionVision mission={data.mission} vision={data.vision} />
      )}
      {data.values && data.values.length > 0 && <AboutValues values={data.values} />}
    </main>
  );
}
