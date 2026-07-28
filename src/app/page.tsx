import { Hero } from '@/components/home/Hero';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { AboutPreview } from '@/components/home/AboutPreview';
import { JournalPreview } from '@/components/home/JournalPreview';
import { PartnerCTA } from '@/components/home/PartnerCTA';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <AboutPreview />
      <JournalPreview />
      <PartnerCTA />
      <FinalCTA />
    </>
  );
}
