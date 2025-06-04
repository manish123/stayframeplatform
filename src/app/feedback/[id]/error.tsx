'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-red-800">
          Failed to load feedback
        </h2>
        <p className="mt-2 text-sm text-red-700">
          {error.message || 'An error occurred while loading the feedback details.'}
        </p>
        <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-3 sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => router.push('/feedback')}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feedback
          </Button>
          <Button
            variant="primary"
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
