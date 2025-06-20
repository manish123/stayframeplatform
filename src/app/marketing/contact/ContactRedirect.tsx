"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with feedback modal open
    router.replace('/?showFeedback=true');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium">Redirecting to feedback form...</p>
      </div>
    </div>
  );
}
