// src/app/quote/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 relative z-0">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{ className: 'z-[90]' }} />
    </div>
  );
}