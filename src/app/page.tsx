import { Container } from '@/components/ui/Container';

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Container className="text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gray-900">
          Miio Frontend Ready
        </h1>
      </Container>
    </main>
  );
}
