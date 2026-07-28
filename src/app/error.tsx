'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <Container className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="text-gray-600">We apologize for the inconvenience.</p>
        <Button onClick={() => reset()} className="bg-gray-900 text-white">
          Try again
        </Button>
      </Container>
    </div>
  );
}
