'use client';

import { KnowledgeHub } from '@/components/KnowledgeHub';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function KnowledgePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <KnowledgeHub />
        </div>
      </main>
      <Footer />
    </div>
  );
}
