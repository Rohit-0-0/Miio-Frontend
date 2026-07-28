import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SkeletonCard } from '@/components/shared/SkeletonCard';

export default function JournalLoading() {
  return (
    <div className="flex flex-col bg-gray-50 flex-1">
      <Section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-6" />
            <div className="h-6 w-full bg-gray-200 rounded" />
          </div>
        </Container>
      </Section>

      <Section className="py-8 md:py-12">
        <Container>
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-12 animate-pulse">
            <div className="h-10 w-full max-w-sm bg-gray-200 rounded" />
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
