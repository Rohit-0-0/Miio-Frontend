import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <Container className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">404</h2>
        <p className="text-xl text-gray-600">Page Not Found</p>
        <Link
          href="/"
          className="inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Return Home
        </Link>
      </Container>
    </div>
  );
}
