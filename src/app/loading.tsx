import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEF6EE] animate-in fade-in duration-500 pt-32 pb-24">
      <Container className="w-full max-w-4xl space-y-8">
        <Skeleton className="h-12 w-1/3 bg-[#EAE8E1]" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full bg-[#EAE8E1]" />
          <Skeleton className="h-6 w-5/6 bg-[#EAE8E1]" />
          <Skeleton className="h-6 w-4/6 bg-[#EAE8E1]" />
        </div>
      </Container>
    </div>
  );
}
