'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import the ReelGenerator component with SSR disabled
const ReelGenerator = dynamic(
  () => import('./ReelGenerator'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Reel Generator...</p>
        </div>
      </div>
    ) 
  }
);

export default function ReelPage() {
  const searchParams = useSearchParams();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Check URL for template parameter on component mount
  useEffect(() => {
    const templateParam = searchParams.get('template');
    setShowTemplateModal(!templateParam || templateParam === 'true');
  }, [searchParams]);

  return (
    <ReelGenerator 
      showTemplateModal={showTemplateModal}
      onTemplateModalClose={() => setShowTemplateModal(false)}
    />
  );
}
