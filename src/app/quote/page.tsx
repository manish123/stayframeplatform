'use client';

import dynamic from 'next/dynamic';

// Import the QuoteGenerator component with SSR disabled
const QuoteGenerator = dynamic(
  () => import('./QuoteGenerator'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Quote Generator...</p>
        </div>
      </div>
    ) 
  }
);

export default function QuotePage() {
  return <QuoteGenerator />;
}