'use client';

import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There was a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The sign in link is no longer valid or has expired.',
    Default: 'An error occurred while signing in.',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Authentication Error</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {errorMessage}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
