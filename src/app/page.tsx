// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolSelector } from '@/components/ToolSelector';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { KnowledgeHub } from '@/components/KnowledgeHub';
import { CallToAction } from '@/components/CallToAction';

export default function Home() {
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);

  const handleGetStarted = () => {
    setIsToolSelectorOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
        <Stats />
        <KnowledgeHub />
        <CallToAction onGetStarted={handleGetStarted} />
      </main>

      <Footer />
      
      <ToolSelector open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen} />
    </div>
  );
}