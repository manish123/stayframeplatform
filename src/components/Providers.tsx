'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './providers/theme-provider';
import { Toaster } from './ui/toaster';
import { FeedbackWidget } from './FeedbackWidget';

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
        <FeedbackWidget />
      </ThemeProvider>
    </SessionProvider>
  );
}
