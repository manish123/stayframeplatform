import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { FeedbackProvider } from '@/components/feedback/FeedbackContext';
import { cn } from '@/lib/utils';
import './feedback-styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Feedback | StayFrame',
  description: 'Manage and respond to user feedback',
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <FeedbackProvider>
          {children}
          <Toaster />
        </FeedbackProvider>
      </body>
    </html>
  );
}
